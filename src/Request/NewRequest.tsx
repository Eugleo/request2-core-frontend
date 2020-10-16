import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Modal from '../Common/Modal';
import { useAuth } from '../Utils/Auth';
import { Maybe } from '../Utils/Maybe';
import { WithID } from '../Utils/WithID';
import { BareProperty, idToStr, Request } from './Request';
import RequestDetailFormPage from './RequestDetailForm';
import { requestSchemas } from './RequestTypes';

// TODO Check that the field names are unique
export default function NewRequestPage() {
  const [modalInfo, setModalInfo] = useState<{ show: boolean; request: Maybe<WithID<Request>> }>({
    show: false,
    request: null,
  });
  const { requestType } = useParams();
  const { authPost } = useAuth<{ req: Request; props: BareProperty[] }>();

  const schema = requestSchemas.get(requestType);

  return (
    <>
      {modalInfo.show && modalInfo.request ? <CodeModal request={modalInfo.request} /> : null}

      <RequestDetailFormPage
        requestType={requestType}
        onSubmit={async (request, properties) => {
          const r = await authPost('/requests', {
            props: properties,
            req: request,
          });

          if (r.status === 201) {
            const js = await r.json();
            setModalInfo({ show: true, request: js.data });
          } else {
            throw Error('There was an error with processing your request');
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
