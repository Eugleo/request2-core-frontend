import React, { useCallback } from 'react';
import * as Icon from 'react-feather';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import c from 'classnames';
import * as Api from '../Utils/Api';
import * as Button from '../Common/Buttons';
import Pagination, { usePagination } from '../Common/PageSwitcher';
import { Authentized, Authorized } from '../Utils/Auth';
import Page from '../Page/Page';
import NewTeam from './NewTeam';
import { comparator } from '../Utils/Func';
import { Team } from './Team';
import EditTeam from './EditTeam';
import { WithID } from '../Utils/WithID';

export default function TeamRouter() {
  return (
    <Routes>
      <Route path="" element={<TeamList />} />
      <Route path="new" element={<NewTeam />} />
      <Route path=":id/edit" element={<EditTeam />} />
    </Routes>
  );
}

function TeamList() {
  const { limit, offset, currentPage } = usePagination();
  const sort = useCallback(v => v.sort(comparator((t: Team) => t.name)), []);
  const { data: payload, error, pending } = Api.useAsyncGetMany<Team>(
    '/teams',
    limit,
    offset,
    sort
  );

  if (error) {
    console.log(error);
    return <Navigate to="/404" />;
  }

  if (!payload || pending) {
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
            {payload.values.map(team => (
              <Item key={team._id} team={team} />
            ))}
          </div>
          <Pagination currentPage={currentPage} limit={limit} total={payload.total} />
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

function Item({ team }: { team: WithID<Team> }) {
  return (
    <div className="flex list-item px-6 py-3 items-center border-b border-gray-200 hover:bg-gray-200">
      <div className="flex flex-col flex-grow">
        <h2 className={c('font-medium', team.active ? 'text-gray-900' : 'text-gray-400')}>
          {team.name}
          <span className={c('font-normal', team.active ? 'text-gray-500' : 'text-gray-300')}>
            's group
          </span>
        </h2>
        <p className={c('text-sm', team.active ? 'text-gray-600' : 'text-gray-400')}>
          #{team.code}
        </p>
      </div>
      <Authorized roles={['Admin']}>
        <Button.Edit id={team._id} />
      </Authorized>
    </div>
  );
}
