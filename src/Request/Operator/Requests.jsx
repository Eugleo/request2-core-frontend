import React from 'react';
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

function compareRequests(r1, r2) {
  if (r1.dateCreated < r2.dateCreated) {
    return -1;
  }
  if (r1.dateCreated === r2.dateCreated) {
    return 0;
  }
  return 1;
}

function RequestList() {
  const { auth } = useAuth();
  const { sTot, lim, off } = usePagination(100);
  const requests = Api.useGetWitLimit('/requests', lim, off, sTot, v => v.sort(compareRequests));

  const makeReq = r => <ListItem key={r._id} request={r} to={r._id.toString()} />;

  const assigned = requests
    .filter(r => r.status !== 'Done' && r.assigneeId === auth.userId)
    .map(makeReq);

  const finished = requests
    .filter(r => r.status === 'Done' && r.assigneeId === auth.userId)
    .map(makeReq);

  const unattended = requests.filter(r => r.status !== 'Done' && !r.assigneeId).map(makeReq);

  return (
    <Page title="Client's Requests" width="max-w-4xl">
      <div className="mb-12">
        <Section title="Assigned to me">
          <List
            elements={assigned}
            empty={<EmptyLabel text="Yay! No more requests to solve" />}
          ></List>
        </Section>
        <Section title="Unattended">
          <List
            elements={unattended}
            empty={<EmptyLabel text="All of the requests have an assigned operator" />}
          />
        </Section>

        <Section title="Finished">
          <List
            elements={finished}
            empty={<EmptyLabel text="No requests have been finished yet" />}
          ></List>
        </Section>
      </div>
    </Page>
  );
}
