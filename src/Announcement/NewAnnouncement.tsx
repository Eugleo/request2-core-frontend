import React from 'react';

import * as Button from '../Common/Buttons';
import { useAuth } from '../Utils/Auth';
import { Announcement } from './Announcement';
import AnnouncementForm from './AnnouncementForm';

export default function NewAnnouncement() {
  const { authPost, auth } = useAuth<Announcement>();

  return (
    <AnnouncementForm
      title="New announcement"
      onSubmit={values =>
        authPost('/announcements', {
          title: values.title.content,
          body: values.body.content,
          authorId: auth.user._id,
          dateCreated: Math.floor(Date.now() / 1000),
          active: true,
        })
      }
    >
      <Button.Cancel />
      <span className="flex-grow" />
      <Button.Primary type="submit" title="Create new announcement" status="Normal" />
    </AnnouncementForm>
  );
}
