import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Page } from '../Common/Layout';

import { useAuth } from '../Utils/Auth';
import * as Button from '../Common/Buttons';
import { useAsyncGet } from '../Utils/Api';
import AnnouncementForm from './AnnouncementForm';
import { Announcement } from './Announcement';
import { WithID } from '../Utils/WithID';

export default function EditAnnouncement() {
  const { id } = useParams();
  const { authPut } = useAuth<Announcement>();
  const { data: ann, error, pending } = useAsyncGet<Announcement>(`/announcements/${id}`);

  if (error) {
    console.log(error);
    return <Navigate to="/404" />;
  }
  if (pending || !ann) {
    return <Page title="Edit announcement">Waiting for announcements</Page>;
  }

  return (
    <AnnouncementForm
      title={`Editing ${ann.title}`}
      onSubmit={values =>
        authPut(`/announcements/${id}`, { ...ann, title: values.title, body: values.body })
      }
      ann={ann}
    >
      <Button.Cancel />
      <span className="flex-grow" />
      {ann.active ? <DeactivateButton ann={ann} /> : <ActivateButton ann={ann} />}
      <Button.Primary type="submit" status="Normal" title="Save changes" />
    </AnnouncementForm>
  );
}

// TODO Add error handling
function ActivateButton({ ann }: { ann: WithID<Announcement> }) {
  const { authPut } = useAuth<Announcement>();
  const navigate = useNavigate();
  return (
    <Button.Secondary
      title="Reactivate"
      status="Normal"
      onClick={() => {
        authPut(`/announcements/${ann._id}`, { ...ann, active: true })
          .then(() => navigate(-1))
          .catch(console.log);
      }}
      className="mr-2"
    />
  );
}

// TODO Add error handling
function DeactivateButton({ ann }: { ann: WithID<Announcement> }) {
  const { authDel } = useAuth<Announcement>();
  const navigate = useNavigate();
  return (
    <Button.Secondary
      title="Deactivate"
      status="Danger"
      onClick={() => {
        authDel(`/announcements/${ann._id}`)
          .then(() => navigate(-1))
          .catch(console.log);
      }}
      className="mr-2"
    />
  );
}
