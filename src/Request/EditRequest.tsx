import React from 'react';
import { useNavigate, useParams } from 'react-router';

import { Cancel, Primary } from '../Common/Buttons';
import { NewForm } from '../Common/Form/NewForm';
import { useAsyncGet } from '../Utils/Api';
import { useAuth } from '../Utils/Auth';
import { WithID } from '../Utils/WithID';
import { New, Property, PropertyJSON, Request } from './Request';
import { requestTypeDisplayNames } from './RequestTypes';

export function EditRequestPage(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams();

  const { authPut } = useAuth<{
    request: { title: string; teamId: number };
    properties: New<Property>[];
  }>();

  const { Loader } = useAsyncGet<PropertyJSON[]>(`/requests/${id}/props`);
  const { Loader: RequestLoader } = useAsyncGet<WithID<Request>>(`/requests/${id}`);

  return (
    <RequestLoader>
      {req => (
        <Loader>
          {properties => (
            <NewForm
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              defaultTitle={`New ${requestTypeDisplayNames.get(req.requestType)!} request`}
              request={req}
              properties={properties}
              submit={async (
                request: { title: string; teamId: number },
                properties: New<Property>[]
              ) => {
                const r = await authPut(`/requests/${id}`, {
                  properties,
                  request,
                });
                if (r.ok) {
                  navigate(-1);
                }
              }}
            >
              <Cancel />
              <Primary type="submit">Save changes</Primary>
            </NewForm>
          )}
        </Loader>
      )}
    </RequestLoader>
  );
}
