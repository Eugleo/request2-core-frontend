import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Link } from 'react-router-dom';
import * as Api from './Api';
import * as Button from './Buttons';
import Pagination, { usePagination } from './Pagination';

import { Authentized, Authorized, useAuth } from './Auth';

import Page from './Page';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const { authGet } = useAuth();

  const { setTotal, limit, offset, currentPage, pages } = usePagination();

  useEffect(() => {
    const url = Api.urlWithParams('/teams', { limit, offset });
    authGet(url)
      .then(r => {
        if (r.ok) {
          return r.json();
        }
        throw new Error('Unable to retrieve the teams');
      })
      .then(json => {
        setTotal(json.total);
        setTeams(json.values);
      })
      .catch(console.log);
  }, [authGet, limit, offset]);

  return (
    <Page title="Teams" width="max-w-2xl">
      <Authentized or={<div>You need to be logged in to view teams.</div>}>
        <div className="flex flex-col">
          <Authorized roles={['Admin']}>
            <AddTeamButton />
          </Authorized>
          <div className="flex flex-col bg-white rounded-lg shadow-sm mb-2">
            {teams.map(team => (
              <Team key={team._id} editLink={`/teams/${team._id}/edit`} team={team} />
            ))}
          </div>
          <Pagination currentPage={currentPage} pages={pages} />
        </div>
      </Authentized>
    </Page>
  );
}

function AddTeamButton() {
  return (
    <Link
      to="/teams/new"
      className="rounded-lg border-2 border-dashed text-gray-500 border-gray-300 mb-6 py-4 flex justify-center hover:text-gray-400"
    >
      <Icon.Plus className="stroke-2 mr-1" /> Add new team
    </Link>
  );
}

function Team({ editLink, team }) {
  return (
    <div className="flex list-item px-6 py-3 items-center border-b border-gray-200 hover:bg-gray-200">
      <div className="flex flex-grow">
        {team.active ? (
          <h2 className="text-gray-900 font-medium">{team.name}</h2>
        ) : (
          <h2 className="text-gray-400 font-medium">{team.name}</h2>
        )}
      </div>
      <Authorized roles={['Admin']}>
        <Button.NormalLinked to={editLink} className="pl-2 pr-3">
          <Icon.Edit3 className="mr-1 text-gray-700 h-4 stroke-2" />
          Edit
        </Button.NormalLinked>
      </Authorized>
    </div>
  );
}
