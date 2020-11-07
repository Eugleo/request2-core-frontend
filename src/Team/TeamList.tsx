import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { ShortText } from '../Common/Form/TextField';
import { Page } from '../Common/Layout';
import { usePagination, Pagination } from '../Common/PageSwitcher';
import { Cell, Pill, Row, Table } from '../Common/Table';
import { createShortTextValue } from '../Request/FieldValue';
import * as Api from '../Utils/Api';
import { comparing } from '../Utils/Func';
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
  const [query, setQuery] = useState<string>('sort:name');
  const { Loader } = Api.useAsyncGet<{ values: WithID<Team>[]; total: number }>(
    Api.urlWithParams('/teams', { limit, offset, query })
  );

  return (
    <Page title="Admin Panel: Teams" buttons={<Button.Create title="Create new" />}>
      <Formik
        initialValues={{ query: createShortTextValue(query) }}
        onSubmit={values => setQuery(values.query.content)}
      >
        <Form className="mx-6 mb-10 flex flex-row items-center max-w-xl">
          <ShortText onChange={e => setQuery(e.target.value)} path="query" label="Search query" />
        </Form>
      </Formik>
      <Loader>
        {({ values, total }) => (
          <>
            <Table columns={['Name', 'Company code', 'Status', '']}>
              {values.sort(comparing(t => t.name)).map(v => (
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
