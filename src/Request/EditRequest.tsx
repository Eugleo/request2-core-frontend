import React from 'react';
import { useNavigate, useParams } from 'react-router';

import { useAuth } from '../Utils/Auth';
import { BareProperty, Property, Request } from './Request';
import RequestDetailFormPage from './RequestDetailForm';

export default function EditRequestPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const requestId = Number(id);
  const { authPut } = useAuth<{ req: Request; props: Property[] }>();

  return (
    <RequestDetailFormPage
      requestId={requestId}
      onSubmit={async (request: Request, properties: BareProperty[]) => {
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
