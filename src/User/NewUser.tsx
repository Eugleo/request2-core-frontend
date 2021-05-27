import React from 'react';
import { useNavigate } from 'react-router';

import { useAuth } from '../Utils/Auth';
import { Role, User } from './User';
import { UserStub, UserForm } from './UserForm';

export function NewUser(): JSX.Element {
  const { authPost } = useAuth<User>();
  const navigate = useNavigate();

  const onSubmit = async ({ password, email, name, roles, teamIds, telephone, room }: UserStub) => {
    if (password) {
      const response = await authPost('/users', {
        active: true,
        dateCreated: Math.round(Date.now() / 1000),
        email,
        name,
        password,
        roles,
        teamIds,
        telephone,
        room,
      });

      if (response.status === 201) {
        navigate(-1);
      }
    } else {
      console.error('The password is undefined');
    }
  };

  return <UserForm title="Add new user" submitTitle="Create" onSubmit={onSubmit} />;
}
