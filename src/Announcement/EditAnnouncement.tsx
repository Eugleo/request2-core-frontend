import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { Page } from '../Common/Layout';
import { useAsyncGet } from '../Utils/Api';
import { useAuth } from '../Utils/Auth';
import { WithID } from '../Utils/WithID';
import { Announcement } from './Announcement';
import AnnouncementForm from './AnnouncementForm';

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
