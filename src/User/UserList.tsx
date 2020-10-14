import React from 'react';

import * as Button from '../Common/Buttons';
import { Page } from '../Common/Layout';
import Pagination, { usePagination } from '../Common/PageSwitcher';
import { Cell, Pill, Row, Table } from '../Common/Table';
import { Team } from '../Team/Team';
import * as Api from '../Utils/Api';
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

export default function UserList() {
  const { limit, currentPage } = usePagination(10);
  // const sort = useCallback(v => v.sort(comparator((u: User) => u.name)), []);
  const { Loader } = Api.useAsyncGetMany<WithID<User>>('/users', 1000, 0);

  return (
    <Page title="Admin Panel: Users" buttons={<Button.Create title="Create new" />}>
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
