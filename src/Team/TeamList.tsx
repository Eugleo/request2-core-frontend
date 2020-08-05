import React, { useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import c from 'classnames';
import { off } from 'process';
import * as Api from '../Utils/Api';
import * as Button from '../Common/Buttons';
import Pagination, { usePagination } from '../Common/PageSwitcher';
import { Authentized, Authorized } from '../Utils/Auth';
import { Page } from '../Common/Layout';
import NewTeam from './NewTeam';
import { comparator } from '../Utils/Func';
import { Team } from './Team';
import EditTeam from './EditTeam';
import { WithID } from '../Utils/WithID';
import SearchSidebar from '../Common/SearchSidebar';

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
  const { limit, offset, currentPage } = usePagination(5);
  console.log(limit, offset, currentPage);

  const sort = useCallback(v => v.sort(comparator((t: Team) => t.name)), []);
  const { data: payload, error, pending } = Api.useAsyncGetMany<Team>(
    '/teams',
    limit,
    offset,
    sort
  );

  console.log(payload);

  if (error) {
    console.log(error);
    return <Navigate to="/404" />;
  }

  if (!payload || pending) {
    return <Page title="Teams">Waiting for teams</Page>;
  }

  return (
    <div style={{ gridTemplateColumns: 'auto 1fr' }} className="grid grid-cols-2">
      <SearchSidebar />
      <Page title="Teams" buttons={<Button.Create title="Create new" />}>
        <Authentized otherwise={<div>You need to be logged in to view teams.</div>}>
          <div className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex flex-col">
              <div
                style={{ gridTemplateColumns: '2fr 1fr 1fr 0.5fr' }}
                className="grid grid-cols-4 col-gap-20 pl-6 pr-3 py-3 bg-gray-100 border-b border-gray-200"
              >
                <p className="text-xs text-gray-600 font-medium">TEAM LEADER</p>
                <p className="text-xs text-gray-600 font-medium text-right">COMPANY CODE</p>
                <p className="text-xs text-gray-600 font-medium text-right">ACTIVE</p>
              </div>
              {payload.values.map(team => (
                <Item key={team._id} team={team} />
              ))}
            </div>
          </div>
        </Authentized>
        <Pagination currentPage={currentPage} limit={limit} total={payload.total} />
      </Page>
    </div>
  );
}

function Pill({ text, className }: { text: string; className: string }) {
  return <span className={c('py-1 px-3 text-xs rounded-full', className)}>{text}</span>;
}

function Item({ team }: { team: WithID<Team> }) {
  return (
    <div
      style={{ gridTemplateColumns: '2fr 1fr 1fr 0.5fr' }}
      className="border-b list-item border-gray-200 pl-6 pr-3 py-3 hover:bg-gray-100 grid grid-cols-4 col-gap-20"
    >
      <div className="flex flex-row items-center">
        <h2 className={c(team.active ? 'text-gray-900' : 'text-gray-400')}>{team.name}</h2>
      </div>
      <div className="flex items-center">
        <p className={c('text-right w-full', team.active ? 'text-gray-700' : 'text-gray-400')}>
          <span className="text-gray-500">#</span>
          {team.code}
        </p>
      </div>
      <div className="flex items-center justify-end">
        {team.active ? (
          <Pill text="Active" className="text-green-500 bg-green-200" />
        ) : (
          <Pill text="Inactive" className="text-red-500 bg-red-200 " />
        )}
      </div>
      <Authorized roles={['Admin']}>
        <div className="flex flex-row-reverse">
          <Button.More id={team._id} />
        </div>
      </Authorized>
    </div>
  );
}
