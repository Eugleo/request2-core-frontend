import React from 'react';
import { useNavigate } from 'react-router';

import { useAuth } from '../Utils/Auth';
import { Role, User } from './User';
import { UserStub, UserForm } from './UserForm';

export function NewUser(): JSX.Element {
  const { authPost } = useAuth<User>();
  const navigate = useNavigate();

  const onSubmit = async ({ password, email, name, roles, teamIds }: UserStub) => {
    const response = await authPost('/users', {
      active: true,
      dateCreated: Math.round(Date.now() / 1000),
      email,
      name,
      password,
      roles,
      teamIds,
    });

    if (response.status === 201) {
      navigate(-1);
    }
  };

  return <UserForm title="Add new user" submitTitle="Create" onSubmit={onSubmit} />;
}
