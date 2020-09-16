import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { useAsyncGet } from '../Utils/Api';
import { useAuth } from '../Utils/Auth';
import { WithID } from '../Utils/WithID';
import { Announcement } from './Announcement';
import AnnouncementForm from './AnnouncementForm';

export default function EditAnnouncement() {
  const { id } = useParams();
  const { authPut } = useAuth<Announcement>();
  const { Loader } = useAsyncGet<WithID<Announcement>>(`/announcements/${id}`);

  return (
    <Loader>
      {ann => (
        <AnnouncementForm
          title={`Editing ${ann.title}`}
          onSubmit={values =>
            authPut(`/announcements/${id}`, {
              ...ann,
              title: values.title.content,
              body: values.body.content,
            })
          }
          ann={ann}
        >
          <Button.Cancel />
          <span className="flex-grow" />
          {ann.active ? <DeactivateButton ann={ann} /> : <ActivateButton ann={ann} />}
          <Button.Primary type="submit" status="Normal" title="Save changes" />
        </AnnouncementForm>
      )}
    </Loader>
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
