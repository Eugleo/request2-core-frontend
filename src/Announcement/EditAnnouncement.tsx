import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { useAsyncGet } from '../Utils/Api';
import { useAuth } from '../Utils/Auth';
import { WithID } from '../Utils/WithID';
import { Announcement } from './Announcement';
import { AnnouncementForm } from './AnnouncementForm';

export function EditAnnouncement(): JSX.Element {
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
              body: values.body.content,
              title: values.title.content,
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
      onClick={async () => {
        await authPut(`/announcements/${ann._id}`, { ...ann, active: true });
        navigate(-1);
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
      onClick={async () => {
        await authDel(`/announcements/${ann._id}`);
        navigate(-1);
      }}
      className="mr-2"
    />
  );
}
