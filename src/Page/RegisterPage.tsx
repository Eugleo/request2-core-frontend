import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { AtomSpinner } from 'react-epic-spinners';
import { Link, useParams } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { ShortText } from '../Common/Form/TextField';
import { Page } from '../Common/Layout';
import { createShortTextValue, ShortTextFieldValue } from '../Request/FieldValue';
import { post } from '../Utils/Api';
import { Errors } from '../Utils/Errors';

type RegState = 'init' | 'loading' | 'success' | 'problem';

type RegistrationStub = {
  email: ShortTextFieldValue;
  name: ShortTextFieldValue;
  password: ShortTextFieldValue;
  passwordCheck: ShortTextFieldValue;
  team: ShortTextFieldValue;
  token: ShortTextFieldValue;
};

export function RegisterPage(): JSX.Element {
  const { email, token } = useParams();
  const [regState, setState] = useState<RegState>('init');

  return (
    <Page title="Registration">
      <Formik
        initialValues={{
          email: createShortTextValue(email),
          name: createShortTextValue(),
          password: createShortTextValue(),
          passwordCheck: createShortTextValue(),
          team: createShortTextValue('1'),
          token: createShortTextValue(token),
        }}
        validate={validate}
        onSubmit={async (values: RegistrationStub) => {
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

function validate(values: RegistrationStub) {
  const errors: Errors<RegistrationStub> = {};
  if (!values.email) {
    errors.email = 'This field is required';
  } // should not happen but whatever

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.content.length < 8) {
    errors.password = 'Please use a reasonably long password';
  }
  if (values.password && values.passwordCheck && values.password !== values.passwordCheck) {
    errors.passwordCheck = 'Passwords do not match';
  }

  if (!values.name) {
    errors.name = 'User name is required';
  }
  if (
    values.name &&
    (values.name.content.length < 3 || values.name.content.split(' ').length < 2)
  ) {
    errors.name = 'Please provide full name and surname';
  }
  return errors;
}
