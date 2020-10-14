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
  const { authPut, authDel } = useAuth<WithID<Team>>();
  const { Loader } = useAsyncGet<WithID<Team>>(`/teams/${id}`);
  const navigate = useNavigate();

  return (
    <Loader>
      {team => (
        <TeamForm
          team={team}
          title={`Editing ${team.name}'s group`}
          onSubmit={values =>
            authPut(`/teams/${id}`, {
              ...team,
              code: values.code.content,
              name: values.name.content,
            })
          }
          headerButtons={
            team.active ? (
              <Button.Deactivate
                onClick={() => {
                  authDel(`/teams/${team._id}`)
                    .then(() => navigate(-1))
                    .catch(console.log);
                }}
              />
            ) : (
              <Button.Activate
                onClick={() => {
                  authPut(`/teams/${team._id}`, { ...team, active: true })
                    .then(() => navigate(-1))
                    .catch(console.log);
                }}
              />
            )
          }
        >
          <Button.Cancel className="mr-3" />
          <Button.Primary type="submit" title="Save changes" status="Normal" />
        </TeamForm>
      )}
    </Loader>
  );
}
