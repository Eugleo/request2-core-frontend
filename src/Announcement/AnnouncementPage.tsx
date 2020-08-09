import React from 'react';
import { AtomSpinner } from 'react-epic-spinners';
import { Navigate, useParams } from 'react-router-dom';

import { Page } from '../Common/Layout';
import Markdown from '../Common/MdRender';
import { User } from '../User/User';
import * as Api from '../Utils/Api';
import { maybe } from '../Utils/Maybe';
import { Announcement } from './Announcement';

export default function AnnouncementPage() {
  const { id } = useParams();
  const { data: ann, error, pending } = Api.useAsyncGet<Announcement>(`/announcements/${id}`);
  const { data: author } = Api.useAsyncGet<User>(maybe(ann, a => `/users/${a.authorId}`));

  if (error) {
    console.log(error);
    return <Navigate to="/404" />;
  }

  if (pending || !ann || !author) {
    return (
      <Page title="Loading announcement">
        <div className="flex justify-center">
          <AtomSpinner color="gray" />
        </div>
      </Page>
    );
  }

  return (
    <Page title={ann.title}>
      <p className="ml-4 text-gray-700 text-sm">
        <span className="font-semibold">{author.name}</span> has updated this item
      </p>
      <Markdown source={ann.body} className="bg-white rounded-md shadow-sm px-6 pt-2 pb-3 mb-12" />
    </Page>
  );
}
