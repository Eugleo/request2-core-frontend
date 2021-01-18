import Uploady, { UploadyContext } from '@rpldy/uploady';
import React, { useContext, useState } from 'react';
import { TrinityRingsSpinner } from 'react-epic-spinners';
import { Check, X } from 'react-feather';

import { Tertiary } from '../../Common/Buttons';
import { Card } from '../../Common/Layout';
import { apiBase } from '../../Utils/ApiBase';
import { useAuth } from '../../Utils/Auth';
import { WithID } from '../../Utils/WithID';
import { PropertyJSON, Request } from '../Request';

type ResultProperty = PropertyJSON & { propertyType: 'Result' | 'ResultFile' };

// function submit(
//   authorId: number,
//   authPut: (url: string, data: { req: Request; props: ResultProperty[] }) => Promise<Response>,
//   properties: { [k: string]: FieldValue },
//   request: WithID<Request>
// ) {
//   const normalProps: ResultProperty[] = Object.entries(properties)
//     .filter(([, value]) => !isFilesField(value))
//     .map(([name, value]) => ({
//       active: true,
//       authorId,
//       dateAdded: Math.round(Date.now() / 1000),
//       propertyData: fieldValueToString(value),
//       propertyName: name,
//       propertyType: 'Result',
//       requestId: request._id,
//     }));

//   const fileProps: ResultProperty[] = Object.entries(properties)
//     .map(([, val]) => val)
//     .filter<{ type: 'files'; content: FileInfo[] }>(isFilesField)
//     .flatMap(v => v.content)
//     .map((f, ix) => ({
//       active: true,
//       authorId,
//       dateAdded: Math.round(Date.now() / 1000),
//       propertyData: fileInfoToString(f),
//       propertyName: `file-${ix}`,
//       propertyType: 'ResultFile',
//       requestId: request._id,
//     }));

//   return authPut(`/requests/${request._id}`, {
//     props: normalProps.concat(fileProps),
//     req: request,
//   });
// }

// // function Card({ title, children }) {
// //   return (
// //     <div className="col-span-3 w-full shadow-md rounded-md bg-white">
// //       <h2 className="px-6 text-2xl border-b border-gray-200 py-6 font-bold w-full">{title}</h2>
// //       {children}
// //     </div>
// //   );
// // }

// function SubmitButtonBody({ status }: { status: Status }) {
//   switch (status) {
//     case 'Default':
//       return <p>Submit results</p>;
//     case 'Pending':
//       return <TrinityRingsSpinner size={10} className="w-3 h-3" />;
//     case 'Success':
//       return <Check />;
//     default:
//       return <X />;
//   }
// }

// type Status = 'Default' | 'Pending' | 'Success' | 'Error';

// function SubmitButton({ status }: { status: Status }) {
//   const uploady = useContext(UploadyContext);

//   return (
//     <button
//       type="submit"
//       onClick={() => {
//         uploady && uploady.processPending();
//       }}
//       className="rounded-md text-white shadow-sm bg-green-400 hover:bg-green-500 px-3 py-2 inline-flex items-center focus:outline-none font-medium text-sm"
//     >
//       <SubmitButtonBody status={status} />
//     </button>
//   );
// }

// export function RequestResultForm({
//   request,
//   stopEditing,
//   refreshResults,
//   properties: resultProperties,
// }: {
//   request: WithID<Request>;
//   stopEditing: () => void;
//   refreshResults: () => void;
//   properties?: WithID<ResultProperty>[];
// }): JSX.Element {
//   const { auth, authPut } = useAuth<{ req: Request; props: ResultProperty[] }>();
//   const [status, setStatus] = useState<Status>('Default');

//   const getData = (name: string) => {
//     return resultProperties?.find(p => p.name === name)?.value;
//   };

//   const files = resultProperties
//     ?.filter(p => p.active && isFileProperty(p))
//     .map(p => p.value)
//     .join(';;;');

//   const initialValues = {
//     description: createLongTextValue(getData('description')),
//     files: createFilesValue(files === '' ? undefined : files),
//     'human-time': createShortTextValue(getData('human-time')),
//     'machine-time': createShortTextValue(getData('machine-time')),
//   };

//   return (
//     <Card className="mb-4 border border-green-300 shadow-none">
//       <Uploady destination={{ url: `${apiBase}/files` }}>
//         <Formik
//           initialValues={initialValues}
//           onSubmit={async (values: ResultStub) => {
//             setStatus('Pending');
//             await submit(auth.user._id, authPut, values, request).then(r => {
//               if (r.ok) {
//                 console.log(values);
//                 setStatus('Success');
//                 stopEditing();
//                 refreshResults();
//               } else {
//                 setStatus('Error');
//               }
//             });
//           }}
//         >
//           <Form className="bg-white rounded-md shadow-sm">
//             <div>
//               <div className="mx-6 mt-6">
//                 <Files name="files" className="h-full" />
//               </div>

//               <div className="grid grid-cols-4 px-6 py-4">
//                 <div className="row-span-2 col-span-4 flex flex-row items-stretch w-full h-full">
//                   <LongText path="description" label="Description" className="h-full w-full" />
//                 </div>

//                 <div className="col-span-4 grid grid-cols-3">
//                   <ShortText
//                     type="number"
//                     min="0"
//                     placeholder="0"
//                     path="human-time"
//                     label="Human time"
//                     description="Enter time in minutes"
//                   />
//                   <ShortText
//                     type="number"
//                     min="0"
//                     placeholder="0"
//                     path="machine-time"
//                     label="Machine time"
//                     description="Enter time in minutes"
//                   />
//                   <TimeLabel />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-green-100 py-3 px-6 flex justify-end flex-row">
//               <CancelButton stopEditing={stopEditing} />
//               <SubmitButton status={status} />
//             </div>
//           </Form>
//         </Formik>
//       </Uploady>
//     </Card>
//   );
// }

// function CancelButton({ stopEditing }: { stopEditing: () => void }) {
//   const { authDel } = useAuth();
//   const { values } = useFormikContext<ResultStub>();

//   return (
//     <Tertiary
//       title="Cancel"
//       className="text-green-700 hover:text-green-800"
//       onClick={async () => {
//         const rs = await Promise.all(values.files.content.map(f => authDel(`/files/${f.hash}`, f)));
//         if (rs.every(r => r.ok)) {
//           stopEditing();
//         }
//       }}
//     />
//   );
// }

// function TimeLabel() {
//   const { values } = useFormikContext<ResultStub>();
//   const humanTime = Number(values['human-time'].content);
//   const machineTime = Number(values['machine-time'].content);
//   const totalTime = humanTime + machineTime;

//   return (
//     <div className="flex items-center text-gray-500 text-sm">
//       <p>
//         Total time is{' '}
//         <span className="font-bold">
//           {totalTime} {totalTime === 1 ? 'minute' : 'minutes'}
//         </span>
//       </p>
//     </div>
//   );
// }
