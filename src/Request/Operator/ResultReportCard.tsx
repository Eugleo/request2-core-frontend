import Uploady, { UploadyContext } from '@rpldy/uploady';
import { Form, Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { TrinityRingsSpinner } from 'react-epic-spinners';
import { Check, X } from 'react-feather';

import { Image, LongText, ShortText } from '../../Common/Forms';
import { Card } from '../../Common/Layout';
import { useAuth } from '../../Utils/Auth';
import { WithID } from '../../Utils/WithID';
import { Property, Request } from '../Request';
import { FieldValue, stringify } from '../RequestSchema';

type ResultProperty = Property & { propertyType: 'Result' };

function submit(
  authorId: number,
  authPut: (url: string, data: { req: Request; props: ResultProperty[] }) => Promise<Response>,
  properties: { [k: string]: FieldValue },
  request: WithID<Request>
) {
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

// function Card({ title, children }) {
//   return (
//     <div className="col-span-3 w-full shadow-md rounded-md bg-white">
//       <h2 className="px-6 text-2xl border-b border-gray-200 py-6 font-bold w-full">{title}</h2>
//       {children}
//     </div>
//   );
// }

function SubmitButtonBody({ status }: { status: Status }) {
  switch (status) {
    case 'Default':
      return <p>Submit results</p>;
    case 'Pending':
      return <TrinityRingsSpinner size={10} className="w-3 h-3" />;
    case 'Success':
      return <Check />;
    default:
      return <X />;
  }
}

function SubmitButton({ status }: { status: Status }) {
  const uploady = useContext(UploadyContext);

  return (
    <button
      type="submit"
      onClick={() => uploady && uploady.processPending()}
      className="rounded-lg text-white shadow-sm bg-green-400 hover:bg-green-500 px-3 py-2 inline-flex items-center focus:outline-none font-medium text-sm"
    >
      <SubmitButtonBody status={status} />
    </button>
  );
}

type Status = 'Default' | 'Pending' | 'Success' | 'Error';

export default function ResultReportCard({
  request,
  refresh,
}: {
  request: WithID<Request>;
  refresh: () => void;
}) {
  const { auth, authPut } = useAuth<{ req: Request; props: ResultProperty[] }>();
  const [status, setStatus] = useState<Status>('Default');

  const initialValues = {
    'result/time-spent-(operator)': '',
    'result/time-spent-(machine)': '',
    'result/files': '',
    'result/files-description': '',
  };

  return (
    <Card className="mb-4 border border-green-300 shadow-none">
      <Uploady destination={{ url: `http://localhost:9080/requests/${request._id}/data/results` }}>
        <Formik
          initialValues={initialValues}
          onSubmit={values => {
            setStatus('Pending');
            submit(auth.user._id, authPut, values, request).then(r => {
              if (r.ok) {
                setStatus('Success');
              } else {
                setStatus('Error');
              }
            });
          }}
        >
          <Form className="bg-white rounded-md shadow-sm">
            <div className="grid grid-cols-4">
              <div className="col-span-4 mx-6 mt-6">
                <Image className="h-full" />
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

            <div className="col-span-5 bg-green-100 py-3 px-6 flex flex-row-reverse">
              <SubmitButton status={status} />
            </div>
          </Form>
        </Formik>
      </Uploady>
    </Card>
  );
}
