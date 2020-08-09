import React from 'react';
import { Form, Formik } from 'formik';
import { LongText, Image, ShortText } from '../../Common/Forms';
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

function submit(authorId, authPut, properties, request) {
  return authPut(`/requests/${request._id}`, {
    props: Object.entries(properties).map(([name, value]) => ({
      authorId,
      requestId: request._id,
      propertyType: 'Result',
      propertyName: name,
      propertyData: stringify(value),
      dateAdded: Math.round(Date.now() / 1000),
      active: true,
    })),
    req: request,
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
    'result/time-spent-(operator)': '',
    'result/time-spent-(machine)': '',
    'result/files': '',
    'result/files-description': '',
  };

  return (
    <Card title="Results">
      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          submit(auth.userId, authPut, values, request).then(r => console.log(r));
        }}
      >
        <Form className="col-span-3 bg-white rounded-md shadow-sm">
          <div className="border-b border-gray-200 grid grid-cols-5">
            <div className="col-span-1 bg-gray-200">
              <Image className="h-full border-none rounded-none shadow-none" />
            </div>

            <div className="col-span-4 grid grid-cols-4 px-6 py-4">
              <div className="row-span-2 col-span-3 flex flex-row items-stretch w-full h-full">
                <LongText
                  path="result/files-description"
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
                    path="result/time-spent-(operator)"
                    label="Time (operator)"
                  />
                </div>

                <div className="col-span-1">
                  <ShortText
                    type="number"
                    step="15"
                    min="0"
                    placeholder="0"
                    path="result/time-spent-(machine)"
                    label="Time (machine)"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-5 py-4 px-6 flex flex-row-reverse">
            <Button.Primary type="submit" title="Submit results" />
          </div>
        </Form>
      </Formik>
    </Card>
  );
}
