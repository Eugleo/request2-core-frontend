import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import * as Button from '../../Common/Buttons';
import { ShortTextInput } from '../../Common/Form/NewTextField';
import { Question, reqRule } from '../../Common/Form/Question';
import { Card } from '../../Common/Layout';
import { Link } from '../../Common/Link';
import { UserDetails } from '../../User/User';
import * as Api from '../../Utils/Api';
import { authHeaders } from '../../Utils/Auth';
import { useAuthDispatch } from '../../Utils/AuthContext';
import { Errors } from '../../Utils/Errors';
import logoSrc from '../../assets/logoII.svg';
import { CenteredForm, CenteredPage } from './CenteredPage';

export async function getUserInfo(apiKey: string): Promise<{ data: UserDetails }> {
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

    const userDetails = await getUserInfo(js.data.apiKey);
    authDispatch({
      payload: { apiKey: js.data.apiKey, user: userDetails.data },
      type: 'LOGIN',
    });
  } else {
    setFailed(true);
    throw new Error('Incorrect email and/or password');
  }
}

type LoginStub = { email: string; password: string };

export function LoginPage(): JSX.Element {
  const [loginFailed, setLoginFailed] = useState(false);
  const dispatch = useAuthDispatch();

  const { register, errors, watch, handleSubmit } = useForm<LoginStub>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const email = watch('email');

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
      <form
        onSubmit={handleSubmit(async (values: LoginStub) =>
          verifyLogin(values.email, values.password, dispatch, setLoginFailed).catch(console.log)
        )}
      >
        <CenteredForm>
          {loginFailed ? (
            <p className="text-red-600 text-xs mb-5">Password or email is incorrect</p>
          ) : null}
          <Question>E-mail address</Question>
          <ShortTextInput name="email" reg={register(reqRule())} errors={errors} />
          <Question>Password</Question>
          <ShortTextInput
            name="password"
            type="password"
            reg={register(reqRule())}
            errors={errors}
          />
          <div className="mb-6">
            <Link to={`/password-reset/${email}`} className="text-xs">
              Forgot your password?
            </Link>
          </div>

          <Button.Primary type="submit" title="Log in" status="Normal" className="w-full" />
        </CenteredForm>
      </form>
    </CenteredPage>
  );
}
