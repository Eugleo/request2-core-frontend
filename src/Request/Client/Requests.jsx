import React, { useState, useEffect } from 'react';
import * as Icon from 'react-feather';
import { Link, Routes, Route } from 'react-router-dom';
import Page from '../../Page/Page';

import { List } from '../../Common/List';

import { useAuth } from '../../Utils/Auth';
import * as Api from '../../Utils/Api';
import { usePagination } from '../../Common/PageSwitcher';
import RequestPage from '../RequestPage';
import NewRequestPage from '../NewRequest';
import { Section, ListItem } from '../RequestElements';

export default function Requests() {
  return (
    <Routes>
      <Route path="" element={<RequestList />} />
      <Route path="new/:requestType" element={<NewRequestPage />} />
      <Route path=":id" element={<RequestPage />} />
    </Routes>
  );
}

function RequestList() {
  const [requests, setRequests] = useState([]);
  const { authGet } = useAuth();

  const { setTotal, limit, offset } = usePagination(100);

  useEffect(() => {
    const url = Api.urlWithParams('/requests', { limit, offset });
    authGet(url)
      .then(r => {
        if (r.ok) {
          return r.json();
        }
        throw new Error('Unable to retrieve the requests');
      })
      .then(json => {
        setTotal(json.total);
        setRequests(
          json.values.sort((r1, r2) => {
            if (r1.dateCreated < r2.dateCreated) {
              return -1;
            }
            if (r1.dateCreated === r2.dateCreated) {
              return 0;
            }
            return 1;
          })
        );
      })
      .catch(console.log);
  }, [authGet, setTotal, limit, offset]);

  const inProgress = requests
    .filter(r => r.status === 'WIP' || r.status === 'Requested')
    .map(r => <ListItem key={r._id} request={r} link={`/requests/${r._id}`} />);

  const finished = requests
    .filter(r => r.status === 'Done')
    .map(r => <ListItem key={r._id} request={r} link={`/requests/${r._id}`} />);

  return (
    <Page title="My requests" width="max-w-4xl">
      <NewRequestSection />
      <div className="mb-12">
        <Section title="In progress">
          {inProgress.length > 0 ? (
            <List>{inProgress}</List>
          ) : (
            <EmptyLabel text="No requests are being worked on" />
          )}
        </Section>

        <Section title="Finished">
          {finished.length > 0 ? (
            <List>{finished}</List>
          ) : (
            <EmptyLabel text="No requests have been completed yet" />
          )}
        </Section>
      </div>
    </Page>
  );
}

function EmptyLabel({ text }) {
  return (
    <div className="flex flex-col justify-center  rounded-md border-dashed border-2 border-gray-500 h-32 text-center text-lg text-gray-500">
      {text}
    </div>
  );
}

function NewRequestSection() {
  const requestTypes = [];
  const req = require.context('../RequestTypes', true, /^.*\.rcfg\.json$/im);
  req.keys().forEach(fileName => {
    requestTypes.push({ title: req(fileName).title, type: fileName.match(/[^/]+(?=\.rcfg)/)[0] });
  });

  return (
    <div
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr));', gridAutoRows: '1fr' }}
      className="grid grid-cols-3 lg:grid-cols-4 gap-5"
    >
      {requestTypes.map(rt => (
        <SquareItem key={rt.title} link={`/requests/new/${rt.type}`} name={`New ${rt.title}`} />
      ))}
      <div className="cursor-pointer duration-150 p-4 rounded-lg hover:bg-gray-200 flex justify-center items-center flex-col">
        <div className="bg-gray-300 rounded-full w-12 h-12 p-3 mb-2 flex items-center justify-center">
          <Icon.Copy className="text-gray-700" />
        </div>
        <div className="text-sm text-gray-700">Copy existing</div>
      </div>
    </div>
  );
}

function SquareItem({ name, link }) {
  return (
    <Link to={link} className="flex">
      <div className="duration-150 hover:shadow-lg relative rounded-lg bg-white shadow-md p-4 flex flex-col-reverse">
        <span className="lg:mt-10 mt-6 text-lg">{name}</span>
      </div>
    </Link>
  );
}
