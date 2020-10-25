import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { ShortText } from '../Common/Form/TextField';
import { Page } from '../Common/Layout';
import { createShortTextValue, ShortTextFieldValue } from '../Request/FieldValue';
import { UserDetails } from '../User/User';
import * as Api from '../Utils/Api';
import { authHeaders } from '../Utils/Auth';
import { useAuthDispatch } from '../Utils/AuthContext';
import { Errors } from '../Utils/Errors';

export async function getUserInfo(apiKey: string): Promise<UserDetails> {
  const r = await Api.get('/me', authHeaders(apiKey));
  if (r.ok) {
    return r.json();
  }
  throw new Error('Failed to retrieve user by api key');
}

async function verifyLogin(
  email: string,
  password: string,
  authDispatch: Function,
  setFailed: Function
) {
  const r = await Api.post('/login', { email, password });
  if (r.ok) {
    setFailed(false);
    const js = await r.json();
    const userDetails = await getUserInfo(js.apiKey);
    authDispatch({
      payload: { apiKey: js.apiKey, user: userDetails },
      type: 'LOGIN',
    });
  }
  setFailed(true);
  throw new Error('Incorrect email and/or password');
}

function validate(values: LoginStub) {
  const errors: Errors<LoginStub> = {};
  if (!values.email) {
    errors.email = 'This field is required';
  }

  if (!values.password) {
    errors.password = 'This field is required';
  }

  return errors;
}

type LoginStub = { email: ShortTextFieldValue; password: ShortTextFieldValue };

export function LoginPage(): JSX.Element {
  const [loginFailed, setLoginFailed] = useState(false);
  const dispatch = useAuthDispatch();

  // TODO Rozhodnout, kam navigovat
  return (
    <Page title="Log in to Request II">
      <div className="">
        <Formik
          initialValues={{
            email: createShortTextValue(),
            password: createShortTextValue(),
          }}
          validate={validate}
          onSubmit={(values: LoginStub) =>
            verifyLogin(values.email.content, values.password.content, dispatch, setLoginFailed)
          }
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
