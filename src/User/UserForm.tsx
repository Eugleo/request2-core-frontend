import React from 'react';
import { useForm } from 'react-hook-form';

import * as Button from '../Common/Buttons';
import { MultipleChoiceInput, Option } from '../Common/Form/NewChoiceField';
import { ShortTextInput } from '../Common/Form/NewTextField';
import { Question, reqRule } from '../Common/Form/Question';
import { Body, Card, ContentWrapper, Header, Page, Spacer, Title } from '../Common/Layout';
import { Selection } from '../Request/Request';
import { Team } from '../Team/Team';
import * as Api from '../Utils/Api';
import { comparing } from '../Utils/Func';
import { ok } from '../Utils/Loader';
import { Maybe } from '../Utils/Maybe';
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
  teamIds: Maybe<Selection[]>;
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
  onSubmit: (values: UserStub) => void;
}): JSX.Element {
  const { Loader } = Api.useAsyncGetMany<WithID<Team>>('/teams', 1000, 0);

  return (
    <ContentWrapper>
      <div className="max-w-4xl w-full mx-auto">
        <Header>
          <Title>{title}</Title>
          {headerButtons && (
            <>
              <Spacer /> {headerButtons}
            </>
          )}
        </Header>
        <Body>
          <Loader>
            {({ values }) => (
              <FormComponent
                submitTitle={submitTitle}
                teams={values}
                user={user}
                onSubmit={onSubmit}
              />
            )}
          </Loader>
        </Body>
      </div>
    </ContentWrapper>
  );
}

function FormComponent({
  submitTitle,
  teams,
  user,
  onSubmit,
}: {
  submitTitle: string;
  teams: WithID<Team>[];
  user: Maybe<WithID<User>>;
  onSubmit: (values: UserStub) => void;
}) {
  const selectedTeams =
    user?.teamIds
      .map(id => teams.find(team => team._id === id))
      .filter((t): t is WithID<Team> => t !== undefined)
      .map(t => ({ value: t._id.toString(), label: t.name })) ?? [];

  const defaultValues: UserFormFields = {
    email: user?.email ?? '',
    name: user?.name ?? '',
    password: user?.password ?? '',
    roles: user?.roles.map(r => ({ label: r, value: r })) ?? [],
    teamIds: selectedTeams,
  };

  const { register, handleSubmit, control, errors, watch } = useForm<UserFormFields>({
    defaultValues,
  });
  return (
    <form
      onSubmit={handleSubmit(values => {
        const teamIds = values.teamIds?.map(t => Number.parseInt(t.value)) ?? [];
        onSubmit({
          ...values,
          teamIds,
          roles: values.roles
            .map(r => r.value)
            .filter((r): r is Role => ['Admin', 'Client', 'Operator'].includes(r)),
        });
      })}
    >
      <Card className="">
        <div className="p-6 space-y-6">
          <div>
            <Question required>Name</Question>
            <ShortTextInput name="name" errors={errors} reg={register(reqRule())} />
          </div>
          <div>
            <Question required>E-mail address</Question>
            <ShortTextInput name="email" errors={errors} reg={register(reqRule())} />
          </div>
          {user ? null : (
            <div>
              <Question required>Password</Question>
              <ShortTextInput
                name="password"
                type="password"
                errors={errors}
                reg={register(reqRule())}
              />
            </div>
          )}
          <div>
            <Question required="You have to assign at least one role">Privileges</Question>
            <MultipleChoiceInput
              name="roles"
              control={control}
              errors={errors}
              required="You have to assign at least one role"
              defaultValue={user ? user.roles.map(r => ({ label: r, value: r })) : []}
              value={watch('roles')}
            >
              <Option value="Admin" />
              <Option value="Client" />
              <Option value="Operator" />
            </MultipleChoiceInput>
          </div>
          <div>
            <Question required={false}>Teams</Question>
            <MultipleChoiceInput
              name="teamIds"
              control={control}
              errors={errors}
              defaultValue={selectedTeams ?? []}
              value={watch('teamIds', [])}
            >
              {teams.sort(comparing(t => t.name)).map(t => (
                <Option key={t._id} value={t._id} label={t.name} />
              ))}
            </MultipleChoiceInput>
          </div>
        </div>
        <div className="flex justify-end w-full px-6 py-3 bg-gray-50 rounded-b-lg">
          <Button.Cancel className="mr-3" />
          <Button.Primary type="submit" title={submitTitle} status="Normal" />
        </div>
      </Card>
    </form>
  );
}
