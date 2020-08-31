import { Form, Formik } from 'formik';
import React from 'react';
import { Navigate, useNavigate } from 'react-router';

import * as Button from '../Common/Buttons';
import { MultipleChoice, ShortText, SingleChoice } from '../Common/Forms';
import { Page } from '../Common/Layout';
import { Team } from '../Team/Team';
import { User } from '../User/User';
import * as Api from '../Utils/Api';
import { useAuth } from '../Utils/Auth';

export default function NewUser() {
  const { authPost } = useAuth<User>();
  const navigate = useNavigate();
  const { data: payload, error, pending } = Api.useAsyncGetMany<Team>('/teams', 1000, 0);

  if (error) {
    console.log(error);
    return <Navigate to="/404" />;
  }

  if (!payload || pending) {
    return <Page title="Add new user">Loading users</Page>;
  }
  const teams: Map<string, number> = new Map(payload.values.map(v => [v.name, v._id]));

  return (
    <Page title="Add new user">
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          roles: [],
          team: '',
        }}
        onSubmit={values =>
          authPost('/users', {
            ...values,
            dateCreated: Math.round(Date.now() / 1000),
            active: true,
            teamId: teams.get(values.team)!,
          }).then(r => {
            if (r.status === 201) {
              navigate(-1);
            }
          })
        }
      >
        <Form className="bg-white shadow-xs rounded-lg max-w-2xl mx-auto">
          <div className="p-6">
            <ShortText path="name" label="Name" />
            <ShortText
              path="email"
              label="E-Mail"
              description="We don't send any emails at the moment, the email is used as a login name"
            />
            <ShortText path="password" type="password" label="Password" />
            <MultipleChoice path="roles" label="Roles" choices={['Admin', 'Operator', 'Client']} />
            <SingleChoice
              path="team"
              label="Team"
              choices={[...teams.keys()].sort()}
              description="Missing team among the choices? Be sure to add it in the 'Teams' tab"
            />
          </div>
          <div className="flex justify-end w-full px-6 py-3 bg-gray-100">
            <Button.Cancel className="mr-3" />
            <Button.Primary type="submit" title="Add user" status="Normal" />
          </div>
        </Form>
      </Formik>
    </Page>
  );
}
