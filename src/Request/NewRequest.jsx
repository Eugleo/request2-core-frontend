import React, { useMemo, useState } from 'react';
import { Formik, Form } from 'formik';
import { useParams, useNavigate } from 'react-router-dom';
import fieldLib from './RequestTypes/field-library.json';
import Page from '../Page/Page';
import {
  Section,
  ShortText,
  LongText,
  TextWithHints,
  SingleChoice,
  MultipleChoice,
  Image,
} from '../Common/Forms';

import validateSMR from './SmallMoleculeRequest';
import { PrimarySubmit } from '../Common/Buttons';
import { useAuth } from '../Utils/Auth';
import * as Button from '../Common/Buttons';
import { makeFieldPath } from '../Utils/FieldPath';
import { idToCode } from './RequestElements';
import Modal from '../Common/Modal';

// TODO Report errors on incorrect include
function resolveInclude(preField) {
  if (!preField.include) {
    return preField;
  }
  return resolveInclude({ ...preField, include: undefined, ...fieldLib[preField.include] });
}

function makeField(preField, sectionTitle) {
  const f = resolveInclude(preField);
  const name = makeFieldPath(sectionTitle, f.name);
  const label = f.name;
  switch (f.type) {
    case 'text-short':
      return (
        <ShortText
          name={name}
          label={label}
          description={f.description}
          hint={f.hint}
          key={f.name}
        />
      );
    case 'text-long':
      return (
        <LongText
          name={name}
          label={label}
          description={f.description}
          hint={f.hint}
          key={f.name}
        />
      );
    case 'text-with-hints':
      return (
        <TextWithHints
          name={name}
          label={label}
          description={f.description}
          hints={f.choices}
          hint={f.hint}
          key={f.name}
        />
      );
    case 'single-choice':
      return (
        <SingleChoice
          name={name}
          choices={f.choices}
          label={label}
          description={f.description}
          hint={f.hint}
          key={f.name}
        />
      );
    case 'multiple-choice':
      return (
        <MultipleChoice
          name={name}
          choices={f.choices}
          label={label}
          description={f.description}
          hint={f.hint}
          key={f.name}
        />
      );
    default:
      return <Image key={name} />;
  }
}

function makeSection(section) {
  return (
    <Section title={section.title} key={section.title} description={section.description}>
      {section.fields.map(f => makeField(f, section.title))}
    </Section>
  );
}

function getValidate(fields) {
  return values => {
    return fields
      .filter(f => f.required)
      .reduce(
        (er, f) =>
          !values[f.name] || values[f.name].length === 0
            ? { ...er, [f.name]: 'This field is required' }
            : er,
        {}
      );
  };
}

function stringify(value) {
  if (Array.isArray(value)) {
    return value.map(v => v.toString()).join(';;;');
  }
  if (typeof value === 'object') {
    return value.value;
  }
  return value.toString();
}

function submit(authPost, type, formValues, authorId, teamId) {
  console.log(formValues);

  const mkProp = (n, t, d) => ({
    authorId,
    dateAdded: Math.round(Date.now() / 1000),
    active: true,
    propertyName: n,
    propertyType: t,
    propertyData: d,
  });

  const status = mkProp('status', 'General', 'Pending');
  const title = mkProp('title', 'General', formValues.title);
  const details = Object.entries(formValues).map(([name, value]) =>
    mkProp(name, 'Detail', stringify(value))
  );

  return authPost('/requests', {
    props: [status, title, ...details],
    req: {
      name: formValues.title,
      authorId,
      teamId,
      status: 'Pending',
      requestType: type,
      dateCreated: Math.round(Date.now() / 1000),
    },
  });
}

// TODO Add "title" field

// TODO Check that the field names are unique
export default function NewRequestPage() {
  const [modalInfo, setModalInfo] = useState({ show: false, request: undefined });
  const { requestType } = useParams();
  const { auth, authPost } = useAuth();
  const navigate = useNavigate();

  const requestTypes = useMemo(() => {
    const types = new Map();
    const req = require.context('./RequestTypes', true, /^.*\.rcfg\.json$/im);
    req.keys().forEach(fileName => types.set(fileName.match(/[^/]+(?=\.rcfg)/)[0], req(fileName)));
    return types;
  }, []);

  if (requestTypes === null) {
    return <Page title="New Request" width="max-w-4xl" />;
  }

  const schema = requestTypes.get(requestType);
  const { sections } = schema;
  const fields = sections
    .map(s => s.fields.map(f => ({ section: s.title, ...f })))
    .flat()
    .map(field => resolveInclude(field));

  const initialValues = fields.reduce(
    (acc, { name, type, section }) => ({
      ...acc,
      [makeFieldPath(section, name)]: type === 'multiple-choice' ? [] : '',
    }),
    {}
  );

  // TODO Add proper error handling
  // TODO Add validation code specific for each type of request
  return (
    <Page title={`New ${schema.title}`} width="max-w-4xl">
      {modalInfo.show && modalInfo.request ? (
        <Modal title="Success!" closeText="Close" onClose={() => navigate(-1)}>
          <p className="mt-4">
            Your request has been submitted. Please tag your samples with the following ID so that
            the operators will be able to match them to your request
          </p>
          <div className="my-8 flex flex-row justify-center items-center ">
            <p className="text-gray-600 text-2xl">
              #{modalInfo.request.requestType.charAt(0).toUpperCase()}/
              {idToCode(modalInfo.request._id)}
            </p>
          </div>
        </Modal>
      ) : null}
      <div className="bg-white rounded-lg shadow-md mb-8 p-8">
        <Formik
          initialValues={initialValues}
          onSubmit={values => {
            submit(authPost, requestType, values, auth.userId, auth.user.team._id)
              .then(r =>
                r.status === 201
                  ? r.json()
                  : new Error('There was an error with processing your request')
              )
              .then(js => setModalInfo({ show: true, request: js.data }))
              .catch(console.log);
          }}
          validate={validateSMR(
            fields.map(f => ({ ...f, name: makeFieldPath(f.section, f.name) })),
            getValidate
          )}
          validateOnChange
        >
          <Form className="grid grid-cols-1 gap-12">
            <Section title="General information">
              <ShortText
                name="title"
                label="Request title"
                description="How the request will be called in your requests overview"
              />
            </Section>
            <div className="border-t-2 bg-gray-400 w-full" />
            {sections
              .map(makeSection)
              .concat()
              .map(s => [s])
              .flatMap((s, ix) => [
                s,
                <div key={`Sep${ix}`} className="border-t-2 bg-gray-400 w-full" />,
              ])}
            <div className="flex flex-row justify-between" key="submit">
              <PrimarySubmit>Submit the request</PrimarySubmit>
              <Button.Normal
                title="Cancel"
                classNames={['bg-white']}
                onClick={() => navigate(-1)}
              />
            </div>
          </Form>
        </Formik>
      </div>
    </Page>
  );
}
