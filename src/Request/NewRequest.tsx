import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Cancel, Primary } from '../Common/Buttons';
import { NewForm } from '../Common/Form/NewForm';
import { Page } from '../Common/Layout';
import { Modal } from '../Common/Modal';
import { useAuth } from '../Utils/Auth';
import { Maybe } from '../Utils/Maybe';
import { WithID } from '../Utils/WithID';
import { idToStr, New, Property, Request } from './Request';
import { requests } from './RequestTypes/RequestTypes';

// TODO Check that the field names are unique
export function NewRequestPage(): JSX.Element {
  const [modalInfo, setModalInfo] = useState<{ show: boolean; request: Maybe<WithID<Request>> }>({
    request: null,
    show: false,
  });
  const { requestType } = useParams();
  const { authPost } = useAuth<{ request: New<Request>; properties: New<Property>[] }>();

  const name = requests.get(requestType)?.titleText;

  if (name) {
    return (
      <>
        {modalInfo.show && modalInfo.request ? <CodeModal request={modalInfo.request} /> : null}

        <NewForm
          defaultValues={{}}
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

  return <Page title="Error">This request type is invalid</Page>;
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
