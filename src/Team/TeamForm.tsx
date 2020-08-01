import React from 'react';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Team } from './Team';
import { Maybe } from '../Utils/Maybe';
import { ShortText } from '../Common/Forms';
import Page from '../Page/Page';

type TeamStub = { name: string; code: string };

function validate(values: TeamStub) {
  const error: TeamStub = { name: '', code: '' };

  if (!values.name) {
    error.name = 'This field is required';
  }

  if (!values.code) {
    error.code = 'This field is required';
  }

  return error;
}

export default function TeamForm({
  title,
  team,
  onSubmit,
  children,
}: {
  title: string;
  team?: Maybe<Team>;
  onSubmit: (values: TeamStub) => Promise<Response>;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <Page title={title} width="max-w-2xl">
      <div className="bg-white rounded-md shadow-sm p-6">
        <Formik
          initialValues={{ name: team?.name || '', code: team?.code || '' }}
          validate={validate}
          onSubmit={values => {
            onSubmit(values)
              .then(() => navigate(-1))
              .catch(console.log);
          }}
        >
          <Form className="flex flex-col items-start">
            <ShortText name="name" label="Team leader" />
            <ShortText name="code" label="Institutional code" />
            {children}
          </Form>
        </Formik>
      </div>
    </Page>
  );
}