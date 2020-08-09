import React, { useMemo, useState } from 'react';
import { Formik, Form } from 'formik';
import { useParams, useNavigate } from 'react-router-dom';
import fieldLib from './RequestTypes/field-library.json';
import { Page } from '../Common/Layout';
import {
  ShortText,
  LongText,
  TextWithHints,
  SingleChoice,
  MultipleChoice,
  Image,
} from '../Common/Forms';

import fieldTransformSM from './SmallMoleculeRequest';
import { useAuth } from '../Utils/Auth';
import * as Button from '../Common/Buttons';
import { makeFieldPath } from '../Utils/FieldPath';
import Modal from '../Common/Modal';
import { idToStr, Request } from './Request';
import requestSchemas from './RequestTypes';
import RequestDetailForm from './RequestDetailForm';
import { stringify, FieldValue } from './RequestSchema';
import { Maybe } from '../Utils/Maybe';
import { WithID } from '../Utils/WithID';

function submit(
  authPost: (url: string, data: any) => Promise<Response>,
  type: string,
  formValues: { [_: string]: FieldValue },
  authorId: number,
  teamId: number
) {
  const mkProp = (n: string, t: string, d: string) => ({
    authorId,
    dateAdded: Math.round(Date.now() / 1000),
    active: true,
    propertyName: n,
    propertyType: t,
    propertyData: d,
  });

  const status = mkProp('status', 'General', 'Pending');
  const title = mkProp('title', 'General', stringify(formValues.title));
  const details = Object.entries(formValues)
    .filter(([name]) => name !== 'title')
    .map(([name, value]) => mkProp(name, 'Detail', stringify(value)));

  return authPost('/requests', {
    props: [status, title, ...details],
    req: {
      name: formValues.title,
      authorId,
      teamId,
      status: 'Pending',
      requestType: type,
      dateCreated: Math.round(Date.now() / 1000),
    },
  });
}

// TODO Check that the field names are unique
export default function NewRequestPage() {
  const [modalInfo, setModalInfo] = useState<{ show: boolean; request: Maybe<WithID<Request>> }>({
    show: false,
    request: undefined,
  });
  const { requestType } = useParams();
  const { auth, authPost } = useAuth();
  const navigate = useNavigate();

  const schema = requestSchemas.get(requestType);

  return (
    <>
      {modalInfo.show && modalInfo.request ? (
        <Modal title="Success!" closeText="Close" onClose={() => navigate(-1)}>
          <p className="mt-4">
            Your request has been submitted. Please tag your samples with the following ID so that
            the operators will be able to match them to your request
          </p>
          <div className="my-8 flex flex-row justify-center items-center ">
            <p className="text-gray-600 text-2xl">#{idToStr(modalInfo!.request)}</p>
          </div>
        </Modal>
      ) : null}

      <RequestDetailForm
        title={`New ${schema?.title || 'request'}`}
        requestType={requestType}
        onSubmit={values =>
          submit(authPost, requestType, values, auth.user.userId, auth.user.team._id)
            .then(r =>
              r.status === 201
                ? r.json()
                : new Error('There was an error with processing your request')
            )
            .then(js => setModalInfo({ show: true, request: js.data }))
        }
      />
    </>
  );
}
