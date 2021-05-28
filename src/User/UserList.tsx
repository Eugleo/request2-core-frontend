import React from 'react';

import * as Button from '../Common/Buttons';
import { useQuery } from '../Common/Hooks';
import { Page } from '../Common/Layout';
import { usePagination, Pagination } from '../Common/PageSwitcher';
import { ActivityPill, Pill } from '../Common/Pills';
import { SearchBar } from '../Common/SearchBar';
import { Cell, Row, Table } from '../Common/Table';
import { Team } from '../Team/Team';
import * as Api from '../Utils/Api';
import { padWithSpace } from '../Utils/Func';
import { ok } from '../Utils/Loader';
import { WithID } from '../Utils/WithID';
import { User } from './User';
import { LinkToProfile } from './UserProfile';

function TeamPill({ teamId }: { teamId: number }) {
  const { Loader } = Api.useAsyncGet<Team>(`/teams/${teamId}`);

  return <Loader>{team => <Pill>{team.name}</Pill>}</Loader>;
}

function UserTableItem({ user }: { user: WithID<User> }) {
  return (
    <Row>
      <Cell>
        <LinkToProfile userId={user._id} className="font-normal" />
      </Cell>
      <Cell className="text-gray-700">{user.email}</Cell>
      <Cell className="text-gray-700">
        <div className="flex flex-row items-center flex-wrap gap-2">
          {user.teamIds.map(id => (
            <TeamPill key={id} teamId={id} />
          ))}
        </div>
      </Cell>
      <Cell>
        <div className="flex">
          {user.roles
            .map(r => <Pill key={r}>{r}</Pill>)
            .intersperse(ix => (
              <span key={ix} className="px-1" />
            ))}
        </div>
      </Cell>
      <Cell>
        <ActivityPill active={user.active} />
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
  const [query, setQuery] = useQuery('active:true');
  const { Loader } = Api.useAsyncGet<{ values: WithID<User>[]; total: number }>(
    Api.urlWithParams('/users', { limit, offset, query })
  );

  return (
    <Page title="Admin Panel: Users">
      <div className="mb-6 flex flex-row items-stretch w-full justify-between">
        <SearchBar
          query={padWithSpace(query)}
          onSubmit={values => {
            setQuery(values.query.trim());
          }}
        />
        <Button.Create title="New user" />
      </div>
      <Loader>
        {data => (
          <>
            <Table columns={['Name', 'Email', 'Team Leader', 'Roles', 'Status', '']}>
              {data.values.map(v => (
                <UserTableItem key={v._id} user={v} />
              ))}
            </Table>
            <Pagination currentPage={currentPage} limit={limit} total={data.total} />
          </>
        )}
      </Loader>
    </Page>
  );
}
