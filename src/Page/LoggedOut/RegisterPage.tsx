import React, { useState } from 'react';
import { AtomSpinner } from 'react-epic-spinners';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';

import * as Button from '../../Common/Buttons';
import { ShortTextInput } from '../../Common/Form/NewTextField';
import { Description, Question, reqRule } from '../../Common/Form/Question';
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
  telephone: string;
  room: string;
};

type RegistrationField = {
  name: string;
  password: string;
  passwordCheck: string;
  telephone: string;
  room: string;
};

type RegistrationUser = {
  email: string;
  token: string;
  name: string;
  password: string;
  telephone: string;
  room: string;
};

export function RegisterPage(): JSX.Element {
  const { email, token } = useParams();
  const [regState, setState] = useState<RegState>({ state: 'init' });
  const { register, errors, watch, handleSubmit } = useForm<RegistrationField>();

  const pwd = watch('password');

  return (
    <CenteredPage
      title="Register a new account"
      subtitle="Now, just write down some more details and you're done! Please note that your account needs to be manually asigned to a team by one of our administrators."
      imageSrc={logoSrc}
      imageAlt="A user icon"
    >
      <form
        onSubmit={handleSubmit(async ({ name, password, room, telephone }: RegistrationStub) => {
          setState({ state: 'loading' });

          const r = await post<RegistrationUser>(`/register`, {
            email,
            name,
            password,
            token,
            room,
            telephone,
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
                <Question showIcons={false}>E-mail address</Question>
                <ShortTextInput disabled value={email} />
              </div>
              <div>
                <Question required>Display name</Question>
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
                <Question required>Telephone number</Question>
                <ShortTextInput
                  name="telephone"
                  placeholder="163"
                  reg={register(reqRule())}
                  errors={errors}
                />
                <Description>
                  Input either the IOCB telehpone number, or if need be your mobile number
                </Description>
              </div>
              <div>
                <Question required>Where can we find you?</Question>
                <ShortTextInput
                  name="room"
                  placeholder="A 1.89"
                  reg={register(
                    reqRule('We need this information in case we need to contact you personally')
                  )}
                  errors={errors}
                />
                <Description>
                  The pattern is '[building code] [floor number].[door number]'
                </Description>
              </div>
              <div>
                <Question showIcons={false}>Team</Question>
                <ShortTextInput disabled value="You will be assigned a team by our admin" />
              </div>
              <div>
                <Question required>Your password</Question>
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
                <Question required>Enter the password again</Question>
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
                <Button.Primary type="submit" title="Finish registration" className="w-full" />
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
