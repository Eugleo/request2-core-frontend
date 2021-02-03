import React, { useState } from 'react';
import { AtomSpinner } from 'react-epic-spinners';
import { useForm } from 'react-hook-form';

import * as Button from '../../Common/Buttons';
import { ShortTextInput } from '../../Common/Form/NewTextField';
import { Question, reqRule } from '../../Common/Form/Question';
import { post } from '../../Utils/Api';
import logoSrc from '../../assets/register.svg';
import { CenteredForm, CenteredPage } from './CenteredPage';

export function RegisterInitPage(): JSX.Element {
  const [regState, setState] = useState('init');
  const { register, errors, watch, handleSubmit } = useForm<{ email: string }>({
    defaultValues: {
      email: '',
    },
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
          setState('loading');
          const r = await post('/register-init', { email });
          if (r.ok) {
            setState('success');
          } else {
            setState('problem');
          }
        })}
      >
        <CenteredForm>
          {regState === 'success' ? (
            <p className="text-green-600 mb-5">
              Registration started correctly! Please check your mailbox for an activation e-mail.
            </p>
          ) : (
            <>
              <div>
                <Question>E-mail address</Question>
                <ShortTextInput name="email" errors={errors} reg={register(reqRule())} />
              </div>
              {regState === 'loading' ? (
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
              {regState === 'problem' && (
                <p className="text-red-600 text-xs">
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
