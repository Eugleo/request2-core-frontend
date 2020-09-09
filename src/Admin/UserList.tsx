import React from 'react';

import * as Button from '../Common/Buttons';
import { Page } from '../Common/Layout';
import Pagination, { usePagination } from '../Common/PageSwitcher';
import Table, { Cell, Pill, Row } from '../Common/Table';
import { Team } from '../Team/Team';
import { User } from '../User/User';
import * as Api from '../Utils/Api';
import { ok } from '../Utils/Loader';
import { WithID } from '../Utils/WithID';

function UserTableItem({ user }: { user: WithID<User> }) {
  const { result } = Api.useAsyncGet<Team>(`/teams/${user.teamId}`);

  return (
    <Row>
      <Cell align="left">{user.name}</Cell>
      <Cell className="text-gray-700">{user.email}</Cell>
      <Cell className="text-gray-700">{ok(result) ? result.data.name : 'Loading team'}</Cell>
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
  // const sort = useCallback(v => v.sort(comparator((u: User) => u.name)), []);
  const { Loader } = Api.useAsyncGetMany<WithID<User>>('/users', 1000, 0);

  return (
    <Page title="Admin Panel: Users" buttons={<Button.Create title="Create new" />}>
      <Loader>
        {({ values, total }) => (
          <>
            <Table columns={['Name', 'Email', 'Team Leader', 'Roles']}>
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
