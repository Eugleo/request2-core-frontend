import React from 'react';
import { useNavigate, useParams } from 'react-router';

import * as Button from '../Common/Buttons';
import { useAsyncGet } from '../Utils/Api';
import { useAuth } from '../Utils/Auth';
import { WithID } from '../Utils/WithID';
import { Role, User } from './User';
import { UserStub, UserForm } from './UserForm';

export function EditUser(): JSX.Element {
  const { id } = useParams();
  const { Loader } = useAsyncGet<WithID<User>>(`/users/${id}`);
  return <Loader>{user => <EditUserForm user={user} />}</Loader>;
}

function EditUserForm({ user }: { user: WithID<User> }) {
  const { authPut, authDel } = useAuth<User>();
  const navigate = useNavigate();

  const onSubmit = async (values: UserStub, teamIds: number[]) => {
    const response = await authPut(`/users/${user._id}`, {
      ...user,
      email: fieldValueToString(values.email),
      name: fieldValueToString(values.name),
      roles: values.roles.content as Role[],
      teamIds,
    });

    if (response.status === 200) {
      navigate(-1);
    }
  };

  return (
    <UserForm
      title={`Editing ${user.name}`}
      submitTitle="Save changes"
      headerButtons={
        user.active ? (
          <Button.Deactivate
            onClick={async () => {
              await authDel(`/users/${user._id}`);
              navigate(-1);
            }}
          />
        ) : (
          <Button.Activate
            onClick={async () => {
              await authPut(`/users/${user._id}`, { ...user, active: true });
              navigate(-1);
            }}
          />
        )
      }
      user={user}
      onSubmit={onSubmit}
    />
  );
}
