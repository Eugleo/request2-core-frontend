import React from 'react';
import { useNavigate, useParams } from 'react-router';

import { useAsyncGet } from '../Utils/Api';
import { useAuth } from '../Utils/Auth';
import { fileToString } from '../Utils/File';
import { WithID } from '../Utils/WithID';
import { FieldValue, fieldValueToString, isFilesField } from './FieldValue';
import { BareProperty, Property, PropertyType, Request } from './Request';
import RequestDetailForm from './RequestDetailForm';

function submit(
  authPut: (
    url: string,
    data: {
      req: Request;
      props: BareProperty[];
    }
  ) => Promise<Response>,
  request: WithID<Request>,
  formValues: { [_: string]: FieldValue },
  authorId: number
) {
  const mkProp = (n: string, t: PropertyType, d: string) => ({
    authorId,
    dateAdded: Math.round(Date.now() / 1000),
    active: true,
    propertyName: n,
    propertyType: t,
    propertyData: d,
    requestId: request._id,
  });

  const title = mkProp('title', 'General', fieldValueToString(formValues.title));
  const normalProps = Object.entries(formValues)
    .filter(([name, value]) => name !== 'title' && !isFilesField(value))
    .map(([name, value]) => mkProp(name, 'Detail', fieldValueToString(value)));

  const fileProps = Object.entries(formValues)
    .flatMap(([name, value]) =>
      isFilesField(value) ? value.content.map(file => ({ name, file })) : []
    )
    .map(({ name, file }, ix) => mkProp(`${name}-${ix}`, 'File', fileToString(file)));

  return authPut(`/requests/${request._id}`, {
    props: [title, ...normalProps, ...fileProps],
    req: { ...request, name: fieldValueToString(formValues.title) },
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
