import React, { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { Modal } from '../Common/Modal';
import { useAuth } from '../Utils/Auth';
import { Maybe } from '../Utils/Maybe';
import { WithID } from '../Utils/WithID';
import { BareProperty, idToStr, Request } from './Request';
import { RequestDetailFormPage } from './RequestDetailForm';
import { requestSchemas } from './RequestTypes';

// TODO Check that the field names are unique
export function NewRequestPage(): JSX.Element {
  const [modalInfo, setModalInfo] = useState<{ show: boolean; request: Maybe<WithID<Request>> }>({
    request: null,
    show: false,
  });
  const { requestType } = useParams();
  const { authPost } = useAuth<{ req: Request; props: BareProperty[] }>();

  const schema = requestSchemas.get(requestType);

  if (!schema) {
    console.log(`Error, schema for type ${requestType} not found`);
    return <Navigate to="/404" />;
  }

  return (
    <>
      {modalInfo.show && modalInfo.request ? <CodeModal request={modalInfo.request} /> : null}

      <RequestDetailFormPage
        title={`New ${schema.title} request`}
        requestType={requestType}
        onSubmit={async (request, properties) => {
          const r = await authPost('/requests', {
            props: properties,
            req: request,
          });

          if (r.status === 201) {
            const js = await r.json();
            setModalInfo({ request: js.data, show: true });
          } else {
            throw new Error('There was an error with processing your request');
          }
        }}
      />
    </>
  );
}

function CodeModal({ request }: { request: WithID<Request> }) {
  const navigate = useNavigate();
  return (
    <Modal title="Success!" closeText="Close" onClose={() => navigate(-1)}>
      <p className="mt-4">
        Your request has been submitted. Please tag your samples with the following ID so that the
        operators will be able to match them to your request
      </p>
      <div className="my-8 flex flex-row justify-center items-center ">
        <p className="text-gray-600 text-2xl">#{idToStr(request)}</p>
      </div>
    </Modal>
  );
}
