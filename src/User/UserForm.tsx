import { Form, Formik } from 'formik';
import React from 'react';
import { useForm } from 'react-hook-form';

import * as Button from '../Common/Buttons';
import { MultipleChoiceInput, Option } from '../Common/Form/NewChoiceField';
import { ShortTextInput } from '../Common/Form/NewTextField';
import { Question, reqRule } from '../Common/Form/Question';
import { Card, Page } from '../Common/Layout';
import { Selection } from '../Request/Request';
import { Team } from '../Team/Team';
import * as Api from '../Utils/Api';
import { comparing } from '../Utils/Func';
import { ok } from '../Utils/Loader';
import { WithID } from '../Utils/WithID';
import { Role, User } from './User';

export type UserStub = {
  name: string;
  email: string;
  password: string;
  roles: Role[];
  teamIds: number[];
};

export type UserFormFields = {
  name: string;
  email: string;
  password: string;
  roles: Selection[];
  teamIds: Selection[];
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
  onSubmit: (values: UserStub, teamIds: number[]) => void;
}): JSX.Element {
  const { result, Loader } = Api.useAsyncGetMany<WithID<Team>>('/teams', 1000, 0);

  const teamIds: Map<string, number> = ok(result)
    ? new Map(result.data.values.map(v => [v.name, v._id]))
    : new Map();

  const selectedTeams = ok(result)
    ? user?.teamIds
        .map(id => result.data.values.find(team => team._id === id))
        .filter((t): t is WithID<Team> => t !== undefined)
        .map(t => ({ value: t._id.toString(), label: t.name }))
    : [];

  const defaultValues: UserFormFields = {
    email: user?.email ?? '',
    name: user?.name ?? '',
    password: user?.password ?? '',
    roles: user?.roles.map(r => ({ label: r, value: r })) ?? [],
    teamIds: selectedTeams ?? [],
  };

  const { register, handleSubmit, control, errors } = useForm<UserFormFields>({ defaultValues });

  return (
    <Page title={title} buttons={headerButtons}>
      <Loader>
        {({ values: teams }) => (
          <form
            onSubmit={handleSubmit(values => {
              const teamIds = values.teamIds.map(t => Number.parseInt(t.value));
              onSubmit(
                {
                  ...values,
                  teamIds,
                  roles: values.roles
                    .map(r => r.value)
                    .filter((r): r is Role => ['Admin', 'Client', 'Operator'].includes(r)),
                },
                teamIds
              );
            })}
          >
            <Card className="max-w-2xl">
              <div className="p-6">
                <Question>Name</Question>
                <ShortTextInput name="name" errors={errors} ref={register(reqRule(true))} />
                <Question>E-mail address</Question>
                <ShortTextInput name="email" errors={errors} ref={register(reqRule(true))} />
                {user ? null : (
                  <ShortTextInput
                    name="password"
                    type="password"
                    errors={errors}
                    ref={register(reqRule(true))}
                  />
                )}
                <Question>Privileges</Question>
                <MultipleChoiceInput name="roles" control={control} errors={errors}>
                  <Option value="Admin" />
                  <Option value="Client" />
                  <Option value="Operator" />
                </MultipleChoiceInput>
                <Question>Teams</Question>
                <MultipleChoiceInput name="teamIds" control={control} errors={errors}>
                  {teams.sort(comparing(t => t.name)).map(t => (
                    <Option key={t._id} value={t._id} label={t.name} />
                  ))}
                </MultipleChoiceInput>
              </div>
              <div className="flex justify-end w-full px-6 py-3 bg-gray-100">
                <Button.Cancel className="mr-3" />
                <Button.Primary type="submit" title={submitTitle} status="Normal" />
              </div>
            </Card>
          </form>
        )}
      </Loader>
    </Page>
  );
}
