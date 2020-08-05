import React, { useMemo } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router';
import { Form, Formik } from 'formik';
import {
  LongText,
  ShortText,
  TextWithHints,
  SingleChoice,
  MultipleChoice,
  Image,
  Section,
} from '../../Common/Forms';
import fieldLib from '../RequestTypes/field-library.json';
import { makeFieldPath } from '../../Utils/FieldPath';
import { useAsyncGet } from '../../Utils/Api';
import { Page } from '../../Common/Layout';
import validateSMR from '../SmallMoleculeRequest';
import * as Button from '../../Common/Buttons';
import { useAuth } from '../../Utils/Auth';

function stringify(value) {
  if (Array.isArray(value)) {
    return value.map(v => v.toString()).join(';;;');
  }
  if (typeof value === 'object') {
    return value.value;
  }
  return value.toString();
}

function submit(authPut, authorId, request, formValues) {
  const mkProp = (n, t, d) => ({
    authorId,
    dateAdded: Math.round(Date.now() / 1000),
    active: true,
    propertyName: n,
    propertyType: t,
    propertyData: d,
    requestId: request._id,
  });

  const title = mkProp('title', 'General', formValues.title);
  const details = Object.entries(formValues)
    .filter(([name]) => name !== 'title')
    .map(([name, value]) => mkProp(name, 'Detail', stringify(value)));

  return authPut(`/requests/${request._id}`, {
    props: [title, ...details],
    req: {
      ...request,
      name: formValues.title,
    },
  });
}

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

function makeSection(section) {
  return (
    <Section title={section.title} key={section.title} description={section.description}>
      {section.fields.map(f => makeField(f, section.title))}
    </Section>
  );
}

export default function EditRequestPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { auth, authPut } = useAuth();
  const { data: payload, error, pending } = useAsyncGet(`/requests/${id}`);
  const request = payload && payload.request;
  const properties = payload && payload.properties;

  const requestTypes = useMemo(() => {
    const types = new Map();
    const req = require.context('../RequestTypes', true, /^.*\.rcfg\.json$/im);
    req.keys().forEach(fileName => types.set(fileName.match(/[^/]+(?=\.rcfg)/)[0], req(fileName)));
    return types;
  }, []);

  if (requestTypes === null) {
    return <Page title="New Request" width="max-w-4xl" />;
  }

  if (pending) {
    return <Page title="Editing request" />;
  }
  if (error) {
    console.log(error);
    return <Navigate to="/404" />;
  }

  const schema = requestTypes.get(request.requestType);
  const { sections } = schema;
  const fields = sections
    .map(s => s.fields.map(f => ({ section: s.title, ...f })))
    .flat()
    .map(field => resolveInclude(field));

  const initialValues = fields.reduce(
    (acc, { name, type: fieldType, section }) => {
      const propertyName = makeFieldPath(section, name);
      const { propertyData } = properties.find(p => p.active && p.propertyName === propertyName);
      return {
        ...acc,
        [propertyName]: fieldType === 'multiple-choice' ? propertyData.split(';;;') : propertyData,
      };
    },
    { title: request.name }
  );

  return (
    <Page title={`Editing ${request.name} request`} width="max-w-4xl">
      <div className="bg-white rounded-lg shadow-md mb-8 p-8">
        <Formik
          initialValues={initialValues}
          onSubmit={values => {
            submit(authPut, auth.userId, request, values)
              .then(() => navigate(-1))
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
              <Button.Primary type="submit">Save changes</Button.Primary>
              <Button.Cancel />
            </div>
          </Form>
        </Formik>
      </div>
    </Page>
  );
}
