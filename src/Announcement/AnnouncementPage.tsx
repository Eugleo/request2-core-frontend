import React from 'react';
import { AtomSpinner } from 'react-epic-spinners';
import { useParams, Navigate } from 'react-router-dom';
import * as Api from '../Utils/Api';
import Page, { CenteredPage } from '../Page/Page';
import MdRender from '../Common/MdRender';
import { maybe } from '../Utils/Maybe';
import { Announcement } from './Announcement';
import { User } from '../User/User';

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
      <CenteredPage title="Loading announcement">
        <div className="flex justify-center">
          <AtomSpinner color="gray" />
        </div>
      </CenteredPage>
    );
  }

  return (
    <Page title={ann.title} width="max-w-2xl">
      <p className="ml-4 text-gray-700 text-sm">
        <span className="font-semibold">{author.name}</span> has updated this item
      </p>
      <MdRender source={ann.body} className="bg-white rounded-md shadow-sm px-6 pt-2 pb-3 mb-12" />
    </Page>
  );
}
