import React from 'react';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import { ShortText } from '../Common/Forms';
import Page from '../Page/Page';

import { useAuth } from '../Utils/Auth';
import * as Button from '../Common/Buttons';

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

export default function NewTeam() {
  const { authPost } = useAuth();
  const navigate = useNavigate();

  return (
    <Page title="New team" width="max-w-2xl">
      <div className="bg-white rounded-md shadow-sm p-6">
        <Formik
          initialValues={{ name: '', code: '' }}
          validate={validate}
          onSubmit={values => {
            authPost('/teams', { ...values, active: true });
            navigate('..');
          }}
        >
          <Form className="flex flex-col items-start">
            <ShortText name="name" label="Team leader" />
            <ShortText name="code" label="Institutional code" />
            <div className="flex justify-between w-full items-stretch pt-3">
              <Button.PrimarySubmit title="Add new team" />
              <Button.Normal title="Cancel" onClick={() => navigate('..')} />
            </div>
          </Form>
        </Formik>
      </div>
    </Page>
  );
}
