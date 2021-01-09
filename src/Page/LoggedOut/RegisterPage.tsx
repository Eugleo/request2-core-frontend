import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { AtomSpinner } from 'react-epic-spinners';
import { Link, useParams } from 'react-router-dom';
import { valueEventAriaMessage } from 'react-select/src/accessibility';

import * as Button from '../../Common/Buttons';
import { ShortText } from '../../Common/Form/TextField';
import { createShortTextValue, ShortTextFieldValue } from '../../Request/FieldValue';
import { User } from '../../User/User';
import { post } from '../../Utils/Api';
import { Errors } from '../../Utils/Errors';
import logoSrc from '../../assets/register.svg';
import { CenteredForm, CenteredPage } from './CenteredPage';

type RegState = 'init' | 'loading' | 'success' | 'problem';

type RegistrationStub = {
  email: ShortTextFieldValue;
  name: ShortTextFieldValue;
  password: ShortTextFieldValue;
  passwordCheck: ShortTextFieldValue;
  team: ShortTextFieldValue;
  token: ShortTextFieldValue;
};

export function RegisterPage(): JSX.Element {
  const { email, token } = useParams();
  const [regState, setState] = useState<RegState>('init');

  return (
    <CenteredPage
      title="Register a new account"
      subtitle="Now, just write down some more details and you're done! Please note that your account needs to be manually asigned to a team by one of our administrators."
      imageSrc={logoSrc}
      imageAlt="A user icon"
    >
      <Formik
        initialValues={{
          email: createShortTextValue(email),
          name: createShortTextValue(),
          password: createShortTextValue(),
          passwordCheck: createShortTextValue(),
          team: createShortTextValue('To be filled in by an admin'),
          token: createShortTextValue(token),
        }}
        validate={validate}
        onSubmit={async (values: RegistrationStub) => {
          setState('loading');
          const r = await post<User & { token: string }>(`/register`, {
            active: true,
            dateCreated: Date.now(),
            email: values.email.content,
            name: values.name.content,
            password: values.password.content,
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
        }}
      >
        <CenteredForm>
          {regState === 'success' ? (
            <p className="text-green-600 mb-5">
              Registration finished correctly! You can now <Link to="/login">log in</Link>.
            </p>
          ) : (
            <>
              <ShortText path="email" label="Email address" disabled />
              <Field name="token" type="hidden" />
              <ShortText path="name" label="User name" placeholder="Name Surname" />
              <ShortText path="team" label="Team ID" disabled />
              <ShortText path="password" type="password" label="Password" />
              <ShortText path="passwordCheck" type="password" label="Password (again)" />
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
      </Formik>
    </CenteredPage>
  );
}

function validate(values: RegistrationStub) {
  const errors: Errors<RegistrationStub> = {};
  if (!values.email) {
    errors.email = 'This field is required';
  } // should not happen but whatever

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.content.length < 8) {
    errors.password = 'Please use a reasonably long password';
  }
  if (
    values.password &&
    values.passwordCheck &&
    values.password.content !== values.passwordCheck.content
  ) {
    errors.passwordCheck = 'Passwords do not match';
  }

  if (!values.name) {
    errors.name = 'User name is required';
  }
  if (
    values.name &&
    (values.name.content.length < 3 || values.name.content.split(' ').length < 2)
  ) {
    errors.name = 'Please provide full name and surname';
  }
  return errors;
}
