import React, { useState } from 'react';

import { Authorized } from '../../Utils/Auth';
import { WithID } from '../../Utils/WithID';
import { isResultProperty, Property, Request } from '../Request';
import RequestResults from '../RequestResults';
import RequestResultForm from './RequestResultForm';

export function ResultComponent({
  request,
  properties,
}: {
  request: WithID<Request>;
  properties: WithID<Property>[];
}) {
  const results = properties.filter(isResultProperty);
  const [isEditing, setIsEditing] = useState(results.length === 0);

  if (isEditing) {
    return (
      <Authorized roles={['Operator']}>
        <RequestResultForm
          request={request}
          stopEditing={() => setIsEditing(false)}
          resultProperties={results}
        />
      </Authorized>
    );
  }
  return (
    <RequestResults
      properties={properties.filter(isResultProperty)}
      startEditing={() => setIsEditing(true)}
    />
  );
}
