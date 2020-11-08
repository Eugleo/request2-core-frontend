import { Form, Formik } from 'formik';
import React from 'react';
import { Search } from 'react-feather';

import { createShortTextValue, ShortTextFieldValue } from '../Request/FieldValue';
import { SimpleText } from './Form/TextField';

export function SearchBar({
  query,
  onSubmit,
}: {
  query: string;
  onSubmit: ({ query }: { query: ShortTextFieldValue }) => void;
}): JSX.Element {
  return (
    <Formik
      initialValues={{ query: createShortTextValue(query) }}
      onSubmit={values => onSubmit(values)}
    >
      <Form className="mr-4 w-full relative">
        <SimpleText
          className="w-full h-full text-sm text-gray-800 pl-8 placeholder-gray-700"
          name="query"
          placeholder="Search all teams"
        />
        <Search
          style={{
            height: '1rem',
            left: '10px',
            top: '11px',
            width: '1rem',
          }}
          className="absolute text-gray-600 pointer-events-none"
        />
      </Form>
    </Formik>
  );
}
