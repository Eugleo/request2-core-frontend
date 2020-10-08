import Uploady, { UploadyContext } from '@rpldy/uploady';
import { Form, Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { TrinityRingsSpinner } from 'react-epic-spinners';
import { Check, X } from 'react-feather';

import { Files } from '../../Common/Form/Files';
import { LongText, ShortText } from '../../Common/Form/TextField';
import { Card } from '../../Common/Layout';
import { apiBase } from '../../Utils/ApiBase';
import { useAuth } from '../../Utils/Auth';
import { File, fileToString, isFileProperty } from '../../Utils/File';
import { WithID } from '../../Utils/WithID';
import {
  createFilesValue,
  createLongTextValue,
  createShortTextValue,
  FieldValue,
  fieldValueToString,
  FilesFieldValue,
  isFilesField,
  LongTextFieldValue,
  ShortTextFieldValue,
} from '../FieldValue';
import { Property, Request } from '../Request';

type ResultProperty = Property & { propertyType: 'Result' | 'ResultFile' };

type ResultStub = {
  'time-spent-(operator)': ShortTextFieldValue;
  'time-spent-(machine)': ShortTextFieldValue;
  files: FilesFieldValue;
  'files-description': LongTextFieldValue;
};

function submit(
  authorId: number,
  authPut: (url: string, data: { req: Request; props: ResultProperty[] }) => Promise<Response>,
  properties: { [k: string]: FieldValue },
  request: WithID<Request>
) {
  const normalProps: ResultProperty[] = Object.entries(properties)
    .filter(([, value]) => !isFilesField(value))
    .map(([name, value]) => ({
      authorId,
      requestId: request._id,
      propertyType: 'Result',
      propertyName: name,
      propertyData: fieldValueToString(value),
      dateAdded: Math.round(Date.now() / 1000),
      active: true,
    }));

  const fileProps: ResultProperty[] = Object.entries(properties)
    .map(([, val]) => val)
    .filter<{ type: 'files'; content: File[] }>(isFilesField)
    .flatMap(v => v.content)
    .map((f, ix) => ({
      authorId,
      requestId: request._id,
      propertyType: 'ResultFile',
      propertyName: `file-${ix}`,
      propertyData: fileToString(f),
      dateAdded: Math.round(Date.now() / 1000),
      active: true,
    }));

  return authPut(`/requests/${request._id}`, {
    props: normalProps.concat(fileProps),
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

type Status = 'Default' | 'Pending' | 'Success' | 'Error';

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

export default function RequestResultForm({
  request,
  stopEditing,
  resultProperties,
}: {
  request: WithID<Request>;
  stopEditing: () => void;
  resultProperties?: WithID<ResultProperty>[];
}) {
  const { auth, authPut } = useAuth<{ req: Request; props: ResultProperty[] }>();
  const [status, setStatus] = useState<Status>('Default');

  const getData = (name: string) => {
    return resultProperties?.find(p => p.propertyName === name)?.propertyData;
  };

  const files = resultProperties
    ?.filter(p => p.active && isFileProperty(p))
    .map(p => p.propertyData)
    .join(';;;');

  console.log(resultProperties);
  console.log(getData('files'));
  console.log(createFilesValue(files));

  const initialValues = {
    'time-spent-(operator)': createShortTextValue(getData('time-spent-(operator)')),
    'time-spent-(machine)': createShortTextValue(getData('time-spent-(machine)')),
    files: createFilesValue(files),
    'files-description': createLongTextValue(getData('files-description')),
  };

  return (
    <Card className="mb-4 border border-green-300 shadow-none">
      <Uploady destination={{ url: `${apiBase}/files` }}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values: ResultStub) => {
            setStatus('Pending');
            submit(auth.user._id, authPut, values, request).then(r => {
              if (r.ok) {
                setStatus('Success');
                stopEditing();
              } else {
                setStatus('Error');
              }
            });
          }}
        >
          <Form className="bg-white rounded-md shadow-sm">
            <div className="grid grid-cols-4">
              <div className="col-span-4 mx-6 mt-6">
                <Files name="files" className="h-full" />
              </div>

              <div className="col-span-4 grid grid-cols-4 px-6 py-4">
                <div className="row-span-2 col-span-3 flex flex-row items-stretch w-full h-full">
                  <LongText
                    path="files-description"
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
                      path="time-spent-(operator)"
                      label="Time (operator)"
                    />
                  </div>

                  <div className="col-span-1">
                    <ShortText
                      type="number"
                      step="15"
                      min="0"
                      placeholder="0"
                      path="time-spent-(machine)"
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
