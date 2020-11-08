import React from 'react';
import { useSearchParams } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { Page } from '../Common/Layout';
import { usePagination, Pagination } from '../Common/PageSwitcher';
import { SearchBar } from '../Common/SearchBar';
import { Cell, Pill, Row, Table } from '../Common/Table';
import { Team } from '../Team/Team';
import * as Api from '../Utils/Api';
import { padWithSpace } from '../Utils/Func';
import { ok } from '../Utils/Loader';
import { WithID } from '../Utils/WithID';
import { User } from './User';

function UserTableItem({ user }: { user: WithID<User> }) {
  const { result } = Api.useAsyncGet<Team>(`/teams/${user.teamId}`);

  return (
    <Row>
      <Cell>{user.active ? user.name : <span className="text-gray-600">{user.name}</span>}</Cell>
      <Cell className="text-gray-700">{user.email}</Cell>
      <Cell className="text-gray-700">{ok(result) ? result.data.name : 'Loading team'}</Cell>
      <Cell>
        <div className="flex">
          {user.roles
            .map(r => (
              <Pill key={r} text={r} className="text-teal-500 bg-teal-100 border-teal-300" />
            ))
            .intersperse(ix => (
              <span key={ix} className="px-1" />
            ))}
        </div>
      </Cell>
      <Cell className="w-2">
        <div className="flex justify-right">
          <Button.Edit link={`/admin/users/${user._id}/edit`} />
        </div>
      </Cell>
    </Row>
  );
}

export function UserList(): JSX.Element {
  const { limit, offset, currentPage } = usePagination(10);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') ?? 'active:true';
  const { Loader } = Api.useAsyncGet<{ values: WithID<User>[]; total: number }>(
    Api.urlWithParams('/users', { limit, offset, query })
  );

  return (
    <Page title="Admin Panel: Users">
      <div className="px-6 mb-6 flex flex-row items-stretch w-full justify-between">
        <SearchBar
          query={padWithSpace(query)}
          onSubmit={values => setSearchParams({ query: values.query.content.trim() })}
        />
        <Button.Create title="New user" />
      </div>
      <Loader>
        {({ values, total }) => (
          <>
            <Table columns={['Name', 'Email', 'Team Leader', 'Roles', '']}>
              {values.map(v => (
                <UserTableItem key={v._id} user={v} />
              ))}
            </Table>
            <Pagination currentPage={currentPage} limit={limit} total={total} />
          </>
        )}
      </Loader>
    </Page>
  );
}
