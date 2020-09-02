import React, { useCallback } from 'react';
import { Navigate } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { Page } from '../Common/Layout';
import Pagination, { usePagination } from '../Common/PageSwitcher';
import Table, { Cell, Pill, Row } from '../Common/Table';
import { Team } from '../Team/Team';
import { User } from '../User/User';
import * as Api from '../Utils/Api';
import { comparator } from '../Utils/Func';
import { WithID } from '../Utils/WithID';

function UserTableItem({ user }: { user: WithID<User> }) {
  const { data: team } = Api.useAsyncGet<Team>(`/teams/${user.teamId}`);

  return (
    <Row>
      <Cell align="left">{user.name}</Cell>
      <Cell className="text-gray-700">{user.email}</Cell>
      <Cell className="text-gray-700">{team?.name || 'Loading team'}</Cell>
      <Cell>
        <div className="grid grid-flow-col gap-2">
          {user.roles.map(r => (
            <Pill key={r} text={r} className="text-teal-500 bg-teal-100 border-teal-300" />
          ))}
        </div>
      </Cell>
    </Row>
  );
}

export default function UserList() {
  const { limit, currentPage } = usePagination(5);
  const sort = useCallback(v => v.sort(comparator((u: User) => u.name)), []);
  const { data: payload, error, pending } = Api.useAsyncGetMany<User>('/users', 1000, 0, sort);

  if (error) {
    console.log(error);
    return <Navigate to="/404" />;
  }

  if (!payload || pending) {
    return <Page title="Admin Panel: Users">Waiting for users</Page>;
  }

  return (
    <Page title="Admin Panel: Users" buttons={<Button.Create title="Create new" />}>
      <Table columns={['Name', 'Email', 'Team Leader', 'Roles']}>
        {payload.values.map(v => (
          <UserTableItem key={v._id} user={v} />
        ))}
      </Table>
      <Pagination currentPage={currentPage} limit={limit} total={payload.total} />
    </Page>
  );
}
