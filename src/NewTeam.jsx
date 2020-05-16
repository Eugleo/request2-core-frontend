import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { Redirect } from 'react-router-dom';
import InputField from './Forms';
import Page from './Page';

import { useAuth } from './Auth';
import * as Button from './Buttons';

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
  const [shouldRedirect, setShouldRedirect] = useState(false);

  if (shouldRedirect) {
    return <Redirect to="/teams" />;
  }

  return (
    <Page title="New team" width="max-w-2xl">
      <div className="bg-white rounded-md shadow-sm p-6">
        <Formik
          initialValues={{ name: '', code: '' }}
          validate={validate}
          onSubmit={values => {
            authPost('/teams', { ...values, active: true });
            setShouldRedirect(true);
          }}
        >
          <Form className="flex flex-col items-start">
            <InputField name="name" label="Team leader" />
            <InputField name="code" label="Institutional code" />
            <div className="flex justify-between w-full items-stretch pt-3">
              <Button.Primary title="Add new team" type="submit" />
              <Button.Normal title="Cancel" onClick={() => setShouldRedirect(true)} />
            </div>
          </Form>
        </Formik>
      </div>
    </Page>
  );
}
