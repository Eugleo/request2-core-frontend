import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import * as Page from '../Common/Layout';
import { useAsyncGet } from '../Utils/Api';
import { useAuth } from '../Utils/Auth';
import { maybe } from '../Utils/Maybe';
import { WithID } from '../Utils/WithID';
import { idToStr, Property, Request } from './Request';
import RequestDetails from './RequestDetails';

// function HeaderItem({ label, children }: { label: string; children: React.ReactNode }) {
//   return (
//     <div className="text-sm mb-4 col-span-1">
//       <h3 className="text-sm font-medium text-gray-600">{label}</h3>
//       {children}
//     </div>
//   );
// }

// function RequestHeader({ request, author, lastChange }) {
//   return (
//     <div className="col-span-4 grid grid-cols-4">
//       <div className="col-span-3">
//         <div className="flex flex-row items-center mb-2">
//           <h1 className="text-3xl font-bold leading-tight text-black">{request.name}</h1>
//           <span className="ml-4 text-3xl text-gray-500">#{idToStr(request)}</span>
//         </div>
//         <div className="flex flex-row items-center">
//           <Authorized roles={['Operator']} otherwise={<StatusLabel status={request.status} />}>
//             <StatusSelect request={request} />
//           </Authorized>
//           <p className="ml-4 text-gray-700 text-sm">
//             <span className="font-semibold">{author.name}</span> has updated this item{' '}
//             <span>{moment.unix(lastChange).fromNow()}</span>
//           </p>
//         </div>
//       </div>
//       <ButtonArray />
//     </div>
//   );
// }

// function RequestDetails({ request, author, team }) {
//   const type = request.requestType.split(/-/g).join(' ');

//   return (
//     <div className="flex flex-col items-start row-span-2">
//       <HeaderItem label="Author">
//         <p className="text-sm text-gray-800">
//           {author.name} @ {team.name}
//         </p>
//       </HeaderItem>
//       <HeaderItem label="Date requested">
//         <p className="text-sm text-gray-800">{formatDate(request.dateCreated)}</p>
//       </HeaderItem>
//       <HeaderItem label="Type">
//         <p className="text-sm text-gray-800">{capitalize(type)}</p>
//       </HeaderItem>
//     </div>
//   );
// }

export default function RequestPage() {
  const { id } = useParams();
  const { auth } = useAuth();
  // TODO Fix: we're not getting RWP with the _id field (we're actually getting two values)
  const { data: payload, error, pending } = useAsyncGet<{
    request: WithID<Request>;
    properties: WithID<Property>[];
  }>(`/requests/${id}`);
  const { data: team } = useAsyncGet(maybe(payload?.request, r => `/teams/${r.teamId}`));
  const { data: author } = useAsyncGet(maybe(payload?.request, r => `/users/${r.authorId}`));

  if (error) {
    console.log(error);
    return <Navigate to="/404" />;
  }
  if (pending || !payload) {
    return <Page.Page title="Request details">Loading requests</Page.Page>;
  }

  const request = payload && payload.request;
  const properties = payload && payload.properties;

  const lastChange = Math.max(
    ...properties.filter(p => p.active).map(p => p.dateAdded),
    request.dateCreated
  );

  // if (propertiesWithSections.find(p => p.propertyType === 'Result')) {
  //   return (
  //     <Page>
  //       <RequestHeader request={request} author={author || {}} lastChange={lastChange} />
  //       <RequestProperties
  //         title="Results report"
  //         properties={detailSections}
  //         edit={auth.user.roles.includes('Operator')}
  //       />

  //       <RequestDetails request={request} author={author || {}} team={team || {}} />

  //       <RequestProperties title="Request details" properties={resultSections} />
  //       <Authorized roles={['Operator']}>
  //         <ResultReportCard request={request} />
  //       </Authorized>
  //     </Page>
  //   );
  // }

  return (
    <Page.ContentWrapper>
      <Page.Header>
        <Page.Title className="mr-3">{request.name}</Page.Title>
        <Page.Title className="text-gray-500">#{idToStr(request)}</Page.Title>
        <Page.Spacer />
        <Button.SecondaryLinked to="edit" title="Edit" />
      </Page.Header>
      <Page.Body>
        <RequestDetails request={request} properties={properties} />
      </Page.Body>
    </Page.ContentWrapper>

    // <Page>
    //   <RequestHeader request={request} author={author || {}} lastChange={lastChange} />
    //   <Authorized roles={['Operator']}>
    //     <ResultReportCard request={request} />
    //   </Authorized>

    //   <RequestDetails request={request} author={author || {}} team={team || {}} />

    //   <RequestProperties title="Request details" properties={detailSections} />
    // </Page>
  );
}
