import React from 'react';
import { useAuth } from '../Utils/Auth';
import * as Button from '../Common/Buttons';
import TeamForm from './TeamForm';

export default function NewTeam() {
  const { authPost } = useAuth();
  return (
    <TeamForm
      title="Create new team"
      onSubmit={values => authPost('/teams', { ...values, active: true })}
    >
      <div className="flex justify-between w-full items-stretch pt-3">
        <Button.PrimarySubmit title="Submit new team" />
        <Button.Cancel />
      </div>
    </TeamForm>
  );
}
