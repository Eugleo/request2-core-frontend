import React from 'react';
import * as Icon from 'react-feather';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import * as Api from '../Utils/Api';
import * as Button from '../Common/Buttons';
import Pagination, { usePagination } from '../Common/PageSwitcher';

import { Authentized, Authorized } from '../Utils/Auth';

import Page from '../Page/Page';
import NewTeam from './NewTeam';
import EditTeam from './EditTeam';
import { comparator } from '../Utils/Func';
import { Team } from './Team';

export default function Teams() {
  return (
    <Routes>
      <Route path="" element={<TeamList />} />
      <Route path="new" element={<NewTeam />} />
      <Route path=":id/edit" element={<EditTeam />} />
    </Routes>
  );
}

function TeamList() {
  const { setTotal, limit, offset, currentPage, pages } = usePagination(10);
  const { data: payload, error, pending } = Api.useLoadResourcesWithLimit<Team>(
    '/teams',
    limit,
    offset,
    setTotal,
    v => v.sort(comparator((t: Team) => t.name))
  );
  const teams = payload?.values;

  if (error) {
    console.log(error);
    return <Navigate to="/404" />;
  }

  if (!teams || pending) {
    return <Page title="Teams" width="max-w-2xl" />;
  }

  return (
    <Page title="Teams" width="max-w-2xl">
      <Authentized otherwise={<div>You need to be logged in to view teams.</div>}>
        <div className="flex flex-col">
          <Authorized roles={['Admin']}>
            <AddTeamButton />
          </Authorized>
          <div className="flex flex-col bg-white rounded-lg shadow-sm mb-2">
            {teams.map((team: Team) => (
              <Item key={team._id} team={team} />
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
      to="new"
      className="rounded-lg border-2 border-dashed text-gray-500 border-gray-300 mb-6 py-4 flex justify-center hover:text-gray-400"
    >
      <Icon.Plus className="stroke-2 mr-1" /> Add new team
    </Link>
  );
}

function Item({ team }: { team: Team }) {
  return (
    <div className="flex list-item px-6 py-3 items-center border-b border-gray-200 hover:bg-gray-200">
      <div className="flex flex-col flex-grow">
        {team.active ? (
          <h2 className="text-gray-900 font-medium">
            {team.name}
            <span className="text-gray-500 font-normal">'s group</span>
          </h2>
        ) : (
          <h2 className="text-gray-400 font-medium">
            {team.name}
            <span className="text-gray-300 font-normal">'s group</span>
          </h2>
        )}
        <p className="text-sm text-gray-600">#{team.code}</p>
      </div>
      <Authorized roles={['Admin']}>
        <Button.NormalLinked to={`${team._id}/edit`} classNames={['pl-2', 'pr-3']}>
          <Icon.Edit3 className="mr-1 text-gray-700 h-4 stroke-2" />
          Edit
        </Button.NormalLinked>
      </Authorized>
    </div>
  );
}
