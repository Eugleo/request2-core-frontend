import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Page from '../../Page/Page';

import { List } from '../../Common/List';
import { useAuth } from '../../Utils/Auth';

import { usePagination } from '../../Common/PageSwitcher';

import * as Api from '../../Utils/Api';
import RequestPage from '../RequestPage';
import { EmptyLabel, Section, ListItem } from '../RequestElements';
import { comparator } from '../../Utils/Func';

import { statusToString } from '../Status';
import EditRequestPage from '../Client/EditRequest';

export default function Requests() {
  return (
    <Routes>
      <Route path="" element={<RequestList />} />
      <Route path=":id" element={<RequestPage />} />
      <Route path=":id/edit" element={<EditRequestPage />} />
    </Routes>
  );
}

function RequestList() {
  const { auth } = useAuth();
  const { setTotal, limit, offset } = usePagination(100);
  const { data: payload, error, pending } = Api.useLoadResourcesWithLimit(
    '/requests',
    limit,
    offset,
    setTotal,
    v => v.sort(comparator(r => r.dateCreated))
  );
  const requests = payload && payload.values.map(r => ({ ...r, status: statusToString(r.status) }));

  if (error) {
    console.log(error);
    return <Navigate to="/404" />;
  }

  if (pending) {
    return <Page title="Client's Requests" width="max-w-4xl" />;
  }

  const makeReq = r => <ListItem key={r._id} request={r} to={r._id.toString()} />;

  const inProgress = requests.filter(r => r.status !== 'Done').map(makeReq);

  const finished = requests.filter(r => r.status === 'Done').map(makeReq);

  return (
    <Page title="Client's Requests" width="max-w-4xl">
      <div className="mb-12">
        <Section title="In progress">
          <List
            elements={inProgress}
            empty={<EmptyLabel text="Yay! No more requests to solve" />}
          />
        </Section>

        <Section title="Finished">
          <List
            elements={finished}
            empty={<EmptyLabel text="No requests have been finished yet" />}
          />
        </Section>
      </div>
    </Page>
  );
}
