import { Uploady } from '@rpldy/chunked-uploady';
import c from 'classnames';
import { Form, Formik } from 'formik';
import React from 'react';
import { Navigate } from 'react-router';

import * as Button from '../Common/Buttons';
import { MultipleChoice, SingleChoice } from '../Common/Form/ChoiceField';
import { Files } from '../Common/Form/Files';
import { LongText, ShortText } from '../Common/Form/TextField';
import { TextWithHints } from '../Common/Form/TextWithHintsField';
import { Card, Page } from '../Common/Layout';
import { apiBase } from '../Utils/ApiBase';
import { makeFieldPath } from '../Utils/FieldPath';
import { Maybe } from '../Utils/Maybe';
import { WithID } from '../Utils/WithID';
import {
  createFilesValue,
  createLongTextValue,
  createMultipleChoiceValue,
  createShortTextValue,
  createSingleChoiceValue,
  createTextWithHintsValue,
  FieldValue,
  isEmpty,
} from './FieldValue';
import { Property, Request } from './Request';
import { DetailField, Field, IndirectField, isField } from './RequestSchema';
import { requestSchemas, requestValidations } from './RequestTypes';
import fieldLib from './RequestTypes/field-library.json';

export default function RequestDetailForm<T>({
  title,
  requestType,
  request,
  properties,
  onSubmit,
}: {
  title: string;
  requestType: string;
  request?: Maybe<WithID<Request>>;
  properties?: Property[];
  onSubmit: (values: { [_: string]: FieldValue }) => Promise<T>;
}) {
  const schema = requestSchemas.get(requestType);

  if (!schema) {
    console.log(`Error, schema for type ${requestType} not found`);
    return <Navigate to="/404" />;
  }

  const transformFields = (sectionTitle: string, fs: (Field | IndirectField)[]) =>
    fs.mapMaybe(resolveInclude).map(f => ({ ...f, path: makeFieldPath(sectionTitle, f.name) }));
  const sections = schema.sections.map(s => ({
    title: s.title,
    fields: transformFields(s.title, s.fields),
  }));
  const fields = sections.map(s => s.fields).reduce((acc, f) => acc.concat(f));

  const initialValues: { [_: string]: FieldValue } = fields.reduce(
    (acc, f) => ({
      ...acc,
      [f.path]: getDefValue(f, properties),
    }),
    { title: { type: 'text-short', content: request?.name || '' } }
  );
  const specificValidate = requestValidations.get(requestType) || (() => ({}));
  const generalValidate = getValidateForFields(fields);

  return (
    <Page title={title}>
      <Card className="mb-12 max-w-2xl mx-auto">
        <Uploady destination={{ url: `${apiBase}/files` }}>
          <Formik
            initialValues={initialValues}
            onSubmit={values => {
              onSubmit(values).catch(console.log);
            }}
            validate={values => ({
              ...specificValidate(values),
              ...generalValidate(values),
            })}
            validateOnChange
          >
            <Form className="flex flex-col items-start">
              <Section title="General information">
                <ShortText
                  path="title"
                  label="Request title"
                  description="How the request will be called in your requests overview"
                />
              </Section>
              {sections.map((s, ix) => (
                <Section title={s.title} key={s.title} isLast={ix + 1 === sections.length}>
                  {s.fields.map(f => makeField(f, title))}
                </Section>
              ))}

              <div className="flex justify-end w-full px-6 py-3 bg-gray-100">
                <Button.Cancel />
                <Button.Primary type="submit">Save changes</Button.Primary>
              </div>
            </Form>
          </Formik>
        </Uploady>
      </Card>
    </Page>
  );
}

function Section({
  title,
  isLast = false,
  children,
}: {
  title: string;
  isLast?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={c(
        'grid grid-cols-4 gap-8 px-6 py-6 border-gray-300 w-full',
        !isLast && 'border-b'
      )}
    >
      <div>
        <h2 className="text-xl text-gray-900 font-bold">{title}</h2>
      </div>
      <div className="col-span-3 grid grid-cols-1 gap-4">{children}</div>
    </div>
  );
}

function getDefValue(field: DetailField, properties: Maybe<Property[]>): FieldValue {
  const currentValue = properties?.find(p => p.active && p.propertyName === field.path)
    ?.propertyData;
  switch (field.type) {
    case 'text-short':
      return createShortTextValue(currentValue);
    case 'text-with-hints':
      return createTextWithHintsValue(currentValue);
    case 'single-choice':
      return createSingleChoiceValue(currentValue);
    case 'multiple-choice':
      return createMultipleChoiceValue(currentValue);
    case 'text-long':
      return createLongTextValue(currentValue);
    default:
      return createFilesValue(
        properties
          ?.filter(p => p.active && p.propertyName.startsWith(field.path))
          .map(p => p.propertyData)
          .join(';;;')
      );
  }
}

function getValidateForFields(fields: DetailField[]) {
  return (values: { [_: string]: FieldValue }) =>
    fields
      .filter(f => f.required)
      .reduce(
        (er, f) =>
          !values[f.path] || isEmpty(values[f.path])
            ? { ...er, [f.path]: 'This field is required' }
            : er,
        {}
      );
}

export function resolveInclude(field: Field | IndirectField): Maybe<Field> {
  return isField(field)
    ? field
    : resolveInclude((fieldLib as { [key: string]: Field | IndirectField })[field.include]);
}

function makeField(f: DetailField, sectionTitle: string) {
  const propsPack = {
    key: f.name,
    path: f.path,
    label: f.name,
    description: f.description,
    hint: f.hint,
  };

  switch (f.type) {
    case 'text-short':
      return <ShortText {...propsPack} />;
    case 'text-long':
      return <LongText {...propsPack} />;
    case 'text-with-hints':
      return <TextWithHints choices={f.choices} {...propsPack} />;
    case 'single-choice':
      return <SingleChoice choices={f.choices} {...propsPack} />;
    case 'multiple-choice':
      return <MultipleChoice choices={f.choices} {...propsPack} />;
    default:
      console.log(f);
      return <Files name={f.path} key={f.path} />;
  }
}
