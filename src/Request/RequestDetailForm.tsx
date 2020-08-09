import c from 'classnames';
import { Form, Formik } from 'formik';
import React from 'react';
import { Navigate } from 'react-router';

import * as Button from '../Common/Buttons';
import {
  Image,
  LongText,
  MultipleChoice,
  ShortText,
  SingleChoice,
  TextWithHints,
} from '../Common/Forms';
import { Card, Page } from '../Common/Layout';
import { makeFieldPath } from '../Utils/FieldPath';
import { Maybe } from '../Utils/Maybe';
import { Property, Request } from './Request';
import { DetailField, Field, FieldValue, IndirectField, isEmpty, isField } from './RequestSchema';
import requestSchemas, { requestValidations } from './RequestTypes';
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
  request?: Maybe<Request>;
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
    { title: request?.name || '' }
  );
  const specificValidate = requestValidations.get(requestType) || (() => ({}));
  const generalValidate = getValidateForFields(fields);

  return (
    <Page title={title}>
      <Card className="mb-12 max-w-2xl mx-auto">
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
    case 'multiple-choice':
      return currentValue?.split(';;;') || [];
    case 'text-with-hints':
      return currentValue ? { label: currentValue, value: currentValue } : { label: '', value: '' };
    default:
      return currentValue || '';
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
      return <Image key={makeFieldPath(sectionTitle, f.name)} />;
  }
}
