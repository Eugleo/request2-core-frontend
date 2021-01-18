import React from 'react';

import * as Button from '../Common/Buttons';
import { useAuth } from '../Utils/Auth';
import { Announcement } from './Announcement';
import { AnnouncementForm } from './AnnouncementForm';

export function NewAnnouncement(): JSX.Element {
  const { authPost, auth } = useAuth<Announcement>();

  return (
    <AnnouncementForm
      title="New announcement"
      onSubmit={({ body, title }) =>
        authPost('/announcements', {
          active: true,
          authorId: auth.user._id,
          body,
          dateCreated: Math.floor(Date.now() / 1000),
          title,
        })
      }
    >
      <Button.Cancel />
      <span className="flex-grow" />
      <Button.Primary type="submit" title="Create new announcement" status="Normal" />
    </AnnouncementForm>
  );
}
