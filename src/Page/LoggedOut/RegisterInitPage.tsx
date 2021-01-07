import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { AtomSpinner } from 'react-epic-spinners';

import * as Button from '../../Common/Buttons';
import { ShortText } from '../../Common/Form/TextField';
import { Page } from '../../Common/Layout';
import { createShortTextValue, ShortTextFieldValue } from '../../Request/FieldValue';
import { post } from '../../Utils/Api';
import { Errors } from '../../Utils/Errors';
import logoSrc from '../../assets/register.svg';
import { CenteredForm, CenteredPage } from './CenteredPage';

function validate(values: { email: ShortTextFieldValue }) {
  const errors: Errors<{ email: ShortTextFieldValue }> = {};
  if (!values.email) {
    // TODO check e-maility of the e-mail
    errors.email = 'This field is required';
  }
  return errors;
}

export function RegisterInitPage(): JSX.Element {
  const [regState, setState] = useState('init');

  return (
    <CenteredPage
      title="Register a new account"
      subtitle="First, enter the email address you want to asociate with your new account. You'll be automatically sent an invitation link."
      imageSrc={logoSrc}
      imageAlt="A user icon"
    >
      <Formik
        initialValues={{ email: createShortTextValue() }}
        validate={validate}
        onSubmit={async (values: { email: ShortTextFieldValue }) => {
          setState('loading');
          const r = await post('/register-init', { email: values.email.content });
          if (r.ok) {
            setState('success');
          } else {
            console.log('register-init failed');
            setState('problem');
          }
        }}
      >
        <CenteredForm>
          {regState === 'success' ? (
            <p className="text-green-600 mb-5">
              Registration started correctly! Please check your mailbox for an activation e-mail.
            </p>
          ) : (
            <>
              <ShortText path="email" label="Email address" />
              {regState === 'loading' ? (
                <div className="m-auto">
                  <AtomSpinner />
                </div>
              ) : (
                <Button.Primary
                  type="submit"
                  title="Send invitation link"
                  className="w-full mt-6"
                />
              )}
              {regState === 'problem' && (
                <p className="text-red-600 mb-5">
                  Something went wrong. If the problem persists, contact the administrator.
                </p>
              )}
            </>
          )}
        </CenteredForm>
      </Formik>
    </CenteredPage>
  );
}
