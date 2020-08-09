import React from 'react';
import moment from 'moment';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import { To } from 'history';
import { Page, SidebarWrapper } from '../../Common/Layout';
import Table from '../../Common/Table';

import * as Api from '../../Utils/Api';
import { usePagination } from '../../Common/PageSwitcher';
import RequestPage from '../RequestPage';
import NewRequestPage from '../NewRequest';
import { Section, StatusLabel } from '../RequestElements';
import { comparator } from '../../Utils/Func';
import EditRequestPage from '../EditRequest';
import { Request, idToStr } from '../Request';
import { WithID } from '../../Utils/WithID';
import SearchSidebar from '../../Common/SearchSidebar';

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

function requestFields(request: WithID<Request>) {
  return [
    <Link to={request._id.toString()} className="text-md font text-black hover:text-green-700">
      {request.name}
    </Link>,
    <span className="text-gray-700">
      <span className="text-gray-500">#</span>
      {idToStr(request)}
    </span>,
    <span className="text-gray-700">{moment.unix(request.dateCreated).fromNow()}</span>,
    <StatusLabel status={request.status} />,
  ];
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
    return <Page title="My requests">Loading requests</Page>;
  }

  return (
    <SidebarWrapper>
      <SearchSidebar />
      <Page title="Home">
        <Section title="Create new request">
          <NewRequestSection />
        </Section>
        <Section title="My requests">
          <Table
            columns={['Name', 'ID number', 'Uploaded', 'Status']}
            source={payload.values}
            getRow={requestFields}
          />
        </Section>
      </Page>
    </SidebarWrapper>
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
      className="grid gap-5"
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
      <div className="h-full w-full relative duration-150 shadow-sm hover:shadow-lg rounded-lg bg-white border-gray-300 p-4 flex flex-col-reverse">
        <span className="lg:mt-10 mt-6 text-lg font-medium">{name}</span>
      </div>
    </Link>
  );
}
