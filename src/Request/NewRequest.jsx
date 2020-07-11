import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { useParams } from 'react-router-dom';
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

// TODO Report errors on incorrect include
function resolveInclude(preField) {
  if (!preField.include) {
    return preField;
  }
  return resolveInclude({ ...preField, include: undefined, ...fieldLib[preField.include] });
}

function fieldPath(section, propertyName) {
  const normalize = str => str.toLowerCase().replace(/\s+/g, '-');
  return `${normalize(section)}/${normalize(propertyName)}`;
}

function showFieldPath(fp) {
  const path = fp.match(/[^/]+$/)[0].replace(/-/g, ' ');
  return path.charAt(0).toUpperCase() + path.slice(1);
}

function makeField(preField, sectionTitle) {
  const f = resolveInclude(preField);
  const name = fieldPath(sectionTitle, f.name);
  const label = showFieldPath(name);
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
    value.map(v => v.toString()).join(',');
  } else if (typeof value === 'object') {
    return value.value;
  }

  return value.toString();
}

function submit(authPost, type, properties, authorId, teamId) {
  authPost('/requests', {
    props: Object.entries(properties)
      .filter(name => name !== 'request-description/sample-name')
      .map(([name, value]) => ({
        authorId,
        propertyType: name,
        propertyData: stringify(value),
        dateAdded: Math.round(Date.now() / 1000),
        active: true,
      })),
    req: {
      name: properties['request-description/sample-name'],
      authorId,
      teamId,
      status: 'Requested',
      requestType: type,
      dateCreated: Math.round(Date.now() / 1000),
      active: true,
    },
  });
}

// TODO Check that the field names are unique
export default function NewRequestPage() {
  const { requestType } = useParams();
  const { auth, authPost } = useAuth();

  const [requestTypes, setRequestTypes] = useState(null);
  useEffect(() => {
    const types = new Map();
    const req = require.context('./RequestTypes', true, /^.*\.rcfg\.json$/im);
    req.keys().forEach(fileName => types.set(fileName.match(/[^/]+(?=\.rcfg)/)[0], req(fileName)));
    setRequestTypes(types);
  }, [setRequestTypes]);

  if (requestTypes === null) {
    return <Page title="New Request" width="max-w-4xl" />;
  }

  const initialSection = {
    title: 'Request Description',
    fields: [{ include: '@sample-name', required: true }, { include: '@private-note' }],
  };
  const schema = requestTypes.get(requestType);
  const sections = [initialSection, ...schema.sections];
  const fields = sections
    .map(s => s.fields.map(f => ({ section: s.title, ...f })))
    .flat()
    .map(field => resolveInclude(field));

  const initialValues = fields.reduce(
    (acc, { name, type, section }) => ({
      ...acc,
      [fieldPath(section, name)]: type === 'multiple-choice' ? [] : '',
    }),
    {}
  );

  return (
    <Page title={`New ${schema.title}`} width="max-w-4xl">
      <div className="bg-white rounded-lg shadow-md mb-8 p-8">
        <Formik
          initialValues={initialValues}
          validate={validateSMR(fields, getValidate)}
          onSubmit={values =>
            submit(authPost, requestType, values, auth.userId, auth.user.team._id)
          }
          validateOnChange
        >
          <Form className="grid grid-cols-1 gap-12">
            {sections
              .map(makeSection)
              .concat(
                <div className="flex flex-row" key="submit">
                  <PrimarySubmit>Submit a new request</PrimarySubmit>
                </div>
              )
              .map(s => [s])
              .reduce((acc, s, ix) =>
                acc.concat(<div key={`Sep${ix}`} className="border-t-2 bg-gray-400 w-full" />, s)
              )}
          </Form>
        </Formik>
      </div>
    </Page>
  );
}
