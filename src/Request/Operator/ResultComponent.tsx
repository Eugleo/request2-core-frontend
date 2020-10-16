import React, { useState } from 'react';

import { useAsyncGet } from '../../Utils/Api';
import { Authorized } from '../../Utils/Auth';
import { WithID } from '../../Utils/WithID';
import { Request, ResultProperty } from '../Request';
import RequestResults from '../RequestResults';
import RequestResultForm from './RequestResultForm';

export function ResultWidget({ requestId }: { requestId: number }) {
  const { Loader: RequestLoader } = useAsyncGet<WithID<Request>>(`/requests/${requestId}`);

  const { Loader, refresh } = useAsyncGet<WithID<ResultProperty>[]>(
    `/requests/${requestId}/props/results`
  );

  return (
    <RequestLoader>
      {request => (
        <Loader>
          {results => <ResultComponent request={request} properties={results} refresh={refresh} />}
        </Loader>
      )}
    </RequestLoader>
  );
}

function ResultComponent({
  request,
  properties,
  refresh,
}: {
  request: WithID<Request>;
  properties: WithID<ResultProperty>[];
  refresh: () => void;
}) {
  const activeProperties = properties.filter(p => p.active);
  const [isEditing, setIsEditing] = useState(activeProperties.length === 0);

  return isEditing ? (
    <Authorized roles={['Operator']}>
      <RequestResultForm
        request={request}
        stopEditing={() => setIsEditing(false)}
        refreshResults={refresh}
        properties={activeProperties}
      />
    </Authorized>
  ) : (
    <RequestResults properties={activeProperties} startEditing={() => setIsEditing(true)} />
  );
}
