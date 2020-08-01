import React from 'react';
import * as Button from '../Common/Buttons';
import { useAuth } from '../Utils/Auth';
import AnnouncementForm from './AnnouncementForm';
import { Announcement } from './Announcement';

export default function NewAnnouncement() {
  const { authPost, auth } = useAuth<Announcement>();

  return (
    <AnnouncementForm
      title="New announcement"
      onSubmit={values =>
        authPost('/announcements', {
          title: values.title,
          body: values.body,
          authorId: auth.user.userId,
          dateCreated: Math.floor(Date.now() / 1000),
          active: true,
        })
      }
    >
      <Button.Cancel />
      <span className="flex-grow" />
      <Button.PrimarySubmit title="Create new announcement" />
    </AnnouncementForm>
  );
}
