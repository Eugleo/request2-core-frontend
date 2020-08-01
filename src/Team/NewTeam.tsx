import React from 'react';
import { useAuth } from '../Utils/Auth';
import * as Button from '../Common/Buttons';
import TeamForm from './TeamForm';
import { Team } from './Team';

export default function NewTeam() {
  const { authPost } = useAuth<Team>();
  return (
    <TeamForm
      title="Create new team"
      onSubmit={values => authPost('/teams', { ...values, active: true })}
    >
      <Button.Cancel />
      <span className="flex-grow" />
      <Button.PrimarySubmit title="Submit new team" />
    </TeamForm>
  );
}
