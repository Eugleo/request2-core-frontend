import React, { useContext, useState } from 'react';
import { Formik, Form } from 'formik';
import { Link, Redirect } from 'react-router-dom';
import * as Api from './Api';

import { CenteredPage } from './Page';
import InputField from './Forms';
import AuthContext, { useAuth } from './Auth';

import * as Button from './Buttons';

function getUserInfo(authGet) {
  return authGet('/me')
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
  const { authGet } = useAuth();

  if (auth.loggedIn) {
    return <Redirect to="/announcements" />;
  }

  return (
    <CenteredPage title="Log in to reQuest" width="max-w-md">
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
          <InputField name="email" label="Email address" />
          <InputField type="password" name="password" label="Password" />
          <Link to="/" className="text-green-700 text-sm hover:text-green-600 mb-6">
            Forgot you password?
          </Link>
          <Button.Primary title="Log in" type="submit" />
        </Form>
      </Formik>
    </CenteredPage>
  );
}
