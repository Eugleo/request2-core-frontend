import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { AtomSpinner } from 'react-epic-spinners';
import { Link, useParams } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { ShortText } from '../Common/Forms';
import { Page } from '../Common/Layout';
import { post } from '../Utils/Api';
import { Errors } from '../Utils/Errors';

type RegValues = { email: string };

function validate(values: RegValues) {
  const errors: Errors<RegValues> = {};
  if (!values.email) {
    // TODO check e-maility of the e-mail
    errors.email = 'This field is required';
  }
  return errors;
}

export function NewRegistrationPage() {
  const [regState, setState] = useState('init');

  return (
    <Page title="New registration">
      <Formik
        initialValues={{ email: '' }}
        validate={validate}
        onSubmit={values => {
          setState('loading');
          post('/register-init', { email: values.email })
            .then(r => {
              if (r.ok) {
                setState('success');
              } else {
                throw new Error('register-init failed');
              }
            })
            .catch(error => {
              setState('problem');
              console.log(error);
            });
        }}
      >
        <Form className="rounded-lg shadow-md bg-white p-6 flex flex-col">
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
                <Button.Primary type="submit" title="Register" />
              )}
              {regState === 'problem' && (
                <p className="text-red-600 mb-5">
                  Something went wrong. If the problem persists, contact the administrator.
                </p>
              )}
            </>
          )}
        </Form>
      </Formik>
    </Page>
  );
}
