import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Page from '../../Page/Page';

import { List } from '../../Common/List';
import { useAuth } from '../../Utils/Auth';

import { usePagination } from '../../Common/PageSwitcher';

import * as Api from '../../Utils/Api';
import RequestPage from '../RequestPage';
import { EmptyLabel, Section, ListItem } from '../RequestElements';

export default function Requests() {
  return (
    <Routes>
      <Route path="" element={<RequestList />} />
      <Route path=":id" element={<RequestPage />} />
    </Routes>
  );
}

function RequestList() {
  const [requests, setRequests] = useState([]);
  const { authGet, auth } = useAuth();

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

  const assigned = requests
    .filter(r => r.status !== 'Done' && r.assigneeId === auth.userId)
    .map(r => <ListItem key={r._id} request={r} link={`/requests/${r._id}`} />);

  const finished = requests
    .filter(r => r.status === 'Done' && r.assigneeId === auth.userId)
    .map(r => <ListItem key={r._id} request={r} link={`/requests/${r._id}`} />);

  const unattended = requests
    .filter(r => r.status !== 'Done' && !r.assigneeId)
    .map(r => <ListItem key={r._id} request={r} link={`/requests/${r._id}`} />);

  return (
    <Page title="Client's Requests" width="max-w-4xl">
      <div className="mb-12">
        <Section title="Assigned to me">
          {assigned.length > 0 ? (
            <List>{assigned}</List>
          ) : (
            <EmptyLabel text="Yay! No more requests to solve" />
          )}
        </Section>
        <Section title="Unattended">
          {unattended.length > 0 ? (
            <List>{unattended}</List>
          ) : (
            <EmptyLabel text="All of the requests have an assigned operator" />
          )}
        </Section>

        <Section title="Finished">
          {finished.length > 0 ? (
            <List>{finished}</List>
          ) : (
            <EmptyLabel text="No requests have been finished yet" />
          )}
        </Section>
      </div>
    </Page>
  );
}
