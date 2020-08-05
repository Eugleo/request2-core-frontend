import React, { ReactNode } from 'react';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Team } from './Team';
import { Maybe } from '../Utils/Maybe';
import { ShortText } from '../Common/Forms';
import { Page } from '../Common/Layout';

type TeamStub = { name: string; code: string };

function validate(values: TeamStub) {
  const error: { name?: string; code?: string } = {};

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
  headerButtons,
}: {
  title: string;
  team?: Maybe<Team>;
  onSubmit: (values: TeamStub) => Promise<Response>;
  children: ReactNode;
  headerButtons?: React.ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <Page title={title} buttons={headerButtons}>
      <div className="bg-white rounded-md overflow-hidden shadow-xs mx-auto max-w-md">
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
            <div className="px-6 mt-4 mb-8 w-full">
              <ShortText name="name" label="Team leader" />
              <ShortText name="code" label="Institutional code" />
            </div>
            <div className="flex justify-end w-full px-6 py-3 bg-gray-100">{children}</div>
          </Form>
        </Formik>
      </div>
    </Page>
  );
}
