import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AtomSpinner } from 'react-epic-spinners';
import { useAuth } from '../../Utils/Auth';
import Page, { CenteredPage } from '../../Page/Page';

export default function RequestPage() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const { authGet } = useAuth();

  useEffect(() => {
    authGet(`/requests/${id}`)
      .then(r => {
        if (r.ok) {
          return r.json();
        }
        throw Error(`Can't retreieve announcement with ID ${id}`);
      })
      .then(js => setRequest(js.data))
      .catch(err => console.log(err));
  }, [id, authGet]);

  if (request === null) {
    return (
      <CenteredPage title="Loading the request">
        <div className="flex justify-center">
          <AtomSpinner color="gray" />
        </div>
      </CenteredPage>
    );
  }

  return <Page title={request.name} />;
}
