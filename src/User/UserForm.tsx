import { Form, Formik } from 'formik';
import React from 'react';

import * as Button from '../Common/Buttons';
import { MultipleChoice, SingleChoice } from '../Common/Form/ChoiceField';
import { ShortText } from '../Common/Form/TextField';
import { Page } from '../Common/Layout';
import {
  createMultipleChoiceValue,
  createShortTextValue,
  createSingleChoiceValue,
  MultipleChoiceFieldValue,
  ShortTextFieldValue,
  SingleChoiceFieldValue,
} from '../Request/FieldValue';
import { Team } from '../Team/Team';
import * as Api from '../Utils/Api';
import { comparing } from '../Utils/Func';
import { ok } from '../Utils/Loader';
import { WithID } from '../Utils/WithID';
import { User } from './User';

export type UserStub = {
  name: ShortTextFieldValue;
  email: ShortTextFieldValue;
  password: ShortTextFieldValue;
  roles: MultipleChoiceFieldValue;
  team: SingleChoiceFieldValue;
};

export function UserForm({
  title,
  submitTitle,
  headerButtons,
  user,
  onSubmit,
}: {
  title: string;
  submitTitle: string;
  user?: WithID<User>;
  headerButtons?: React.ReactNode;
  onSubmit: (values: UserStub, teamId: number) => void;
}): JSX.Element {
  const { result, Loader } = Api.useAsyncGetMany<WithID<Team>>('/teams', 1000, 0);

  const teamIds: Map<string, number> = ok(result)
    ? new Map(result.data.values.map(v => [v.name, v._id]))
    : new Map();

  const selectedTeam = ok(result)
    ? result.data.values.find(t => t._id === user?.teamId)?.name
    : undefined;

  const initialValues = {
    email: createShortTextValue(user?.email),
    name: createShortTextValue(user?.name),
    password: createShortTextValue(user?.password),
    roles: createMultipleChoiceValue(user?.roles.join(';;;')),
    team: createSingleChoiceValue(selectedTeam),
  };

  return (
    <Page title={title} buttons={headerButtons}>
      <Loader>
        {({ values: teams }) => (
          <Formik
            initialValues={initialValues}
            onSubmit={values => {
              const teamId = teamIds.get(values.team.content);
              if (teamId) {
                onSubmit(values, teamId);
              } else {
                throw new Error('Selected team is not in values');
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
                {user ? null : <ShortText path="password" type="password" label="Password" />}
                <MultipleChoice
                  path="roles"
                  label="Roles"
                  choices={['Admin', 'Operator', 'Client']}
                />

                <SingleChoice
                  path="team"
                  label="Team"
                  choices={teams.sort(comparing(t => t.name)).map(t => t.name)}
                  description="Missing team among the choices? Be sure to add it in the 'Teams' tab"
                />
              </div>
              <div className="flex justify-end w-full px-6 py-3 bg-gray-100">
                <Button.Cancel className="mr-3" />
                <Button.Primary type="submit" title={submitTitle} status="Normal" />
              </div>
            </Form>
          </Formik>
        )}
      </Loader>
    </Page>
  );
}
