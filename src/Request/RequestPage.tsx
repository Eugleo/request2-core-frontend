import c from 'classnames';
import moment from 'moment';
import React, { useMemo } from 'react';
import { Edit3 } from 'react-feather';
import { useParams } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { FieldContext } from '../Common/Form/Question';
import { useHover } from '../Common/Hooks';
import * as Page from '../Common/Layout';
import { Pill } from '../Common/Table';
import { User } from '../User/User';
import { useAsyncGet } from '../Utils/Api';
import { useAuth } from '../Utils/Auth';
import { comparing } from '../Utils/Func';
import { WithID } from '../Utils/WithID';
import { getDefaultValues } from './FieldValue';
import { idToStr, PropertyJSON, Request } from './Request';
import { RequestComments } from './RequestComments';
import { RequestResults } from './RequestResults';
import { requests } from './RequestTypes/RequestTypes';
import { Status, statusToStr } from './Status';

export function RequestPage(): JSX.Element {
  const { id } = useParams();
  return <RequestComponent requestId={Number(id)} />;
}

function RequestComponent({ requestId }: { requestId: number }) {
  const { Loader: RequestLoader } = useAsyncGet<WithID<Request>>(`/requests/${requestId}`);
  const { Loader } = useAsyncGet<WithID<PropertyJSON>[]>(`/requests/${requestId}/props`);

  return (
    <Page.ContentWrapper>
      <Page.Header>
        <Page.Title className="mr-6">
          <RequestLoader>{request => <p>{request.title}</p>}</RequestLoader>
        </Page.Title>
        <h2 className="text-blue-400 font-mono">
          <RequestLoader>
            {request => (
              <p className="px-4 py-1 text-md rounded-full bg-blue-100 border border-blue-300 font-mono">{`${
                idToStr(request).type
              }/${idToStr(request).code}`}</p>
            )}
          </RequestLoader>
        </h2>
        <Page.Spacer />
        <Button.SecondaryLinked to={`/requests/${requestId}/edit`} title="Edit" />
      </Page.Header>

      <Page.Body>
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
            <RequestResults requestId={requestId} />
            <StatusSelect requestId={requestId} />
            <RequestComments requestId={requestId} />
            <Loader>{properties => <Log properties={properties} />}</Loader>
          </div>
        </div>
      </Page.Body>
    </Page.ContentWrapper>
  );
}

function Details({ requestType, properties }: { requestType: string; properties: PropertyJSON[] }) {
  const props = useMemo(() => getDefaultValues(properties), [properties]);

  return (
    <FieldContext.Provider value={{ state: 'show', values: props }}>
      {requests.get(requestType)?.formComponent}
    </FieldContext.Provider>
  );
}

function StatusSelect({ requestId }: { requestId: number }) {
  const { result, refresh } = useAsyncGet<WithID<Request>>(`/requests/${requestId}`);
  const status = result.status === 'Success' ? result.data.status : null;

  return (
    <Page.Card className="overflow-hidden">
      <div className="px-6 py-2 border-b border-gray-100 flex flex-row items-center">
        <h2 className="text-lg font-semibold">Status</h2>
      </div>
      <div className="py-6 space-y-6">
        <div className="flex flex-col space-y-6 justify-items-stretch">
          <div>
            <StatusButton
              status="Pending"
              isSelected={status === 'Pending'}
              color="bg-yellow-400"
              bgColor="bg-yellow-200"
              position="start"
              requestId={requestId}
              refresh={refresh}
            />
            <StatusButton
              status="InProgress"
              isSelected={status === 'InProgress'}
              color="bg-blue-400"
              bgColor="bg-blue-200"
              position="middle"
              requestId={requestId}
              refresh={refresh}
            />
            <StatusButton
              status="Done"
              isSelected={status === 'Done'}
              color="bg-green-400"
              bgColor="bg-green-200"
              position="end"
              requestId={requestId}
              refresh={refresh}
            />
          </div>
          <div>
            <StatusButton
              status="AwaitingInput"
              isSelected={status === 'AwaitingInput'}
              color="bg-purple-400"
              bgColor="bg-purple-200"
              position="alone"
              requestId={requestId}
              refresh={refresh}
            />
          </div>
          <div className="bg-gray-100 h-0.5" />
          <div>
            <StatusButton
              status="Deleted"
              isSelected={status === 'Deleted'}
              color="bg-red-400"
              bgColor="bg-red-200"
              position="alone"
              requestId={requestId}
              refresh={refresh}
            />
          </div>
        </div>
      </div>
    </Page.Card>
  );
}

function StatusButton({
  isSelected,
  color,
  status,
  position,
  requestId,
  bgColor,
  refresh,
}: {
  isSelected: boolean;
  color: string;
  bgColor: string;
  status: Status;
  position: 'start' | 'middle' | 'end' | 'alone';
  requestId: number | null;
  refresh: () => void;
}) {
  const { authPut, auth } = useAuth<{ status: Status }>();
  const [ref, isHovered] = useHover<HTMLButtonElement>();

  const hasPermissions = auth.user.roles.includes('Admin') || auth.user.roles.includes('Operator');

  let rounding = 'rounded-full';
  switch (position) {
    case 'start':
      rounding = 'rounded-t-full';
      break;
    case 'end':
      rounding = 'rounded-b-full';
      break;
    case 'middle':
      rounding = 'rounded-none';
      break;
    default:
      rounding = 'rounded-full';
  }

  return (
    <button
      className={c(
        'px-6 items-center flex flex-row justify-start',
        hasPermissions && 'cursor-pointer'
      )}
      ref={ref}
      onClick={async () => {
        if (hasPermissions && requestId) {
          const r = await authPut(`/requests/${requestId}/status`, { status });
          if (r.ok) {
            refresh();
          }
        }
      }}
    >
      <div
        className={c(
          'p-3 bg-gray-100 flex-grow-0 mr-4 transition-colors duration-150',
          rounding,
          hasPermissions && isHovered && !isSelected && 'bg-gray-200',
          isSelected && bgColor
        )}
      >
        <div className={c('rounded-full w-3 h-3', isSelected ? color : 'bg-white')} />
      </div>
      <p
        className={c(
          'text-sm flex-grow transition-colors duration-150 text-gray-500',
          hasPermissions && isHovered && !isSelected && 'text-gray-900',
          isSelected && 'text-gray-900 font-semibold'
        )}
      >
        {statusToStr(status)}
      </p>
    </button>
  );
}

function Log({ properties }: { properties: WithID<PropertyJSON>[] }) {
  const updatedProps = properties.filter(p => p.shouldLog);
  return (
    <Page.Card>
      <div className="rounded-md overflow-hidden">
        <div className="px-6 py-2 border-b border-gray-100 flex flex-row items-center">
          <h2 className="text-lg font-semibold">Changelog</h2>
          <Page.Spacer />
          <p className="text-gray-600 text-sm font-medium ml-3">{updatedProps.length} items</p>
        </div>
        <div className="divide-y divide-gray-200 max-h-64 overflow-scroll">
          {updatedProps.sort(comparing(p => -p.dateAdded)).map(p => (
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
          {result.status === 'Success' ? `${result.data.name}` : 'Somebody'} changed{' '}
          <span className="bg-gray-100 rounded-sm px-1">{property.name}</span>
        </p>
        <p className="text-sm text-gray-400 mt-1">{moment.unix(property.dateAdded).fromNow()}</p>
      </div>
    </div>
  );
}
