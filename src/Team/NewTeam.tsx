import React from 'react';

import * as Button from '../Common/Buttons';
import { useAuth } from '../Utils/Auth';
import { Team } from './Team';
import { TeamForm } from './TeamForm';

export function NewTeam(): JSX.Element {
  const { authPost } = useAuth<Team>();
  return (
    <TeamForm
      title="Create new team"
      onSubmit={values =>
        authPost('/teams', { active: true, code: values.code.content, name: values.name.content })
      }
    >
      <Button.Cancel className="mr-3" />
      <Button.Primary type="submit" title="Submit new team" status="Normal" />
    </TeamForm>
  );
}
