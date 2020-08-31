import { Form, Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { ShortText } from '../Common/Forms';
import { Page } from '../Common/Layout';
import { UserDetails } from '../User/User';
import * as Api from '../Utils/Api';
import AuthContext, { authHeaders } from '../Utils/Auth';

export function getUserInfo(apiKey: string): Promise<UserDetails> {
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

function verifyLogin(email: string, password: string, authDispatch: Function, setFailed: Function) {
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
        console.log({ apiKey: `.${js.apiKey}.`, user: userDetails });
        authDispatch({
          type: 'LOGIN',
          payload: { apiKey: js.apiKey, user: userDetails },
        });
      });
    })
    .catch(error => console.log(error));
}

function validate(values: { email: string; password: string }) {
  const errors: { email?: string; password?: string } = {};
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
  const navigate = useNavigate();

  if (!dispatch) {
    throw Error("This shouldn't happen, ever: dispatch is null, but we're trying to log in");
  }

  // TODO Rozhodnout, kam navigovat
  return (
    <Page title="Log in to Request II">
      <div className="">
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validate={validate}
          onSubmit={values => verifyLogin(values.email, values.password, dispatch, setLoginFailed)}
        >
          <Form className="rounded-lg shadow-xs bg-white mx-auto max-w-2xl">
            <div className="px-6 py-3">
              {loginFailed ? (
                <p className="text-red-600 text-xs mb-5">Password or email is incorrect</p>
              ) : null}
              <ShortText path="email" label="Email address" />
              <ShortText type="password" path="password" label="Password" />
              <Link to="/" className="text-green-700 text-sm hover:text-green-600 mb-6">
                Forgot your password?
              </Link>
            </div>
            <div className="flex justify-end w-full px-6 py-3 bg-gray-100">
              <Button.Primary type="submit" title="Log in" status="Normal" />
            </div>
          </Form>
        </Formik>
      </div>
    </Page>
  );
}
