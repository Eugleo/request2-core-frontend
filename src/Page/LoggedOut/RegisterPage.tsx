import React, { useState } from 'react';
import { AtomSpinner } from 'react-epic-spinners';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';

import * as Button from '../../Common/Buttons';
import { ShortTextInput } from '../../Common/Form/NewTextField';
import { Question, reqRule } from '../../Common/Form/Question';
import { User } from '../../User/User';
import { post } from '../../Utils/Api';
import { Errors } from '../../Utils/Errors';
import logoSrc from '../../assets/register.svg';
import { CenteredForm, CenteredPage } from './CenteredPage';

type RegState = 'init' | 'loading' | 'success' | 'problem';

type RegistrationStub = {
  email: string;
  name: string;
  password: string;
  passwordCheck: string;
  token: string;
  teamId: string;
};

type RegistrationField = {
  name: string;
  password: string;
  passwordCheck: string;
};

export function RegisterPage(): JSX.Element {
  const { email, token } = useParams();
  const [regState, setState] = useState<RegState>('init');
  const { register, errors, watch, handleSubmit } = useForm<RegistrationField>({
    defaultValues: {
      name: '',
      password: '',
      passwordCheck: '',
    },
  });

  const pwd = watch('password');

  return (
    <CenteredPage
      title="Register a new account"
      subtitle="Now, just write down some more details and you're done! Please note that your account needs to be manually asigned to a team by one of our administrators."
      imageSrc={logoSrc}
      imageAlt="A user icon"
    >
      <form
        onSubmit={handleSubmit(async ({ name, password }: RegistrationStub) => {
          setState('loading');

          const r = await post<User & { token: string }>(`/register`, {
            active: true,
            dateCreated: Date.now(),
            email,
            name,
            password,
            roles: ['Client'],
            teamIds: [],
            token,
          });

          if (r.ok) {
            setState('success');
          } else {
            setState('problem');
            console.log(r);
          }
        })}
      >
        <CenteredForm>
          {regState === 'success' ? (
            <p className="text-green-600 mb-5">
              Registration finished correctly! You can now <Link to="/login">log in</Link>.
            </p>
          ) : (
            <>
              <Question>E-mail address</Question>
              <ShortTextInput disabled value={email} />
              <Question>Display name</Question>
              <ShortTextInput
                name="name"
                placeholder="Arthur Dent"
                ref={register({
                  ...reqRule(),
                  validate: val =>
                    val.name.length < 3 ||
                    val.name.split(' ').length < 2 ||
                    'Please provide your full name and surname',
                })}
              />
              <Question>Team</Question>
              <ShortTextInput disabled value="You will be assigned a team by our admin" />
              <Question>Your password</Question>
              <ShortTextInput
                name="password"
                type="password"
                ref={register({
                  ...reqRule(),
                  validate: val =>
                    val.length > 8 || 'The password needs to have at least 8 characters',
                })}
              />
              <Question>Enter the password again</Question>
              <ShortTextInput
                name="passwordCheck"
                type="password"
                ref={register({
                  ...reqRule(),
                  validate: val => val === pwd || "The passwords don't match",
                })}
              />
              {regState === 'loading' ? (
                <div className="m-auto">
                  <AtomSpinner />
                </div>
              ) : (
                <Button.Primary type="submit" title="Finish registration" className="mt-6 w-full" />
              )}
              {regState === 'problem' && (
                <p className="text-red-600 mb-5">
                  Something went wrong. If the problem persists, contact the administrator.
                </p>
              )}
            </>
          )}
        </CenteredForm>
      </form>
    </CenteredPage>
  );
}
