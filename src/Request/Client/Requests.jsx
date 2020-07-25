import React from 'react';
import * as Icon from 'react-feather';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import Page from '../../Page/Page';

import { List } from '../../Common/List';

import * as Api from '../../Utils/Api';
import { usePagination } from '../../Common/PageSwitcher';
import RequestPage from '../RequestPage';
import NewRequestPage from '../NewRequest';
import { Section, EmptyLabel, ListItemWithoutAuthor } from '../RequestElements';
import { comparator } from '../../Utils/Func';
import { statusToString } from '../Status';

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
  const { setTotal, limit, offset } = usePagination(100);
  const { data: payload, error, status } = Api.useLoadResourcesWithLimit(
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

  if (status === 'loading') {
    return <Page title="My requests" width="max-w-4xl" />;
  }

  const makeReq = r => <ListItemWithoutAuthor key={r._id} request={r} to={r._id.toString()} />;

  const inProgress = requests.filter(r => !['Done', 'Deleted'].includes(r.status)).map(makeReq);

  const finished = requests.filter(r => r.status === 'Done').map(makeReq);

  return (
    <Page title="My requests" width="max-w-4xl">
      <NewRequestSection />
      <div className="mb-12">
        <Section title="In progress">
          <List
            elements={inProgress}
            empty={<EmptyLabel text="No requests are being worked on" />}
          />
        </Section>

        <Section title="Finished">
          <List
            elements={finished}
            empty={<EmptyLabel text="No requests have been completed yet" />}
          />
        </Section>
      </div>
    </Page>
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
      style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(13ch, 1fr))',
        gridAutoRows: '1fr',
      }}
      className="grid gap-5 "
    >
      {requestTypes.map(rt => (
        <NewRequestButton key={rt.title} link={`new/${rt.type}`} name={`New ${rt.title}`} />
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

function NewRequestButton({ name, link }) {
  return (
    <Link to={link} className="h-full w-full">
      <div className="h-full w-full duration-150 hover:shadow-lg relative rounded-lg bg-white shadow-md p-4 flex flex-col-reverse">
        <span className="lg:mt-10 mt-6 text-lg">{name}</span>
      </div>
    </Link>
  );
}
