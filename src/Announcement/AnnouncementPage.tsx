import React from 'react';
import { useParams } from 'react-router-dom';

import { Page } from '../Common/Layout';
import Markdown from '../Common/MdRender';
import { User } from '../User/User';
import * as Api from '../Utils/Api';
import { WithID } from '../Utils/WithID';
import { Announcement } from './Announcement';

export default function AnnouncementPage() {
  const { id } = useParams();
  const { Loader } = Api.useAsyncGet<WithID<Announcement>>(`/announcements/${id}`);

  return (
    <Loader>
      {ann => (
        <Page title={ann.title}>
          <Author id={ann._id} />
          <Markdown
            source={ann.body}
            className="bg-white rounded-md shadow-sm px-6 pt-2 pb-3 mb-12"
          />
        </Page>
      )}
    </Loader>
  );
}

function Author({ id }: { id: number }) {
  const { Loader } = Api.useAsyncGet<WithID<User>>(`/users/${id}`);
  return (
    <Loader>
      {author => (
        <p className="ml-4 text-gray-700 text-sm">
          <span className="font-semibold">{author.name}</span> has updated this item
        </p>
      )}
    </Loader>
  );
}
