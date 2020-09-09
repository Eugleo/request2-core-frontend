import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { useRefresh } from '../Common/Hooks';
import * as Page from '../Common/Layout';
import { useAsyncGet } from '../Utils/Api';
import { Authorized } from '../Utils/Auth';
import { WithID } from '../Utils/WithID';
import CommentSidebar from './CommentSidebar';
import ResultReportCard from './Operator/ResultReportCard';
import { DetailProperty, idToStr, Property, Request, ResultProperty } from './Request';
import RequestDetails from './RequestDetails';
import RequestResults from './RequestResults';
import { request } from 'http';

export default function RequestPage() {
  const { id } = useParams();
  const { Loader } = useAsyncGet<{
    request: WithID<Request>;
    properties: WithID<Property>[];
  }>(`/requests/${id}`);

  // const { data: team } = useAsyncGet(maybe(payload?.request, r => `/teams/${r.teamId}`));
  // const { data: author } = useAsyncGet(maybe(payload?.request, r => `/users/${r.authorId}`));

  const refresh = useRefresh();

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
      {({ request, properties }) => {
        const lastChange = Math.max(
          ...properties.filter(p => p.active).map(p => p.dateAdded),
          request.dateCreated
        );

        const hasResults = properties.find(p => p.propertyType === 'Result') !== undefined;
        return (
          <div
            style={{ gridTemplateRows: 'auto 1fr', gridTemplateColumns: '3fr 1fr' }}
            className="max-h-screen grid grid-rows-2 grid-cols-2"
          >
            <Page.Header className="col-span-2">
              <Page.Title className="mr-6">{request.name}</Page.Title>
              <h2 className="text-gray-500 font-mono text-2xl leading-tight">
                #{idToStr(request)}
              </h2>
              <Page.Spacer />
              <Button.SecondaryLinked to="edit" title="Edit" />
            </Page.Header>

            <div className="pt-6 overflow-auto">
              {hasResults ? (
                <RequestResults properties={properties.filter(isResult)} />
              ) : (
                <Authorized roles={['Operator']}>
                  <ResultReportCard request={request} refresh={refresh} />
                </Authorized>
              )}
              <RequestDetails request={request} properties={properties} />
            </div>

            <CommentSidebar details={properties.filter(isDetail)} requestId={request._id} />
          </div>
        );
      }}
    </Loader>
  );
}

function isResult(p: WithID<Property>): p is WithID<ResultProperty> {
  return p?.propertyType === 'Result';
}

function isDetail(p: WithID<Property>): p is WithID<DetailProperty> {
  return p?.propertyType === 'Detail';
}
