import React, { useState } from 'react';
import { AtomSpinner } from 'react-epic-spinners';
import { useForm } from 'react-hook-form';

import * as Button from '../../Common/Buttons';
import { ShortTextInput } from '../../Common/Form/NewTextField';
import { Question, reqRule } from '../../Common/Form/Question';
import { post } from '../../Utils/Api';
import logoSrc from '../../assets/register.svg';
import { CenteredForm, CenteredPage } from './CenteredPage';

type RegState = { state: 'init' | 'loading' | 'success' } | { state: 'problem'; message: string };

export function RegisterInitPage(): JSX.Element {
  const [regState, setState] = useState<RegState>({ state: 'init' });
  const { register, errors, handleSubmit } = useForm<{ email: string }>({
    defaultValues: { email: '' },
  });

  return (
    <CenteredPage
      title="Register a new account"
      subtitle="First, enter the email address you want to asociate with your new account. You'll be automatically sent an invitation e-mail with further instructions."
      imageSrc={logoSrc}
      imageAlt="A user icon"
    >
      <form
        onSubmit={handleSubmit(async ({ email }) => {
          setState({ state: 'loading' });
          const r = await post('/register-init', { email });
          if (r.ok) {
            setState({ state: 'success' });
          } else {
            const js = await r.json();
            setState({
              state: 'problem',
              message:
                js.error ??
                'Something went wrong. If the problem persists, contact the administrator.',
            });
          }
        })}
      >
        <CenteredForm>
          {regState.state === 'success' ? (
            <p className="text-indigo-600 mb-5">
              Registration started correctly! Please check your mailbox for an activation e-mail.
            </p>
          ) : (
            <>
              <div>
                <Question required>E-mail address</Question>
                <ShortTextInput
                  name="email"
                  autoComplete="work email"
                  errors={errors}
                  reg={register(reqRule())}
                />
              </div>
              {regState.state === 'loading' ? (
                <div className="m-auto">
                  <AtomSpinner />
                </div>
              ) : (
                <Button.Primary
                  type="submit"
                  title="Send invitation e-mail"
                  className="w-full mt-6"
                />
              )}
              {regState.state === 'problem' && (
                <p className="text-red-600 text-xs">{regState.message}</p>
              )}
            </>
          )}
        </CenteredForm>
      </form>
    </CenteredPage>
  );
}
