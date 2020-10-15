import React from 'react';
import { useParams } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import * as Page from '../Common/Layout';
import { useAsyncGet } from '../Utils/Api';
import { WithID } from '../Utils/WithID';
import { RequestComments } from './CommentSidebar';
import { ResultWidget } from './Operator/ResultComponent';
import { idToStr, isDetailProperty, isResultProperty, Property, Request } from './Request';
import RequestDetails from './RequestDetails';

export default function RequestPage() {
  const { id } = useParams();
  const { Loader } = useAsyncGet<{
    request: WithID<Request>;
    properties: WithID<Property>[];
  }>(`/requests/${id}`);

  // const { data: team } = useAsyncGet(maybe(payload?.request, r => `/teams/${r.teamId}`));
  // const { data: author } = useAsyncGet(maybe(payload?.request, r => `/users/${r.authorId}`));

  // const RequestContext = React.createContext<{ dispatch: Function }>();

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
    <Loader>
      {({ request, properties }) => <RequestComponent request={request} properties={properties} />}
    </Loader>
  );
}

function RequestComponent({
  request,
  properties,
}: {
  request: WithID<Request>;
  properties: WithID<Property>[];
}) {
  // const lastChange = Math.max(
  //   ...properties.filter(p => p.active).map(p => p.dateAdded),
  //   request.dateCreated
  // );

  const activeProps = properties.filter(p => p.active);

  return (
    <div
      style={{ gridTemplateRows: 'auto 1fr', gridTemplateColumns: '3fr 1fr' }}
      className="max-h-screen grid grid-rows-2 grid-cols-2"
    >
      <Page.Header className="col-span-2">
        <Page.Title className="mr-6">{request.name}</Page.Title>
        <h2 className="text-gray-500 font-mono text-2xl leading-tight">#{idToStr(request)}</h2>
        <Page.Spacer />
        <Button.SecondaryLinked to="edit" title="Edit" />
      </Page.Header>

      <div className="pt-6 overflow-auto">
        <ResultWidget request={request} />
        <RequestDetails request={request} properties={activeProps} />
      </div>

      <RequestComments
        details={properties.filter(p => isDetailProperty(p) || isResultProperty(p))}
        requestId={request._id}
      />
    </div>
  );
}
