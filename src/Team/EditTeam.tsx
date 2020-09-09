import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { useAsyncGet } from '../Utils/Api';
import { useAuth } from '../Utils/Auth';
import { WithID } from '../Utils/WithID';
import { Team } from './Team';
import TeamForm from './TeamForm';

export default function EditTeam() {
  const { id } = useParams();
  const { authPut } = useAuth();
  const { Loader } = useAsyncGet<WithID<Team>>(`/teams/${id}`);

  return (
    <Loader>
      {team => (
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
      )}
    </Loader>
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
