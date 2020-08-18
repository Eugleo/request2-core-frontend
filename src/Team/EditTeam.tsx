import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { Page } from '../Common/Layout';
import { useAsyncGet } from '../Utils/Api';
import { useAuth } from '../Utils/Auth';
import { WithID } from '../Utils/WithID';
import { Team } from './Team';
import TeamForm from './TeamForm';

// TODO Add error handling
export default function EditTeam() {
  const { id } = useParams();
  const { authPut } = useAuth();
  const { data: team, error, pending } = useAsyncGet<WithID<Team>>(`/teams/${id}`);

  if (pending || !team) {
    return <Page title="Edit team">Waiting for teams</Page>;
  }
  if (error) {
    console.log(error);
    return <Navigate to="/404" />;
  }

  return (
    <TeamForm
      team={team}
      title={`Editing ${team.name}'s group`}
      onSubmit={values => authPut('/teams', { ...values, active: true })}
      headerButtons={
        team.active ? <DeactivateButton id={team._id} /> : <ActivateButton team={team} />
      }
    >
      <Button.Cancel className="mr-3" />
      <Button.Primary type="submit" title="Save changes" status="Normal" />
    </TeamForm>
  );
}

function ActivateButton({ team }: { team: WithID<Team> }) {
  const { authPut } = useAuth();
  const navigate = useNavigate();
  return (
    <Button.Secondary
      title="Reactivate"
      status="Normal"
      onClick={() => {
        authPut(`/teams/${team._id}`, { ...team, active: true })
          .then(() => navigate(-1))
          .catch(console.log);
      }}
      className="mr-2"
    />
  );
}

function DeactivateButton({ id }: { id: number }) {
  const { authDel } = useAuth();
  const navigate = useNavigate();
  return (
    <Button.Secondary
      title="Deactivate"
      status="Danger"
      onClick={() => {
        authDel(`/teams/${id}`)
          .then(() => navigate(-1))
          .catch(console.log);
      }}
      className="mr-2"
    />
  );
}
