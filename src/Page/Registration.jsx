import React, { useState } from 'react';
import { AtomSpinner } from 'react-epic-spinners';
import { Formik, Form, Field } from 'formik';
import { Link, useParams } from 'react-router-dom';
import * as Api from '../Utils/Api';

import { Page } from '../Common/Layout';
import { ShortText } from '../Common/Forms';

import * as Button from '../Common/Buttons';

function validate(values) {
  const errors = {};
  if (!values.email) {
    // TODO check e-maility of the e-mail
    errors.email = 'This field is required';
  }
  return errors;
}

export function NewRegistrationPage() {
  const [regState, setState] = useState('init');

  return (
    <Page title="New registration" width="max-w-md">
      <Formik
        initialValues={{ email: '' }}
        validate={validate}
        onSubmit={values => {
          setState('loading');
          Api.post('/register-init', { email: values.email })
            .then(r => {
              if (r.ok) setState('success');
              else throw new Error('register-init failed');
            })
            .catch(e => {
              setState('problem');
              console.log(e);
            });
        }}
      >
        <Form className="rounded-lg shadow-md bg-white p-6 flex flex-col">
          {regState === 'success' ? (
            <p className="text-green-600 mb-5">
              Registration started correctly! Please check your mailbox for an activation e-mail.
            </p>
          ) : (
            <>
              <ShortText name="email" label="Email address" />
              {regState === 'loading' ? (
                <div className="m-auto">
                  <AtomSpinner />
                </div>
              ) : (
                <Button.Primary type="submit" title="Register" />
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

export function RegisterPage() {
  const { email, token } = useParams();
  const [regState, setState] = useState('init');

  return (
    <Page title="Registration" width="max-w-md">
      <Formik
        initialValues={{
          email,
          token,
          name: '',
          password: '',
          passwordCheck: '',
          team: 1,
        }}
        validate={values => {
          const errors = {};
          if (!values.email) errors.email = 'This field is required'; // should not happen but whatever

          if (!values.password) errors.password = 'Password is required';
          else if (values.password.length < 8)
            errors.password = 'Please use a reasonably long password';
          if (values.password && values.passwordCheck && values.password !== values.passwordCheck)
            errors.passwordCheck = 'Passwords do not match';

          if (!values.name) errors.name = 'User name is required';
          if (values.name && (values.name.length < 3 || values.name.split(' ').length < 2))
            errors.name = 'Please provide full name and surname';
          return errors;
        }}
        onSubmit={values => {
          setState('loading');
          Api.post('/register', values)
            .then(r => {
              if (r.ok) setState('success');
              else throw new Error('register failed');
            })
            .catch(e => {
              setState('problem');
              console.log(e);
            });
        }}
      >
        <Form className="rounded-lg shadow-md bg-white p-6 flex flex-col">
          {regState === 'success' ? (
            <p className="text-green-600 mb-5">
              Registration finished correctly! You can now <Link to="/login">log in</Link>.
            </p>
          ) : (
            <>
              <ShortText name="email" label="Email address" disabled />
              <Field name="token" type="hidden" />
              <ShortText name="name" label="User name" placeholder="Name Surname" />
              <ShortText name="team" label="Team ID" disabled />
              <ShortText name="password" type="password" label="Password" />
              <ShortText name="passwordCheck" type="password" label="Password (again)" />
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
