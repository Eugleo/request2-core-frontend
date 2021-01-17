import React, { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { NewForm } from '../Common/Form/NewForm';
import { Page } from '../Common/Layout';
import { Modal } from '../Common/Modal';
import { useAuth } from '../Utils/Auth';
import { Maybe } from '../Utils/Maybe';
import { WithID } from '../Utils/WithID';
import { BareProperty, idToStr, NewProperty, NewRequest, Request } from './Request';
import { RequestDetailFormPage } from './RequestDetailForm';
import { requestSchemas } from './RequestTypes';
import { Proteomics } from './RequestTypes/Proteomics';

// TODO Check that the field names are unique
export function NewRequestPage(): JSX.Element {
  const [modalInfo, setModalInfo] = useState<{ show: boolean; request: Maybe<WithID<Request>> }>({
    request: null,
    show: false,
  });
  const { requestType } = useParams();
  const { authPost } = useAuth<{ request: NewRequest; properties: NewProperty[] }>();
  const [title, setTitle] = useState<Maybe<string>>(null);

  let requestForm = null;
  switch (requestType) {
    case 'proteomics':
    case 'lipidomics':
      requestForm = (
        <Proteomics
          titleChanged={title => {
            setTitle(title);
          }}
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
        />
      );
  }

  return (
    <>
      {modalInfo.show && modalInfo.request ? <CodeModal request={modalInfo.request} /> : null}

      <Page title={title ? `New ${requestType} request: ${title}` : `New ${requestType} request`}>
        <div className="mx-auto">{requestForm}</div>
      </Page>
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
