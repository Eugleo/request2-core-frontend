import React from 'react';
import * as Icon from 'react-feather';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import moment from 'moment';
import c from 'classnames';
import AnnouncementPage from './AnnouncementPage';
import * as Api from '../Utils/Api';
import * as Button from '../Common/Buttons';

import { Authentized, Authorized } from '../Utils/Auth';
import Pagination, { usePagination } from '../Common/PageSwitcher';

import Page from '../Page/Page';
import MdRender from '../Common/MdRender';
import NewAnnouncement from './NewAnnouncement';
import EditAnnouncement from './EditAnnouncement';
import { maybe } from '../Utils/Maybe';
import { Announcement } from './Announcement';
import { WithID } from '../Utils/WithID';
import { User } from '../User/User';

export default function AnnouncementRouter() {
  return (
    <Routes>
      <Route path="" element={<AnnouncementList />} />
      <Route path="new" element={<NewAnnouncement />} />
      <Route path=":id/edit" element={<EditAnnouncement />} />
      <Route path=":id" element={<AnnouncementPage />} />
    </Routes>
  );
}

function AnnouncementList() {
  const { limit, offset, currentPage } = usePagination(10);
  const { data: payload, pending, error } = Api.useAsyncGetMany<Announcement>(
    '/announcements',
    limit,
    offset
  );

  if (error) {
    console.log(error);
    return <Navigate to="/404" />;
  }

  if (pending || !payload) {
    return <Page title="Announcements" width="max-w-2xl" />;
  }

  return (
    <Page title="Announcements" width="max-w-2xl">
      <Authentized otherwise={<div>You need to be logged in to view announcements.</div>}>
        <div className="flex flex-col">
          <Authorized roles={['Admin']}>
            <AddAnnButton />
          </Authorized>
          <div className="flex flex-col">
            {payload.values.map(ann => (
              <Item key={ann._id} ann={ann} />
            ))}
          </div>
        </div>
        <Pagination currentPage={currentPage} limit={limit} total={payload.total} />
      </Authentized>
    </Page>
  );
}

function AddAnnButton() {
  return (
    <Link
      to="new"
      className="rounded-lg border-2 border-dashed text-gray-500 border-gray-300 mb-6 py-4 flex justify-center hover:text-gray-400"
    >
      <Icon.Plus className="stroke-2 mr-1" /> Add new announcement
    </Link>
  );
}

function Item({
  ann: { _id, active, title, body, authorId, dateCreated },
}: {
  ann: WithID<Announcement>;
}) {
  const { data: author } = Api.useAsyncGet<User>(maybe(authorId, id => `/users/${id}`));

  return (
    <div className="mb-6 w-full bg-white rounded-lg shadow-sm flex-col">
      <div className="flex px-6 py-3 items-center border-b border-gray-200">
        <div className="flex flex-col not-sr-onlyitems-center">
          <Link
            to={_id.toString()}
            className={c(
              'text-xl font-medium text-black hover:text-green-700',
              active ? 'text-black' : 'text-gray-400'
            )}
          >
            {title}
          </Link>
          <p className={c('text-sm', active ? 'text-gray-500' : 'text-gray-300')}>
            {author && (
              <span>
                Created by <span className="font-medium">{author.name}</span>{' '}
              </span>
            )}
            {moment.unix(dateCreated).fromNow()}
          </p>
        </div>
        <div className="flex-grow" />
        <Authorized roles={['Admin']}>
          <Button.Edit id={_id} />
        </Authorized>
      </div>
      <MdRender
        source={body}
        className={c('px-6 pt-3 pb-1', active ? 'text-gray-700' : 'text-gray-400')}
      />
    </div>
  );
}
