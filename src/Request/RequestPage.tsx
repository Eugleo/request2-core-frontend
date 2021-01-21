import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { FieldContext } from '../Common/Form/Question';
import * as Page from '../Common/Layout';
import { useAsyncGet } from '../Utils/Api';
import { WithID } from '../Utils/WithID';
import { groupFiles } from './FieldValue';
import { ResultWidget } from './Operator/ResultComponent';
import { idToStr, PropertyJSON, Request } from './Request';
import { RequestComments } from './RequestComments';
import { RequestStatus } from './RequestStatus';
import { Proteomics } from './RequestTypes/Proteomics';

export function RequestPage(): JSX.Element {
  const { id } = useParams();
  return <RequestComponent requestId={Number(id)} />;
}

function RequestComponent({ requestId }: { requestId: number }) {
  const { Loader: RequestLoader } = useAsyncGet<WithID<Request>>(`/requests/${requestId}`);
  const { Loader } = useAsyncGet<PropertyJSON[]>(`/requests/${requestId}/props`);

  return (
    <div
      style={{ gridTemplateColumns: '3fr 1fr', gridTemplateRows: 'auto 1fr' }}
      className="max-h-screen grid grid-rows-2 grid-cols-2"
    >
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

      <Page.Body>
        <RequestLoader>
          {({ requestType }) => (
            <Loader>
              {properties => <Details requestType={requestType} properties={properties} />}
            </Loader>
          )}
        </RequestLoader>
      </Page.Body>

      <RequestComments requestId={requestId} />
    </div>
  );
}

function Details({ requestType, properties }: { requestType: string; properties: PropertyJSON[] }) {
  const props = useMemo(
    () => groupFiles(properties).reduce((acc, p) => ({ ...acc, [p.name]: p.value }), {}),
    [properties]
  );

  let requestForm = null;

  switch (requestType) {
    case 'proteomics':
    case 'lipidomics':
    case 'small molecule':
      requestForm = Proteomics;
  }

  return (
    <FieldContext.Provider value={{ state: 'show', values: props }}>
      {requestForm}
    </FieldContext.Provider>
  );
}
