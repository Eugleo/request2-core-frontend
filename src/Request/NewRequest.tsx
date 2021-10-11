import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { useNavigate, useParams } from 'react-router-dom';

import { Cancel, Primary } from '../Common/Buttons';
import { NewForm } from '../Common/Form/NewForm';
import { Page } from '../Common/Layout';
import { Modal } from '../Common/Modal';
import { useAsyncGet } from '../Utils/Api';
import { useAuth } from '../Utils/Auth';
import { Maybe } from '../Utils/Maybe';
import { WithID } from '../Utils/WithID';
import { getDefaultValues } from './FieldValue';
import { idToStr, New, Property, PropertyJSON, Request } from './Request';
import { requests } from './RequestTypes/RequestTypes';

// TODO Check that the field names are unique
export function NewRequestPage(): JSX.Element {
  const { requestType } = useParams();
  const name = requests.get(requestType)?.titleText;

  if (name) {
    return <BaseRequestPage name={name} defaultValues={{}} requestType={requestType} />;
  }

  return <Page title="Error">This request type is invalid</Page>;
}

export function RequestFromTemplate(): JSX.Element {
  const { templateId } = useParams();
  const { Loader } = useAsyncGet<PropertyJSON[]>(`/requests/${templateId}/props`);
  const { Loader: RequestLoader } = useAsyncGet<WithID<Request>>(`/requests/${templateId}`);

  return (
    <RequestLoader>
      {request => {
        const name = requests.get(request.requestType)?.titleText;
        if (name) {
          return (
            <Loader>
              {properties => (
                <BaseRequestPage
                  name={name}
                  defaultValues={getDefaultValues(properties)}
                  requestType={request.requestType}
                />
              )}
            </Loader>
          );
        }
        return (
          <Page title="Error">This request type (and thus the whole template) is invalid</Page>
        );
      }}
    </RequestLoader>
  );
}

function BaseRequestPage({
  name,
  defaultValues,
  requestType,
}: {
  name: string;
  requestType: string;
  defaultValues: Record<string, string>;
}) {
  const { authPost } = useAuth<{ request: New<Request>; properties: New<Property>[] }>();
  const [modalInfo, setModalInfo] = useState<{ show: boolean; request: Maybe<WithID<Request>> }>({
    request: null,
    show: false,
  });

  return (
    <>
      {modalInfo.show && modalInfo.request ? <CodeModal request={modalInfo.request} /> : null}

      <NewForm
        defaultValues={defaultValues}
        defaultTitle={`New request for ${name}`}
        requestType={requestType}
        submit={async (request, properties) => {
          const r = await authPost('/requests', {
            properties,
            request: { ...request, requestType },
          });
          const js: { error: string } | { data: WithID<Request> } = await r.json();

          if ('data' in js) {
            setModalInfo({ request: js.data, show: true });
          } else {
            throw new Error(`There was an error with processing your request: ${js.error}`);
          }
        }}
      >
        <Cancel />
        <Primary type="submit">Submit new request</Primary>
      </NewForm>
    </>
  );
}

function CodeModal({ request }: { request: WithID<Request> }) {
  const navigate = useNavigate();
  const { type, code } = idToStr(request);
  return (
    <Modal
      title="Success!"
      closeText="Close"
      onClose={() => {
        navigate(-1);
      }}
    >
      <p className="mt-4">
        Your request has been submitted. Please tag your samples with the following ID so that the
        operators will be able to match them to your request
      </p>
      <div className="my-8 flex flex-row justify-center items-center ">
        <p className="text-gray-600 text-2xl">
          {type}/{code}
        </p>
      </div>
    </Modal>
  );
}
