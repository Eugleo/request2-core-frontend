import React from 'react';
import { useParams } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import * as Page from '../Common/Layout';
import { useAsyncGet } from '../Utils/Api';
import { WithID } from '../Utils/WithID';
import { ResultWidget } from './Operator/ResultComponent';
import { idToStr, Request } from './Request';
import { RequestComments } from './RequestComments';
import { RequestDetails } from './RequestDetails';
import { RequestStatus } from './RequestStatus';

export function RequestPage(): JSX.Element {
  const { id } = useParams();
  return <RequestComponent requestId={Number(id)} />;
}

function RequestComponent({ requestId }: { requestId: number }) {
  const { Loader } = useAsyncGet<WithID<Request>>(`/requests/${requestId}`);

  return (
    <div
      style={{ gridTemplateColumns: '3fr 1fr', gridTemplateRows: 'auto 1fr' }}
      className="max-h-screen grid grid-rows-2 grid-cols-2"
    >
      <Page.Header className="col-span-2">
        <Page.Title className="mr-6">
          <Loader>{request => <p>{request.name}</p>}</Loader>
        </Page.Title>
        <h2 className="text-gray-500 font-mono text-2xl leading-tight">
          <Loader>{request => <p>#{idToStr(request)}</p>}</Loader>
        </h2>
        <Page.Spacer />
        <Button.SecondaryLinked to={`/requests/${requestId}/edit`} title="Edit" />
      </Page.Header>

      <Page.Body>
        <ResultWidget requestId={requestId} />
        <RequestStatus requestId={requestId} />
        <RequestDetails requestId={requestId} />
      </Page.Body>

      <RequestComments requestId={requestId} />
    </div>
  );
}
