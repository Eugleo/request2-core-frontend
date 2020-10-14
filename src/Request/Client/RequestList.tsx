import { To } from 'history';
import moment from 'moment';
import React from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';

import { Page } from '../../Common/Layout';
import { usePagination } from '../../Common/PageSwitcher';
import { Cell, Pill, Row, Table } from '../../Common/Table';
import * as Api from '../../Utils/Api';
import { Authorized } from '../../Utils/Auth';
import { WithID } from '../../Utils/WithID';
import EditRequestPage from '../EditRequest';
import NewRequestPage from '../NewRequest';
import { idToStr, Request } from '../Request';
import RequestPage from '../RequestPage';
import { statusStyle, statusToStr } from '../Status';

export default function Requests() {
  return (
    <Routes>
      <Route path="" element={<RequestList />} />
      <Route path="new/:requestType" element={<NewRequestPage />} />
      <Route path=":id/edit" element={<EditRequestPage />} />
      <Route path=":id" element={<RequestPage />} />
    </Routes>
  );
}

function RequestTableItem({ request }: { request: WithID<Request> }) {
  return (
    <Row>
      <Cell>
        <Link to={request._id.toString()} className="text-black hover:text-green-700">
          {request.name}
        </Link>
      </Cell>
      <Cell className="font-mono text-gray-700">
        <span className="text-gray-500">#</span>
        {idToStr(request)}
      </Cell>
      <Cell className="text-gray-700">{moment.unix(request.dateCreated).fromNow()}</Cell>
      <Cell>
        <Pill text={statusToStr(request.status)} className={statusStyle(request.status)} />
      </Cell>
    </Row>
  );
}

function RequestList() {
  const { limit, offset } = usePagination(100);
  const { Loader } = Api.useAsyncGetMany<WithID<Request>>('/requests', limit, offset);

  return (
    <Authorized roles={['Client']} otherwise={<Navigate to="/requests" />}>
      <Page title="My requests">
        <div className="mb-8">
          <h2 className="font-medium text-xs text-gray-600 mb-4 mt-8 px-6 uppercase">
            Create new request
          </h2>
          <NewRequestSection />
        </div>
        <Loader>
          {({ values }) => (
            <Table columns={['Name', 'ID number', 'Uploaded', 'Status']}>
              {values.map(r => (
                <RequestTableItem key={r._id} request={r} />
              ))}
            </Table>
          )}
        </Loader>
      </Page>
    </Authorized>
  );
}

function NewRequestSection() {
  const requestTypes: Array<{ title: string; type: string }> = [];
  const req = require.context('../RequestTypes', true, /^.*\.rcfg\.json$/im);
  req.keys().forEach(fileName => {
    const type = fileName.match(/[^/]+(?=\.rcfg)/);
    if (type) {
      requestTypes.push({ title: req(fileName).title, type: type[0] });
    }
  });

  return (
    <div
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(20ch, 1fr))',
        gridAutoRows: '1fr',
      }}
      className="grid gap-5 px-6"
    >
      {requestTypes.map(rt => (
        <NewRequestButton key={rt.title} link={`new/${rt.type}`} name={rt.title} />
      ))}
    </div>
  );
}

function NewRequestButton({ name, link }: { name: string; link: To }) {
  return (
    <Link to={link} className="h-full w-full">
      <div className="h-full w-full relative duration-150 shadow-sm hover:shadow-md rounded-lg bg-white border border-gray-300 p-4 flex flex-col-reverse">
        <span className="lg:mt-10 mt-6 text-lg font-medium">{name}</span>
      </div>
    </Link>
  );
}
