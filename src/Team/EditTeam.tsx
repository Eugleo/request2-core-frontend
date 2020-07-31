import React from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import Page from '../Page/Page';

import { useAuth } from '../Utils/Auth';
import * as Button from '../Common/Buttons';
import { useAsyncGet } from '../Utils/Api';
import TeamForm from './TeamForm';
import { Team } from './Team';
import { WithID } from '../Utils/WithID';

// TODO Add error handling
export default function EditTeam() {
  const { id } = useParams();
  const { authPut } = useAuth();
  const { data: team, error, pending } = useAsyncGet<Team>(`/teams/${id}`);

  if (pending || !team) {
    return <Page title="Edit team" width="max-w-2xl" />;
  }
  if (error) {
    console.log(error);
    return <Navigate to="/404" />;
  }

  return (
    <TeamForm
      team={team}
      title="Create new team"
      onSubmit={values => authPut('/teams', { ...values, active: true })}
    >
      <div className="flex justify-between w-full items-stretch pt-3">
        <Button.Cancel />
        <div className="flex">
          {team.active ? <DeactivateButton id={team._id} /> : <ActivateButton team={team} />}
          <Button.PrimarySubmit title="Save changes" />
        </div>
      </div>
    </TeamForm>
  );
}

function ActivateButton({ team }: { team: WithID<Team> }) {
  const { authPut } = useAuth();
  const navigate = useNavigate();
  return (
    <Button.Secondary
      title="Reactivate"
      onClick={() => {
        authPut(`/teams/${team._id}`, { ...team, active: true })
          .then(() => navigate(-1))
          .catch(console.log);
      }}
      classNames={['mr-2']}
    />
  );
}

function DeactivateButton({ id }: { id: number }) {
  const { authDel } = useAuth();
  const navigate = useNavigate();
  return (
    <Button.Danger
      title="Deactivate"
      onClick={() => {
        authDel(`/teams/${id}`)
          .then(() => navigate(-1))
          .catch(console.log);
      }}
      classNames={['mr-2']}
    />
  );
}
