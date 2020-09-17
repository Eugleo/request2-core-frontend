import { Form, Formik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router';

import * as Button from '../Common/Buttons';
import { MultipleChoice, SingleChoice } from '../Common/Form/ChoiceField';
import { ShortText } from '../Common/Form/TextField';
import { Page } from '../Common/Layout';
import {
  createMultipleChoiceValue,
  createShortTextValue,
  createSingleChoiceValue,
  fieldValueToString,
  MultipleChoiceFieldValue,
  ShortTextFieldValue,
  SingleChoiceFieldValue,
} from '../Request/FieldValue';
import { Team } from '../Team/Team';
import { Role, User } from '../User/User';
import * as Api from '../Utils/Api';
import { useAuth } from '../Utils/Auth';
import { ok } from '../Utils/Loader';
import { WithID } from '../Utils/WithID';

type UserStub = {
  name: ShortTextFieldValue;
  email: ShortTextFieldValue;
  password: ShortTextFieldValue;
  roles: MultipleChoiceFieldValue;
  team: SingleChoiceFieldValue;
};

export default function NewUser() {
  const { authPost } = useAuth<User>();
  const navigate = useNavigate();
  const { result, Loader } = Api.useAsyncGetMany<WithID<Team>>('/teams', 1000, 0);

  const teams: Map<string, number> = ok(result)
    ? new Map(result.data.values.map(v => [v.name, v._id]))
    : new Map();

  return (
    <Page title="Add new user">
      <Formik
        initialValues={{
          name: createShortTextValue(),
          email: createShortTextValue(),
          password: createShortTextValue(),
          roles: createMultipleChoiceValue(),
          team: createSingleChoiceValue(),
        }}
        onSubmit={(values: UserStub) => {
          const teamId = teams.get(values.team.content);
          if (teamId) {
            authPost('/users', {
              name: fieldValueToString(values.name),
              email: fieldValueToString(values.email),
              password: fieldValueToString(values.password),
              roles: values.roles.content as Role[],
              dateCreated: Math.round(Date.now() / 1000),
              active: true,
              teamId,
            }).then(r => {
              if (r.status === 201) {
                navigate(-1);
              }
            });
          } else {
            throw Error('Selected team is not in values');
          }
        }}
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

            <Loader>
              {({ values }) => (
                <SingleChoice
                  path="team"
                  label="Team"
                  choices={values.map(t => t.name).sort()}
                  description="Missing team among the choices? Be sure to add it in the 'Teams' tab"
                />
              )}
            </Loader>
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
