import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { AtomSpinner } from 'react-epic-spinners';
import { Link, useParams } from 'react-router-dom';
import * as Api from '../Utils/Api';
import * as Button from '../Common/Buttons';

import { Authentized, Authorized, useAuth } from '../Utils/Auth';
import Pagination, { usePagination } from '../Common/PageSwitcher';

import Page, { CenteredPage } from '../Page/Page';
import MdRender from '../Common/MdRender';

import formatDate from '../Utils/Date';

export function Announcements() {
  const [anns, setAnns] = useState([]);
  const { authGet } = useAuth();

  const { setTotal, limit, offset, currentPage, pages } = usePagination(10);

  useEffect(() => {
    const url = Api.urlWithParams('/announcements', { limit, offset });
    authGet(url)
      .then(r => {
        if (r.ok) {
          return r.json();
        }
        throw new Error('Unable to retrieve the announcements');
      })
      .then(json => {
        setTotal(json.total);
        setAnns(json.values);
      })
      .catch(console.log);
  }, [authGet, setTotal, limit, offset]);

  return (
    <Page title="Announcements" width="max-w-2xl">
      <Authentized or={<div>You need to be logged in to view announcements.</div>}>
        <div className="flex flex-col">
          <Authorized roles={['Admin']}>
            <AddAnnButton />
          </Authorized>
          <div className="flex flex-col">
            {anns.map(ann => (
              <AnnouncementCard key={ann._id} ann={ann} />
            ))}
          </div>
        </div>
        <Pagination currentPage={currentPage} pages={pages} />
      </Authentized>
    </Page>
  );
}

function AddAnnButton() {
  return (
    <Link
      to="/announcements/new"
      className="rounded-lg border-2 border-dashed text-gray-500 border-gray-300 mb-6 py-4 flex justify-center hover:text-gray-400"
    >
      <Icon.Plus className="stroke-2 mr-1" /> Add new announcement
    </Link>
  );
}

function AnnouncementCard({ ann: { _id, active, title, body, dateCreated } }) {
  return (
    <div className="mb-6 w-full bg-white rounded-lg shadow-sm flex-col">
      <div className="flex px-6 py-3 items-center border-b border-gray-200">
        <div className="flex flex-col not-sr-onlyitems-center">
          <Link
            to={`announcements/${_id}`}
            className={`text-xl font-medium text-black hover:text-green-700 ${
              active ? 'text-black' : 'text-gray-400'
            }`}
          >
            {title}
          </Link>
          <p className={`text-sm ${active ? 'text-gray-500' : 'text-gray-300'}`}>
            {formatDate(dateCreated)}
          </p>
        </div>
        <div className="flex-grow" />
        <Authorized roles={['Admin']}>
          <Button.NormalLinked to={`announcements/${_id}/edit`} classNames={['pl-2', 'pr-3']}>
            <Icon.Edit3 className="mr-1 text-gray-700 h-4 stroke-2" />
            Edit
          </Button.NormalLinked>
        </Authorized>
      </div>
      <MdRender
        source={body}
        className={`px-6 pt-3 pb-1 ${active ? 'text-gray-800' : 'text-gray-400'}`}
      />
    </div>
  );
}

export function AnnouncementFromUrl() {
  const { id } = useParams();
  const [ann, setAnn] = useState(null);
  const { authGet } = useAuth();

  useEffect(() => {
    authGet(`/announcements/${id}`)
      .then(r => {
        if (r.ok) {
          return r.json();
        }
        throw Error(`Can't retreieve announcement with ID ${id}`);
      })
      .then(js => setAnn(js.data))
      .catch(err => console.log(err));
  }, [id, authGet]);

  if (ann === null) {
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
      <MdRender source={ann.body} className="bg-white rounded-md shadow-sm px-6 pt-5 pb-3" />
    </Page>
  );
}
