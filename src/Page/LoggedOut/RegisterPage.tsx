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

type RegState = { state: 'init' | 'loading' | 'success' } | { state: 'problem'; message: string };

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
  const [regState, setState] = useState<RegState>({ state: 'init' });
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
          setState({ state: 'loading' });

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
            setState({ state: 'success' });
          } else {
            const js = await r.json();
            setState({ state: 'problem', message: js.error ?? 'Something went wrong' });
            console.log(js);
          }
        })}
      >
        <CenteredForm>
          {regState.state === 'success' ? (
            <p className="text-green-600 mb-5">
              Registration finished correctly! You can now <Link to="/login">log in</Link>.
            </p>
          ) : (
            <>
              <div>
                <Question>E-mail address</Question>
                <ShortTextInput disabled value={email} />
              </div>
              <div>
                <Question>Display name</Question>
                <ShortTextInput
                  name="name"
                  placeholder="Arthur Dent"
                  reg={register({
                    ...reqRule(),
                    validate: val =>
                      val.length > 3 ||
                      val.split(' ').length > 2 ||
                      'Please provide your full name and surname',
                  })}
                  errors={errors}
                />
              </div>
              <div>
                <Question>Team</Question>
                <ShortTextInput disabled value="You will be assigned a team by our admin" />
              </div>
              <div>
                <Question>Your password</Question>
                <ShortTextInput
                  name="password"
                  type="password"
                  reg={register({
                    ...reqRule(),
                    validate: val =>
                      val.length > 8 || 'The password needs to have at least 8 characters',
                  })}
                  errors={errors}
                />
              </div>
              <div>
                <Question>Enter the password again</Question>
                <ShortTextInput
                  name="passwordCheck"
                  type="password"
                  reg={register({
                    ...reqRule(),
                    validate: val => val === pwd || "The passwords don't match",
                  })}
                  errors={errors}
                />
              </div>
              {regState.state === 'loading' ? (
                <div className="m-auto">
                  <AtomSpinner />
                </div>
              ) : (
                <Button.Primary type="submit" title="Finish registration" className="mt-6 w-full" />
              )}
              {regState.state === 'problem' && (
                <p className="text-red-600 mb-5">{regState.message}</p>
              )}
            </>
          )}
        </CenteredForm>
      </form>
    </CenteredPage>
  );
}
