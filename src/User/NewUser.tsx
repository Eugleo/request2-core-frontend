import React from 'react';
import { useNavigate } from 'react-router';

import { fieldValueToString } from '../Request/FieldValue';
import { useAuth } from '../Utils/Auth';
import { Role, User } from './User';
import { UserStub, UserForm } from './UserForm';

export function NewUser(): JSX.Element {
  const { authPost } = useAuth<User>();
  const navigate = useNavigate();

  const onSubmit = async (values: UserStub, teamId: number) => {
    const response = await authPost('/users', {
      active: true,
      dateCreated: Math.round(Date.now() / 1000),
      email: fieldValueToString(values.email),
      name: fieldValueToString(values.name),
      password: fieldValueToString(values.password),
      roles: values.roles.content as Role[],
      teamId,
    });

    if (response.status === 201) {
      navigate(-1);
    }
  };

  return <UserForm title="Add new user" submitTitle="Create" onSubmit={onSubmit} />;
}
