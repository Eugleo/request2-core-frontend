import React from 'react';
import { useNavigate } from 'react-router';

import { fieldValueToString } from '../Request/FieldValue';
import { useAuth } from '../Utils/Auth';
import { Role, User } from './User';
import UserForm, { UserStub } from './UserForm';

export default function NewUser() {
  const { authPost } = useAuth<User>();
  const navigate = useNavigate();

  const onSubmit = async (values: UserStub, teamId: number) => {
    const response = await authPost('/users', {
      name: fieldValueToString(values.name),
      email: fieldValueToString(values.email),
      password: fieldValueToString(values.password),
      roles: values.roles.content as Role[],
      dateCreated: Math.round(Date.now() / 1000),
      active: true,
      teamId,
    });

    if (response.status === 201) {
      navigate(-1);
    }
  };

  return <UserForm title="Add new user" submitTitle="Create" onSubmit={onSubmit} />;
}
