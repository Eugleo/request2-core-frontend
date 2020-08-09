import c from 'classnames';
import React, { useCallback } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { Page } from '../Common/Layout';
import Pagination, { usePagination } from '../Common/PageSwitcher';
import Table from '../Common/Table';
import * as Api from '../Utils/Api';
import { Authentized } from '../Utils/Auth';
import { comparator } from '../Utils/Func';
import { WithID } from '../Utils/WithID';
import EditTeam from './EditTeam';
import NewTeam from './NewTeam';
import { Team } from './Team';

export default function TeamRouter() {
  return (
    <Routes>
      <Route path="" element={<TeamList />} />
      <Route path="new" element={<NewTeam />} />
      <Route path=":id/edit" element={<EditTeam />} />
    </Routes>
  );
}

function Pill({ text, className }: { text: string; className: string }) {
  return <span className={c('py-1 px-3 text-xs rounded-full border', className)}>{text}</span>;
}

function teamFields(team: WithID<Team>) {
  return [
    <span>{team.name}</span>,
    <p className="text-gray-700">
      <span className="text-gray-500">#</span>
      {team.code}
    </p>,
    team.active ? (
      <Pill text="Active" className="text-green-500 bg-green-100 border-green-300" />
    ) : (
      <Pill text="Inactive" className="text-red-500 bg-red-100 border-red-300" />
    ),
  ];
}

function TeamList() {
  const { limit, offset, currentPage } = usePagination(5);
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
    return <Page title="Teams">Waiting for teams</Page>;
  }

  return (
    <Page title="Teams" buttons={<Button.Create title="Create new" />}>
      <Authentized otherwise={<div>You need to be logged in to view teams.</div>}>
        <Table
          source={payload.values}
          columns={['Name', 'Company code', 'Status']}
          getRow={teamFields}
        />
      </Authentized>
      <Pagination currentPage={currentPage} limit={limit} total={payload.total} />
    </Page>
  );
}
