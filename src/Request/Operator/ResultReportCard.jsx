import React from 'react';
import { Form, Formik, useField } from 'formik';
import { LongText, Image, ShortText } from '../../Common/Forms';
import * as Button from '../../Common/Buttons';

import { useAuth } from '../../Utils/Auth';
import { makeFieldPath } from '../../Utils/FieldPath';

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
        propertyPath: `operator:${name}`,
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
      <h2 className="px-6 text-2xl border-b border-gray-200 py-6 font-bold w-full">{title}</h2>
      {children}
    </div>
  );
}

export default function ResultReportCard({ request }) {
  const { auth, authPut } = useAuth();

  const initialValues = {
    status: request.status,
    'operator:result/time-spent-(operator)': '',
    'operator:result/time-spent-(machine)': '',
    'operator:result/files': '',
    'operator:result/files-description': '',
  };

  return (
    <Card title="Results">
      <Formik initialValues={initialValues} onSubmit={values => console.log(values)}>
        <Form className="col-span-3 bg-white rounded-md shadow-sm">
          <div className="border-b border-gray-200 grid grid-cols-5">
            <div className="col-span-1 bg-gray-200">
              <Image className="h-full border-none rounded-none shadow-none" />
            </div>

            <div className="col-span-4 grid grid-cols-4 px-6 py-4">
              <div className="row-span-2 col-span-3 flex flex-row items-stretch w-full h-full">
                <LongText
                  name="operator:result/files-description"
                  label="Description"
                  className="h-full w-full"
                />
              </div>

              <div className="col-span-1">
                <div className="col-span-1">
                  <ShortText
                    type="number"
                    step="15"
                    min="0"
                    placeholder="0"
                    name="operator:result/time-spent-(operator)"
                    label="Time (operator)"
                  />
                </div>

                <div className="col-span-1">
                  <ShortText
                    type="number"
                    step="15"
                    min="0"
                    placeholder="0"
                    name="operator:result/time-spent-(machine)"
                    label="Time (machine)"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-5 py-4 px-6 flex flex-row-reverse">
            <Button.PrimarySubmit title="Submit results" />
          </div>
        </Form>
      </Formik>
    </Card>
  );
}
