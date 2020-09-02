import moment from 'moment';
import React from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';

import { Page } from '../../Common/Layout';
import { usePagination } from '../../Common/PageSwitcher';
import Table, { Cell, Pill, Row } from '../../Common/Table';
import { User } from '../../User/User';
import * as Api from '../../Utils/Api';
import { comparator } from '../../Utils/Func';
import { WithID } from '../../Utils/WithID';
import EditRequestPage from '../EditRequest';
import { idToStr, Request } from '../Request';
import RequestPage from '../RequestPage';
import { statusStyle, statusToStr } from '../Status';

export default function Requests() {
  return (
    <Routes>
      <Route path="" element={<RequestList />} />
      <Route path=":id" element={<RequestPage />} />
      <Route path=":id/edit" element={<EditRequestPage />} />
    </Routes>
  );
}

function RequestTableItem({ request }: { request: WithID<Request> }) {
  const { data: author } = Api.useAsyncGet<User>(`/users/${request.authorId}`);

  return (
    <Row>
      <Cell align="left">
        <Link to={request._id.toString()} className="font text-black hover:text-green-700">
          {request.name}
        </Link>
      </Cell>
      <Cell className="text-gray-700 font-mono">
        <span className="text-gray-500">#</span>
        {idToStr(request)}
      </Cell>
      <Cell className="text-gray-700">{author ? author.name : 'Loading'}</Cell>
      <Cell className="text-gray-700">{moment.unix(request.dateCreated).fromNow()}</Cell>
      <Cell>
        <Pill text={statusToStr(request.status)} className={statusStyle(request.status)} />
      </Cell>
    </Row>
  );
}

function RequestList() {
  const { limit, offset } = usePagination(100);
  const { data: payload, error, pending } = Api.useAsyncGetMany<Request>(
    '/requests',
    limit,
    offset,
    v => v.sort(comparator(r => r.dateCreated))
  );

  if (error) {
    console.log(error);
    return <Navigate to="/404" />;
  }

  if (pending || !payload) {
    return <Page title="Client's Requests">Loading requests</Page>;
  }

  return (
    <Page title="Clients' requests">
      <Table columns={['Name', 'ID number', 'Author', 'Requested', 'Status']}>
        {payload.values.map(v => (
          <RequestTableItem request={v} />
        ))}
      </Table>
    </Page>
  );
}
