import moment from 'moment';
import React from 'react';
import { Link, Route, Routes, useSearchParams } from 'react-router-dom';

import { Secondary } from '../../Common/Buttons';
import { Page } from '../../Common/Layout';
import { usePagination } from '../../Common/PageSwitcher';
import { SearchBar } from '../../Common/SearchBar';
import { Cell, Pill, Row, Table } from '../../Common/Table';
import { User } from '../../User/User';
import * as Api from '../../Utils/Api';
import { padWithSpace } from '../../Utils/Func';
import { ok } from '../../Utils/Loader';
import { WithID } from '../../Utils/WithID';
import { EditRequestPage } from '../EditRequest';
import { idToStr, Request } from '../Request';
import { RequestPage } from '../RequestPage';
import { statusStyle, statusToStr } from '../Status';

export function Requests(): JSX.Element {
  return (
    <Routes>
      <Route path="" element={<RequestList />} />
      <Route path=":id" element={<RequestPage />} />
      <Route path=":id/edit" element={<EditRequestPage />} />
    </Routes>
  );
}

function RequestTableItem({ request }: { request: WithID<Request> }) {
  const { result } = Api.useAsyncGet<User>(`/users/${request.authorId}`);

  return (
    <Row>
      <Cell>
        <Link to={request._id.toString()} className="font text-black hover:text-green-700">
          {request.name}
        </Link>
      </Cell>
      <Cell className="text-gray-700 font-mono">
        <span className="text-gray-500">#</span>
        {idToStr(request)}
      </Cell>
      <Cell className="text-gray-700">{ok(result) ? result.data.name : 'Loading'}</Cell>
      <Cell className="text-gray-700">{moment.unix(request.dateCreated).fromNow()}</Cell>
      <Cell>
        <Pill text={statusToStr(request.status)} className={statusStyle(request.status)} />
      </Cell>
    </Row>
  );
}

function RequestList() {
  const { limit, offset } = usePagination(10);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') ?? '-status:deleted';
  const { Loader } = Api.useAsyncGet<{ values: WithID<Request>[]; total: number }>(
    Api.urlWithParams('/requests', { limit, offset, query })
  );

  return (
    <Page title="Clients' requests">
      <div className="px-6 mb-6 flex flex-row items-stretch w-full justify-between">
        <SearchBar
          query={padWithSpace(query)}
          onSubmit={values => setSearchParams({ query: values.query.content.trim() })}
        />
        <Secondary className="flex-shrink-0" type="submit" title="Search" />
      </div>
      <Loader>
        {({ values }) => (
          <Table columns={['Name', 'ID number', 'Author', 'Requested', 'Status']}>
            {values.map(v => (
              <RequestTableItem key={v._id} request={v} />
            ))}
          </Table>
        )}
      </Loader>
    </Page>
  );
}
