import c from 'classnames';
import moment from 'moment';
import React, { ReactNode, useMemo, useRef } from 'react';
import { Box, Calendar, Edit3, Package, Printer } from 'react-feather';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import ReactTooltip from 'react-tooltip';

import * as Button from '../Common/Buttons';
import { FieldContext } from '../Common/Form/Question';
import { useHover } from '../Common/Hooks';
import * as Page from '../Common/Layout';
import { Pill } from '../Common/Pills';
import { User, UserDetails, UserName } from '../User/User';
import { LinkToProfile } from '../User/UserProfile';
import { useAsyncGet } from '../Utils/Api';
import { useAuth } from '../Utils/Auth';
import { comparing } from '../Utils/Func';
import { Result } from '../Utils/Loader';
import { WithID } from '../Utils/WithID';
import { getDefaultValues } from './FieldValue';
import { idToStr, PropertyJSON, Request } from './Request';
import { RequestComments } from './RequestComments';
import { doesHaveResults, RequestResults } from './RequestResults';
import { requests } from './RequestTypes/RequestTypes';
import { getStatusColor, Status, statusToStr } from './Status';

export function RequestPage(): JSX.Element {
  const { id } = useParams();
  return <RequestComponent requestId={Number(id)} />;
}

function RequestComponent({ requestId }: { requestId: number }) {
  const { Loader: RequestLoader } = useAsyncGet<WithID<Request>>(`/requests/${requestId}`);
  const { Loader, result } = useAsyncGet<WithID<PropertyJSON>[]>(`/requests/${requestId}/props`);

  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <Page.ContentWrapper>
      <div className="py-8 space-y-2">
        <div className="flex flex-row items-center gap-3">
          <Page.Title>
            <RequestLoader>{request => <>{request.title}</>}</RequestLoader>
          </Page.Title>
          <h2>
            <RequestLoader>
              {request => (
                <Pill className="bg-blue-100 text-blue-600 font-mono">
                  id: {idToStr(request).type}/{idToStr(request).code}
                </Pill>
              )}
            </RequestLoader>
          </h2>
          <Page.Spacer />
          <div className="flex flex-row items-stretch gap-3">
            <Button.Secondary
              onClick={
                handlePrint ||
                (() => {
                  console.log('Error');
                })
              }
            >
              <Printer className="h-4" />
            </Button.Secondary>
            <EditButton requestId={requestId} properties={result} />
          </div>
        </div>
        <RequestLoader>
          {request => (
            <div className="flex flex-row items-center space-x-2">
              <Calendar className="w-3 h-3 text-gray-700" />
              <p className="text-sm text-gray-600">
                Created {moment.unix(request.dateCreated).fromNow()} by{' '}
                <LinkToProfile userId={request.authorId} className="text-gray-700 font-medium" />
              </p>
            </div>
          )}
        </RequestLoader>
      </div>
      <Page.Body>
        <div className="grid grid-cols-3 gap-6">
          <RequestLoader>
            {request => (
              <Loader>
                {properties => (
                  <>
                    <div className="hidden col-span-2">
                      <div ref={printRef}>
                        <div className="mb-2">
                          <div className="mb-1 pb-3 border-b-4 border-gray-500 space-y-2">
                            <div className="flex flex-row gap-4 items-center">
                              <div className="font-mono rounded-lg border border-gray-300 py-1 px-4">
                                {idToStr(request).type}/{idToStr(request).code}
                              </div>
                              <h1 className="font-bold text-lg align-center">{request.title}</h1>
                            </div>
                          </div>
                          <div className="flex flex-row items-center justify-end">
                            <p className="text-xs text-gray-500">
                              Created {moment.unix(request.dateCreated).fromNow()} by{' '}
                              <LinkToProfile
                                userId={request.authorId}
                                className="text-gray-700 font-medium"
                              />
                            </p>
                          </div>
                        </div>

                        <PrintableRequest
                          requestType={request.requestType}
                          properties={properties}
                        />

                        <PageBreak />

                        <SampleCodes request={request} properties={properties} />

                        <style>{`
                        @page {
                          margin: 24mm 16mm 24mm 16mm;
                        }
                        `}</style>
                      </div>
                    </div>
                    <div className="col-span-2 space-y-4">
                      <Details requestType={request.requestType} properties={properties} />
                    </div>
                  </>
                )}
              </Loader>
            )}
          </RequestLoader>

          <div className="space-y-4 col-span-1">
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

function PrintableRequest({
  requestType,
  properties,
}: {
  requestType: string;
  properties: PropertyJSON[];
}) {
  const props = useMemo(() => getDefaultValues(properties), [properties]);

  return (
    <FieldContext.Provider value={{ state: 'print', values: props }}>
      {requests.get(requestType)?.formComponent}
    </FieldContext.Provider>
  );
}

function EditButton({
  requestId,
  properties,
}: {
  requestId: number;
  properties: Result<WithID<PropertyJSON>[]>;
}) {
  if (properties.status !== 'Success' || doesHaveResults(getDefaultValues(properties.data))) {
    return (
      <>
        <button
          disabled
          className={c(
            'px-4',
            'py-2',
            'inline-flex',
            'items-center',
            'text-sm',
            'focus:outline-none',
            'font-medium',
            'justify-center',
            'rounded-lg',
            'bg-white',
            'border-gray-200',
            'border',
            'text-gray-300',
            'cursor-default'
          )}
          data-tip="This request cannot be edited anymore."
        >
          Edit
        </button>
        <ReactTooltip
          type="light"
          effect="solid"
          backgroundColor="rgba(243, 244, 246, 1)"
          className="white-tooltip"
        />
      </>
    );
  }

  return <Button.SecondaryLinked to={`/requests/${requestId}/edit`} title="Edit" />;
}

function SampleCodes({
  request,
  properties,
}: {
  request: WithID<Request>;
  properties: PropertyJSON[];
}) {
  const { Loader } = useAsyncGet<UserDetails>(`/users/${request.authorId}/profile`);

  const props = useMemo(() => getDefaultValues(properties), [properties]);
  const count = Number.parseInt(props['sample count']);

  return (
    <div>
      <p className="text-sm text-gray-800 text-center mb-4 max-w-md mx-auto">
        Cut out each sample code strip along the dashed lines and glue it onto the vial with the
        respective sample.
      </p>
      <div className="divide-y-2 divide-dashed border-t-2 border-b-2 border-dashed">
        <Loader>
          {user => (
            <>
              {Array.from({ length: count })
                .fill(0)
                .map((_, i) => (
                  <SampleCode key={i} request={request} sampleNumber={i} authorName={user.name} />
                ))}
            </>
          )}
        </Loader>
      </div>
    </div>
  );
}

function SampleCode({
  request,
  sampleNumber,
  authorName,
}: {
  request: WithID<Request>;
  sampleNumber: number;
  authorName: string;
}) {
  return (
    <div className="py-2 px-4 font-mono">
      ({authorName}) <span className="font-bold">{idToStr(request).type}</span>
      <span className="text-gray-400">/</span>
      <span className="font-bold">{idToStr(request).code}</span>
      <span className="text-gray-400">/</span>
      <span className="font-bold">{sampleNumber + 1}</span>
    </div>
  );
}

function Details({ requestType, properties }: { requestType: string; properties: PropertyJSON[] }) {
  const props = useMemo(() => getDefaultValues(properties), [properties]);

  console.log(properties);
  console.log(props);

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
      <div className="py-6 space-y-4">
        <div className="flex flex-col space-y-6 justify-items-stretch">
          <div>
            <StatusButton
              status="Pending"
              isSelected={status === 'Pending'}
              position="start"
              requestId={requestId}
              refresh={refresh}
            />
            <StatusButton
              status="InProgress"
              isSelected={status === 'InProgress'}
              position="middle"
              requestId={requestId}
              refresh={refresh}
            />
            <StatusButton
              status="Done"
              isSelected={status === 'Done'}
              position="end"
              requestId={requestId}
              refresh={refresh}
            />
          </div>
          <div>
            <StatusButton
              status="AwaitingInput"
              isSelected={status === 'AwaitingInput'}
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
  status,
  position,
  requestId,
  refresh,
}: {
  isSelected: boolean;
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
          isSelected && getStatusColor(status).general
        )}
      >
        <div
          className={c(
            'rounded-full w-3 h-3',
            isSelected ? getStatusColor(status).indicator : 'bg-white'
          )}
        />
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
  return (
    <div className="flex flex-row items-center py-5 px-6">
      <div className="bg-blue-100 rounded-full p-2 mr-4">
        <Edit3 className="w-5 text-blue-500 h-5" />
      </div>
      <div>
        <p className="text-gray-600 text-sm">
          <LinkToProfile userId={property.authorId} /> updated{' '}
          <span className="bg-gray-100 rounded-sm px-1">{property.name}</span>
        </p>
        <p className="text-sm text-gray-400 mt-1">{moment.unix(property.dateAdded).fromNow()}</p>
      </div>
    </div>
  );
}

function PageBreak(): JSX.Element {
  return <div className="page-break" />;
}
