import { Form, Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { ShortText } from '../Common/Forms';
import { Page } from '../Common/Layout';
import * as Api from '../Utils/Api';
import AuthContext, { authHeaders, NotAuthentized } from '../Utils/Auth';

function getUserInfo(apiKey) {
  return Api.get('/me', authHeaders(apiKey))
    .then(r => {
      if (r.ok) {
        return r.json();
      }
      throw new Error('Failed to retrieve user by api key');
    })
    .then(js => js)
    .catch(error => console.log(error));
}

function verifyLogin(email, password, authDispatch, setFailed) {
  return Api.post('/login', { email, password })
    .then(r => {
      if (r.ok) {
        setFailed(false);
        return r.json();
      }
      setFailed(true);
      throw new Error('Incorrect email and/or password');
    })
    .then(js => {
      getUserInfo(js.apiKey).then(userDetails => {
        console.log({ ...js, user: userDetails });
        authDispatch({
          type: 'LOGIN',
          payload: { ...js, ...userDetails },
        });
      });
    })
    .catch(error => console.log(error));
}

function validate(values) {
  const errors = {};
  if (!values.email) {
    errors.email = 'This field is required';
  }

  if (!values.password) {
    errors.password = 'This field is required';
  }

  return errors;
}

export default function LoginPage() {
  const [loginFailed, setLoginFailed] = useState(false);
  const { dispatch } = useContext(AuthContext);

  // TODO Rozhodnout, kam navigovat
  return (
    <Page title="Log in to reQuest" width="max-w-md">
      <NotAuthentized otherwise={<Navigate to="/me/requests" />}>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validate={validate}
          onSubmit={values => verifyLogin(values.email, values.password, dispatch, setLoginFailed)}
        >
          <Form className="rounded-lg shadow-md bg-white p-6 flex flex-col">
            {loginFailed ? (
              <p className="text-red-600 text-xs mb-5">Password or email is incorrect</p>
            ) : null}
            <ShortText path="email" label="Email address" />
            <ShortText type="password" path="password" label="Password" />
            <Link to="/" className="text-green-700 text-sm hover:text-green-600 mb-6">
              Forgot you password?
            </Link>
            <Button.Primary type="submit" title="Log in" />
          </Form>
        </Formik>
      </NotAuthentized>
    </Page>
  );
}
