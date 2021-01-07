import { Form, Formik } from 'formik';
import React, { useState } from 'react';

import * as Button from '../../Common/Buttons';
import { ShortText } from '../../Common/Form/TextField';
import { Link } from '../../Common/Link';
import { createShortTextValue, ShortTextFieldValue } from '../../Request/FieldValue';
import { UserDetails } from '../../User/User';
import * as Api from '../../Utils/Api';
import { authHeaders } from '../../Utils/Auth';
import { useAuthDispatch } from '../../Utils/AuthContext';
import { Errors } from '../../Utils/Errors';
import logoSrc from '../../assets/logoII.svg';
import { CenteredForm, CenteredPage } from './CenteredPage';

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

  return (
    <CenteredPage
      title="Sign in to Request 2"
      subtitle={
        <>
          Or <Link to="/register">register a new account</Link> if you don't have one yet
        </>
      }
      imageSrc={logoSrc}
      imageAlt="The Request 2 logo"
    >
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
        {formik => (
          <CenteredForm>
            {loginFailed ? (
              <p className="text-red-600 text-xs mb-5">Password or email is incorrect</p>
            ) : null}
            <ShortText path="email" label="Email address" />
            <ShortText type="password" path="password" label="Password" />
            <div className="mb-6">
              <Link to={`/password-reset/${formik.values.email.content}`} className="text-xs">
                Forgot your password?
              </Link>
            </div>

            <Button.Primary type="submit" title="Log in" status="Normal" className="w-full" />
          </CenteredForm>
        )}
      </Formik>
    </CenteredPage>
  );
}
