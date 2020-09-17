import React from 'react';
import { useNavigate, useParams } from 'react-router';

import { useAsyncGet } from '../Utils/Api';
import { useAuth } from '../Utils/Auth';
import { WithID } from '../Utils/WithID';
import { FieldValue, fieldValueToString } from './FieldValue';
import { Property, Request } from './Request';
import RequestDetailForm from './RequestDetailForm';

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

  const title = mkProp('title', 'General', fieldValueToString(formValues.title));
  const details = Object.entries(formValues)
    .filter(([name]) => name !== 'title')
    .map(([name, value]) => mkProp(name, 'Detail', fieldValueToString(value)));

  return authPut(`/requests/${request._id}`, {
    props: [title, ...details],
    req: { ...request, name: formValues.title },
  });
}

export default function EditRequestPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { auth, authPut } = useAuth();
  const { Loader } = useAsyncGet<{
    request: WithID<Request>;
    properties: WithID<Property>[];
  }>(`/requests/${id}`);

  return (
    <Loader>
      {({ request, properties }) => (
        <RequestDetailForm
          title={`Editing ${request.name}`}
          requestType={request.requestType}
          request={request}
          properties={properties}
          onSubmit={values =>
            submit(authPut, request, values, auth.user._id).then(() => navigate(-1))
          }
        />
      )}
    </Loader>
  );
}
