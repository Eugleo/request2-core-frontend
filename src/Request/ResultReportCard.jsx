import React from 'react';
import { useParams } from 'react-router-dom';
import c from 'classnames';
import { Form, Formik } from 'formik';
import {
  Section,
  SingleChoice,
  LongText,
  Image,
  MultipleChoice,
  TextWithHints,
  ShortText,
} from '../Common/Forms';
import * as Button from '../Common/Buttons';

import report from './RequestTypes/result-report.json';
import fieldLib from './RequestTypes/field-library.json';
import { useAuth } from '../Utils/Auth';

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
    return value.map(v => v.toString()).join(';;;');
  }
  if (typeof value === 'object') {
    return value.value;
  }
  return value.toString();
}

function submit(authPut, properties, authorId, request) {
  return authPut(`/requests/${request._id}`, {
    props: Object.entries(properties)
      .filter(f => f.name !== 'status/status')
      .map(([name, value]) => ({
        authorId,
        requestId: request._id,
        propertyType: `operator:${name}`,
        propertyData: stringify(value),
        dateAdded: Math.round(Date.now() / 1000),
        active: true,
      })),
    req: { ...request, status: properties['status/status'] },
  });
}

function Card({ title, children }) {
  return (
    <div className="col-span-3 w-full shadow-md rounded-md bg-white">
      <div className="">
        <h2 className="px-6 text-2xl border-b border-gray-200 py-6 mb-8 font-bold w-full">
          {title}
        </h2>
      </div>
      <div className="px-6 pb-6">{children}</div>
    </div>
  );
}

export default function ResultReportCard({ request }) {
  const { auth, authPut } = useAuth();

  const sections = [...report.sections];
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
    <Card title="Edit the results">
      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          submit(authPut, values, auth.userId, request);
        }}
        validateOnChange
      >
        <Form className="grid grid-cols-1 gap-12">
          {sections
            .map(makeSection)
            .concat()
            .map(s => [s])
            .flatMap((s, ix) => [
              s,
              <div key={`Sep${ix}`} className="border-t-2 bg-gray-400 w-full" />,
            ])}

          <div className="flex flex-row justify-between" key="submit">
            <Button.PrimarySubmit>Submit the results</Button.PrimarySubmit>
          </div>
        </Form>
      </Formik>
    </Card>
  );
}
