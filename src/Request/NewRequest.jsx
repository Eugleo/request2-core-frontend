import React from 'react';
import { Formik, Form } from 'formik';
import fieldLib from './RequestTypes/field-library.json';
import smallMolecule from './RequestTypes/small-molecule.rcfg.json';
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

// TODO Report errors on incorrect include
function resolveInclude(preField) {
  if (!preField.include) {
    return preField;
  }
  return resolveInclude({ ...preField, include: undefined, ...fieldLib[preField.include] });
}

function makeField(preField) {
  const f = resolveInclude(preField);
  switch (f.type) {
    case 'text-short':
      return <ShortText name={f.name} description={f.description} hint={f.hint} key={f.name} />;
    case 'text-long':
      return <LongText name={f.name} description={f.description} hint={f.hint} key={f.name} />;
    case 'text-with-hints':
      return <TextWithHints hints={f.choices} key={f.name} />;
    case 'single-choice':
      return (
        <SingleChoice
          name={f.name}
          choices={f.choices}
          description={f.description}
          hint={f.hint}
          key={f.name}
        />
      );
    case 'multiple-choice':
      return (
        <MultipleChoice
          name={f.name}
          choices={f.choices}
          description={f.description}
          hint={f.hint}
          key={f.name}
        />
      );
    default:
      return <Image key={f.name} />;
  }
}

function makeSection(section) {
  return (
    <Section title={section.title} key={section.title} description={section.description}>
      {section.fields.map(makeField)}
    </Section>
  );
}

function getFields(schema) {
  return schema.sections
    .map(section => section.fields)
    .flat()
    .map(field => resolveInclude(field));
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

// TODO Check that the field names are unique
export default function NewRequestPage() {
  const schema = smallMolecule;
  const fields = getFields(schema);

  const initialValues = fields.reduce(
    (acc, { name, type }) => ({
      ...acc,
      [name]: type === 'multiple-choice' ? [] : '',
    }),
    {}
  );

  return (
    <Page title={`New ${schema.title}`} width="max-w-4xl">
      <div className="bg-white  rounded-lg shadow-md mb-8 p-8">
        <Formik
          initialValues={initialValues}
          validate={validateSMR(fields, getValidate)}
          onSubmit={console.log}
          validateOnChange
        >
          <Form className="grid grid-cols-1 gap-12">
            {schema.sections
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
