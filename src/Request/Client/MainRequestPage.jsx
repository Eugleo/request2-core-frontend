import React from 'react';
import * as Icon from 'react-feather';
import { Link } from 'react-router-dom';
import Page from '../../Page/Page';

import { List, ItemContainer, LinkedItemTitle } from '../../Common/List';
import formatDate from '../../Utils/Date';

const requests = [
  {
    _id: 1,
    publicId: 'MK0019123',
    authorId: 2,
    teamId: 2,
    status: 'WIP',
    type: 'Proteomics',
    name: 'Human enzyme EC:1.0.4.5',
    dateCreated: 1444440000,
    active: true,
  },
  {
    _id: 2,
    publicId: 'MK0019119',
    authorId: 2,
    teamId: 2,
    status: 'WIP',
    type: 'Proteomics',
    name: 'Human enzyme EC:1.1.1.1',
    dateCreated: 144449000,
    active: true,
  },
  {
    _id: 3,
    publicId: 'MK0019131',
    authorId: 2,
    teamId: 2,
    status: 'Requested',
    type: 'Small molecule',
    name: 'Mouse enzyme EC:4.4.1.0',
    dateCreated: 1944990000,
    active: true,
  },
  {
    _id: 4,
    publicId: 'MK0019131',
    authorId: 2,
    teamId: 2,
    status: 'Done',
    type: 'Lipidomics',
    name: 'Mouse sphingophospholipid',
    dateCreated: 1644990000,
    active: true,
  },
].sort((r1, r2) => {
  if (r1.dateCreated < r2.dateCreated) {
    return -1;
  }
  if (r1.dateCreated === r2.dateCreated) {
    return 0;
  }
  return 1;
});

export default function MainRequestPage() {
  return (
    <Page title="Your requests" width="max-w-4xl">
      <NewRequestSection />
      <div>
        <Section title="In progress">
          <List>
            {requests
              .filter(r => r.status === 'WIP' || r.status === 'Requested')
              .map(r => (
                <Item key={r._id} request={r} link={`/requests/${r._id}`} />
              ))}
          </List>
        </Section>

        <Section title="Done">
          <List>
            {requests
              .filter(r => r.status === 'Done')
              .map(r => (
                <Item key={r._id} request={r} link={`/requests/${r._id}`} />
              ))}
          </List>
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

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 mt-8">{title}</h2>
      {children}
    </div>
  );
}

function SquareItem({ name, link }) {
  return (
    <Link to={link}>
      <div className="duration-150 hover:shadow-lg relative rounded-lg bg-white shadow-md p-4 flex flex-col-reverse">
        <span className="lg:mt-10 mt-6 text-lg">{name}</span>
      </div>
    </Link>
  );
}

function Item({ request: { publicId, status, name, dateCreated }, link }) {
  return (
    <ItemContainer>
      <div className="flex flex-col col-span-5">
        <LinkedItemTitle link={link} title={name} />
        <span className="text-xs text-gray-600">#{publicId}</span>
      </div>
      <span className="text-sm text-gray-700 col-span-2">{formatDate(dateCreated)}</span>

      <div className="col-span-3 flex-row-reverse flex">
        <StatusLabel status={status} />
      </div>
    </ItemContainer>
  );
}

function StatusLabel({ status }) {
  if (status === 'Done') {
    return (
      <div className="bg-green-200 py-2 px-4 rounded-full text-xs text-green-700">Show results</div>
    );
  }
  if (status === 'WIP') {
    return (
      <div className="bg-yellow-200 py-2 px-4 rounded-full text-xs text-yellow-700">
        In progress
      </div>
    );
  }
  if (status === 'Requested') {
    return (
      <div className="bg-gray-200 py-2 px-4 rounded-full text-xs text-gray-700">Requested</div>
    );
  }
}
