import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { AtomSpinner } from 'react-epic-spinners';
import { Link, useParams } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { ShortText } from '../Common/Forms';
import { Page } from '../Common/Layout';
import { post } from '../Utils/Api';
import { Errors } from '../Utils/Errors';

type RegState = 'init' | 'loading' | 'success' | 'problem';

export function RegisterPage(): JSX.Element {
  const { email, token } = useParams();
  const [regState, setState] = useState<RegState>('init');

  return (
    <Page title="Registration">
      <Formik
        initialValues={{
          email,
          name: '',
          password: '',
          passwordCheck: '',
          team: 1,
          token,
        }}
        validate={validate}
        onSubmit={async values => {
          setState('loading');
          const r = await post('/register', values);

          if (r.ok) {
            setState('success');
          } else {
            setState('problem');
            console.log(r);
          }
        }}
      >
        <Form className="rounded-lg shadow-md bg-white p-6 flex flex-col">
          {regState === 'success' ? (
            <p className="text-green-600 mb-5">
              Registration finished correctly! You can now <Link to="/login">log in</Link>.
            </p>
          ) : (
            <>
              <ShortText path="email" label="Email address" disabled />
              <Field name="token" type="hidden" />
              <ShortText path="name" label="User name" placeholder="Name Surname" />
              <ShortText path="team" label="Team ID" disabled />
              <ShortText path="password" type="password" label="Password" />
              <ShortText path="passwordCheck" type="password" label="Password (again)" />
              {regState === 'loading' ? (
                <div className="m-auto">
                  <AtomSpinner />
                </div>
              ) : (
                <Button.Primary type="submit" title="Finish registration" />
              )}
              {regState === 'problem' && (
                <p className="text-red-600 mb-5">
                  Something went wrong. If the problem persists, contact the administrator.
                </p>
              )}
            </>
          )}
        </Form>
      </Formik>
    </Page>
  );
}

type RegValues = {
  email: string;
  password: string;
  passwordCheck: string;
  name: string;
};

function validate(values: RegValues) {
  const errors: Errors<RegValues> = {};
  if (!values.email) {
    errors.email = 'This field is required';
  } // should not happen but whatever

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 8) {
    errors.password = 'Please use a reasonably long password';
  }
  if (values.password && values.passwordCheck && values.password !== values.passwordCheck) {
    errors.passwordCheck = 'Passwords do not match';
  }

  if (!values.name) {
    errors.name = 'User name is required';
  }
  if (values.name && (values.name.length < 3 || values.name.split(' ').length < 2)) {
    errors.name = 'Please provide full name and surname';
  }
  return errors;
}
