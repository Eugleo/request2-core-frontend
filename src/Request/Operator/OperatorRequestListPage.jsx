import React, { useState, useEffect } from 'react';
import Page from '../../Page/Page';

import { List, ItemContainer, LinkedItemTitle } from '../../Common/List';
import formatDate from '../../Utils/Date';
import { useAuth } from '../../Utils/Auth';

import { usePagination } from '../../Common/PageSwitcher';

import * as Api from '../../Utils/Api';

export default function OperatorRequestListPage() {
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
    .map(r => <Item key={r._id} request={r} link={`/requests/${r._id}`} />);

  const finished = requests
    .filter(r => r.status === 'Done' && r.assigneeId === auth.userId)
    .map(r => <Item key={r._id} request={r} link={`/requests/${r._id}`} />);

  const unattended = requests
    .filter(r => r.status !== 'Done' && !r.assigneeId)
    .map(r => <Item key={r._id} request={r} link={`/requests/${r._id}`} />);

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

function EmptyLabel({ text }) {
  return (
    <div className="flex flex-col justify-center  rounded-md border-dashed border-2 border-gray-500 h-32 text-center text-lg text-gray-500">
      {text}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 mt-8">{title}</h2>
      {children}
    </div>
  );
}

function Item({ request: { code, name, dateCreated }, link }) {
  return (
    <ItemContainer>
      <div className="flex flex-col col-span-9">
        <LinkedItemTitle link={link} title={name} />
        <span className="text-xs text-gray-600">#{code}</span>
      </div>
      <span className="text-sm text-gray-700 col-span-1">{formatDate(dateCreated)}</span>
    </ItemContainer>
  );
}
