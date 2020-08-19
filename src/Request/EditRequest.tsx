import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';

import { Page } from '../Common/Layout';
import { useAsyncGet } from '../Utils/Api';
import { useAuth } from '../Utils/Auth';
import { WithID } from '../Utils/WithID';
import { Property, Request } from './Request';
import RequestDetailForm from './RequestDetailForm';
import { FieldValue, stringify } from './RequestSchema';

function submit(
  authPut: (url: string, data: any) => Promise<Response>,
  request: WithID<Request>,
  formValues: { [_: string]: FieldValue },
  authorId: number
) {
  const mkProp = (n: string, t: string, d: string) => ({
    authorId,
    dateAdded: Math.round(Date.now() / 1000),
    active: true,
    propertyName: n,
    propertyType: t,
    propertyData: d,
    requestId: request._id,
  });

  const title = mkProp('title', 'General', stringify(formValues.title));
  const details = Object.entries(formValues)
    .filter(([name]) => name !== 'title')
    .map(([name, value]) => mkProp(name, 'Detail', stringify(value)));

  return authPut(`/requests/${request._id}`, {
    props: [title, ...details],
    req: { ...request, name: formValues.title },
  });
}

export default function EditRequestPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { auth, authPut } = useAuth();
  // TODO Fix types
  const { data: payload, error, pending } = useAsyncGet<{
    request: WithID<Request>;
    properties: WithID<Property>[];
  }>(`/requests/${id}`);

  if (pending || !payload) {
    return <Page title="Editing request">Loading requests</Page>;
  }
  if (error) {
    console.log(error);
    return <Navigate to="/404" />;
  }
  const { request } = payload;
  const { properties } = payload;

  console.log(auth);

  return (
    <RequestDetailForm
      title={`Editing ${request.name}`}
      requestType={request.requestType}
      request={request}
      properties={properties}
      onSubmit={values => submit(authPut, request, values, auth.userId).then(() => navigate(-1))}
    />
  );
}
