import React from 'react';
import { Formik, Form } from 'formik';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { ShortText } from '../Common/Forms';
import Page from '../Page/Page';

import { useAuth } from '../Utils/Auth';
import * as Button from '../Common/Buttons';
import { useLoadResources } from '../Utils/Api';

function validate(values) {
  const error = {};

  if (!values.name) {
    error.name = 'This field is required';
  }

  if (!values.code) {
    error.code = 'This field is required';
  }

  return error;
}

export default function EditTeam() {
  const { id } = useParams();
  const { authPut, authDel } = useAuth();
  const { data: team, error, status } = useLoadResources(`/teams/${id}`);
  const navigate = useNavigate();

  if (status === 'loading') {
    return <Page title="Edit team" width="max-w-2xl" />;
  }
  if (error) {
    console.log(error);
    return <Navigate to="/404" />;
  }

  console.log({ team, error, status });

  return (
    <Page title="Edit team" width="max-w-2xl">
      <div className="bg-white rounded-md shadow-sm p-6">
        <Formik
          initialValues={{ name: team.name, code: team.code }}
          validate={validate}
          onSubmit={values => {
            // TODO Add error handling
            authPut(`/teams/${id}`, { ...team, ...values });
            navigate(-1);
          }}
        >
          <Form className="flex flex-col items-stretch">
            <ShortText
              name="name"
              onClick={obj => obj.target.setSelectionRange(0, obj.target.value.length)}
              label="Team leader"
            />
            <ShortText
              name="code"
              onClick={obj => obj.target.setSelectionRange(0, obj.target.value.length)}
              label="Institutional code"
            />
            <div className="flex justify-between w-full items-stretch pt-3">
              <Button.PrimarySubmit title="Save changes" />
              <div className="flex">
                {team.active ? (
                  <Button.Danger
                    title="Deactivate"
                    onClick={() => {
                      // TODO Add error handling
                      authDel(`/teams/${id}`);
                      navigate(-1);
                    }}
                    classNames={['mr-2']}
                  />
                ) : (
                  <Button.Secondary
                    title="Reactivate"
                    onClick={() => {
                      // TODO Add error handling
                      authPut(`/teams/${id}`, { ...team, active: true });
                      navigate(-1);
                    }}
                    classNames={['mr-2']}
                  />
                )}
                <Button.Normal title="Cancel" onClick={() => navigate(-1)} />
              </div>
            </div>
          </Form>
        </Formik>
      </div>
    </Page>
  );
}
