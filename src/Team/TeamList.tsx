import React from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { Page } from '../Common/Layout';
import { usePagination, Pagination } from '../Common/PageSwitcher';
import { SearchBar } from '../Common/SearchBar';
import { Cell, Pill, Row, Table } from '../Common/Table';
import * as Api from '../Utils/Api';
import { padWithSpace } from '../Utils/Func';
import { WithID } from '../Utils/WithID';
import { EditTeam } from './EditTeam';
import { NewTeam } from './NewTeam';
import { Team } from './Team';

export function TeamRouter(): JSX.Element {
  return (
    <Routes>
      <Route path="" element={<TeamList />} />
      <Route path="new" element={<NewTeam />} />
      <Route path=":id/edit" element={<EditTeam />} />
    </Routes>
  );
}

function TeamTableItem({ team }: { team: WithID<Team> }) {
  return (
    <Row>
      <Cell>{team.name}</Cell>
      <Cell className="text-gray-700">
        <span className="text-gray-500">#</span>
        {team.code}
      </Cell>
      <Cell>
        {team.active ? (
          <Pill text="Active" className="text-green-500 bg-green-100 border-green-300" />
        ) : (
          <Pill text="Inactive" className="text-red-500 bg-red-100 border-red-300" />
        )}
      </Cell>
      <Cell className="w-2">
        <div className="flex justify-right">
          <Button.Edit link={`/teams/${team._id}/edit`} />
        </div>
      </Cell>
    </Row>
  );
}

function TeamList() {
  const { limit, offset, currentPage } = usePagination(10);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') ?? 'active:true';
  const { Loader } = Api.useAsyncGet<{ values: WithID<Team>[]; total: number }>(
    Api.urlWithParams('/teams', { limit, offset, query })
  );

  return (
    <Page title="Admin Panel: Teams">
      <div className="px-6 mb-6 flex flex-row items-stretch w-full justify-between">
        <SearchBar
          query={padWithSpace(query)}
          onSubmit={values => setSearchParams({ query: values.query.content.trim() })}
        />
        <Button.Create title="New team" />
      </div>
      <Loader>
        {({ values, total }) => (
          <>
            <Table columns={['Name', 'Company code', 'Status', '']}>
              {values.map(v => (
                <TeamTableItem key={v._id} team={v} />
              ))}
            </Table>
            <Pagination currentPage={currentPage} limit={limit} total={total} />
          </>
        )}
      </Loader>
    </Page>
  );
}
