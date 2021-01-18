import React from 'react';
import { useNavigate, useParams } from 'react-router';

import { useAuth } from '../Utils/Auth';
import { PropertyJSON, Request } from './Request';

export function EditRequestPage(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams();
  const requestId = Number(id);
  const { authPut } = useAuth<{ req: Request; props: PropertyJSON[] }>();

  return (
    <RequestDetailFormPage
      requestId={requestId}
      onSubmit={async (request: Request, properties: PropertyJSON[]) => {
        const r = await authPut(`/requests/${id}`, {
          props: properties.map(p => ({ ...p, requestId })),
          req: request,
        });
        if (r.ok) {
          navigate(-1);
        }
      }}
    />
  );
}
