import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Cancel, Primary } from '../Common/Buttons';
import { NewForm } from '../Common/Form/NewForm';
import { FieldContext } from '../Common/Form/Question';
import { useAsyncGet } from '../Utils/Api';
import { useAuth } from '../Utils/Auth';
import { WithID } from '../Utils/WithID';
import { getDefaultValues } from './FieldValue';
import { New, Property, PropertyJSON, Request } from './Request';
import { requestTypeDisplayNames } from './RequestTypes';

export function EditRequestPage(): JSX.Element {
  const { id } = useParams();

  const { Loader } = useAsyncGet<PropertyJSON[]>(`/requests/${id}/props`);
  const { Loader: RequestLoader } = useAsyncGet<WithID<Request>>(`/requests/${id}`);

  return (
    <RequestLoader>
      {request => (
        <Loader>{properties => <EditForm request={request} properties={properties} />}</Loader>
      )}
    </RequestLoader>
  );
}

function EditForm({
  request,
  properties,
}: {
  request: WithID<Request>;
  properties: PropertyJSON[];
}) {
  const navigate = useNavigate();
  const { authPut } = useAuth<{
    request: { title: string; teamId: number };
    properties: New<Property>[];
  }>();

  return (
    <NewForm
      defaultValues={getDefaultValues(properties)}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      defaultTitle={`New ${requestTypeDisplayNames.get(request.requestType)?.word!} request`}
      request={request}
      requestType={request.requestType}
      submit={async (req: { title: string; teamId: number }, properties: New<Property>[]) => {
        const r = await authPut(`/requests/${request._id}`, {
          properties,
          request: req,
        });
        if (r.ok) {
          navigate(-1);
        }
      }}
    >
      <Cancel />
      <Primary type="submit">Save changes</Primary>
    </NewForm>
  );
}
