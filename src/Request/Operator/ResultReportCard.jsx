import React from 'react';
import { Form, Formik, useField } from 'formik';
import {
  Section,
  SingleChoice,
  LongText,
  Image,
  MultipleChoice,
  TextWithHints,
  ShortText,
} from '../../Common/Forms';
import * as Button from '../../Common/Buttons';

import { useAuth } from '../../Utils/Auth';
import { makeFieldPath } from '../../Utils/FieldPath';
import StatusPicker from './StatusPicker';

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

  const initialValues = {
    status: request.status,
    'operator:result/time-spent-(operator)': 0,
    'operator:result/time-spent-(machine)': 0,
    'operator:result/files': '',
    'operator:result/files-description': '',
  };

  return (
    <Card title="Edit the results">
      <Formik initialValues={initialValues} onSubmit={values => console.log(values)}>
        <StatusPicker />
      </Formik>
    </Card>
  );
}
