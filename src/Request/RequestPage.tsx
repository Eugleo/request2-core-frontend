import moment from 'moment';
import React, { useMemo } from 'react';
import { Clock, Edit3 } from 'react-feather';
import { useParams } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { FieldContext } from '../Common/Form/Question';
import * as Page from '../Common/Layout';
import { User } from '../User/User';
import { useAsyncGet } from '../Utils/Api';
import { WithID } from '../Utils/WithID';
import { getDefaultValues } from './FieldValue';
import { ResultWidget } from './Operator/ResultComponent';
import { idToStr, PropertyJSON, Request } from './Request';
import { RequestComments } from './RequestComments';
import { RequestStatus } from './RequestStatus';
import { Proteomics } from './RequestTypes/Proteomics';
import { getRequestFormForType } from './RequestTypes/RequestTypes';

export function RequestPage(): JSX.Element {
  const { id } = useParams();
  return <RequestComponent requestId={Number(id)} />;
}

function RequestComponent({ requestId }: { requestId: number }) {
  const { Loader: RequestLoader } = useAsyncGet<WithID<Request>>(`/requests/${requestId}`);
  const { Loader } = useAsyncGet<WithID<PropertyJSON>[]>(`/requests/${requestId}/props`);

  return (
    <Page.ContentWrapper>
      <Page.Header className="col-span-2">
        <Page.Title className="mr-6">
          <RequestLoader>{request => <p>{request.title}</p>}</RequestLoader>
        </Page.Title>
        <h2 className="text-gray-500 font-mono text-2xl leading-tight">
          <RequestLoader>
            {request => <p>{`${idToStr(request).type}/${idToStr(request).code}`}</p>}
          </RequestLoader>
        </h2>
        <Page.Spacer />
        <Button.SecondaryLinked to={`/requests/${requestId}/edit`} title="Edit" />
      </Page.Header>

      <div className="pt-6 px-6 overflow-auto">
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <RequestLoader>
                {({ requestType }) => (
                  <Loader>
                    {properties => <Details requestType={requestType} properties={properties} />}
                  </Loader>
                )}
              </RequestLoader>
            </div>

            <div className="space-y-6 col-span-1">
              <RequestComments requestId={requestId} />
              <Loader>{properties => <Log properties={properties} />}</Loader>
            </div>
          </div>
        </div>
      </div>
    </Page.ContentWrapper>
  );
}

function Details({ requestType, properties }: { requestType: string; properties: PropertyJSON[] }) {
  const props = useMemo(() => getDefaultValues(properties), [properties]);

  return (
    <FieldContext.Provider value={{ state: 'show', values: props }}>
      {getRequestFormForType(requestType)}
    </FieldContext.Provider>
  );
}

function Log({ properties }: { properties: WithID<PropertyJSON>[] }) {
  return (
    <Page.Card>
      <div className="rounded-md overflow-hidden">
        <div className="px-6 py-2 border-b border-gray-100 flex flex-row items-center">
          <h2 className="text-lg font-semibold">Changelog</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {properties
            .filter(p => p.shouldLog)
            .map(p => (
              <LogItem key={p._id} property={p} />
            ))}
        </div>
      </div>
    </Page.Card>
  );
}

function LogItem({ property }: { property: PropertyJSON }) {
  const { result } = useAsyncGet<User>(`/users/${property.authorId}`);

  return (
    <div className="flex flex-row items-center py-5 px-6">
      <div className="bg-blue-100 rounded-full p-2 mr-4">
        <Edit3 className="w-5 text-blue-500 h-5" />
      </div>
      <div>
        <p className="text-gray-600 text-sm">
          A property with id <span className="bg-gray-100 rounded-sm px-1">{property.name}</span>{' '}
          has been changed
          {result.status === 'Success' ? ` by ${result.data.name}` : ''}
        </p>
        <p className="text-xs text-gray-400 mt-1">({moment.unix(property.dateAdded).fromNow()})</p>
      </div>
    </div>
  );
}
