import React, { useState } from 'react';

import { useAsyncGet } from '../../Utils/Api';
import { Authorized } from '../../Utils/Auth';
import { WithID } from '../../Utils/WithID';
import { Request, ResultProperty } from '../Request';
import RequestResults from '../RequestResults';
import RequestResultForm from './RequestResultForm';

export function ResultWidget({ request }: { request: WithID<Request> }) {
  const { Loader, refresh } = useAsyncGet<WithID<ResultProperty>[]>(
    `/requests/${request._id}/props/results`
  );
  return (
    <Loader>
      {results => <ResultComponent request={request} results={results} refresh={refresh} />}
    </Loader>
  );
}

function ResultComponent({
  request,
  results,
  refresh,
}: {
  request: WithID<Request>;
  results: WithID<ResultProperty>[];
  refresh: () => void;
}) {
  const [isEditing, setIsEditing] = useState(results.length === 0);

  return isEditing ? (
    <Authorized roles={['Operator']}>
      <RequestResultForm
        request={request}
        refreshResults={() => {
          setIsEditing(false);
          refresh();
        }}
        resultProperties={results}
      />
    </Authorized>
  ) : (
    <RequestResults properties={results} startEditing={() => setIsEditing(true)} />
  );
}
