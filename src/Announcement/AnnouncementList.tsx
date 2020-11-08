import c from 'classnames';
import moment from 'moment';
import React from 'react';
import { Link, Route, Routes, useSearchParams } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { Card, Page } from '../Common/Layout';
import { Markdown } from '../Common/MdRender';
import { usePagination, Pagination } from '../Common/PageSwitcher';
import { SearchBar } from '../Common/SearchBar';
import { User } from '../User/User';
import { useAsyncGetMany, useAsyncGet, urlWithParams } from '../Utils/Api';
import { Authorized } from '../Utils/Auth';
import { padWithSpace } from '../Utils/Func';
import { WithID } from '../Utils/WithID';
import { Announcement } from './Announcement';
import { AnnouncementPage } from './AnnouncementPage';
import { EditAnnouncement } from './EditAnnouncement';
import { NewAnnouncement } from './NewAnnouncement';

export function AnnouncementRouter(): JSX.Element {
  return (
    <Routes>
      <Route path="" element={<AnnouncementList />} />
      <Route path="new" element={<NewAnnouncement />} />
      <Route path=":id/edit" element={<EditAnnouncement />} />
      <Route path=":id" element={<AnnouncementPage />} />
    </Routes>
  );
}

function AnnouncementList() {
  const { limit, offset, currentPage } = usePagination(10);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') ?? 'active:true';
  const { Loader } = useAsyncGet<{ values: WithID<Announcement>[]; total: number }>(
    urlWithParams('/announcements', { limit, offset, query })
  );

  return (
    <Page title="Announcements">
      <div className="px-6 mb-6 flex flex-row items-stretch w-full justify-between">
        <SearchBar
          query={padWithSpace(query)}
          onSubmit={values => setSearchParams({ query: values.query.content.trim() })}
        />
        <Authorized roles={['Admin']}>
          <Button.Create title="New announcement" />
        </Authorized>
      </div>
      <div className="flex flex-col">
        <Loader>
          {({ values, total }) => (
            <>
              {values.map(ann => (
                <Item key={ann._id} ann={ann} />
              ))}
              <Pagination currentPage={currentPage} limit={limit} total={total} />
            </>
          )}
        </Loader>
      </div>
    </Page>
  );
}

function Item({
  ann: { _id, active, title, body, authorId, dateCreated },
}: {
  ann: WithID<Announcement>;
}) {
  const { Loader } = useAsyncGet<WithID<User>>(`/users/${authorId}`);

  return (
    <Card className="mb-6">
      <div className="flex px-6 py-3 items-center border-b border-gray-200">
        <div className="flex flex-col not-sr-onlyitems-center">
          <Link
            to={_id.toString()}
            className={c(
              'text-xl font-medium text-black hover:text-green-700',
              active ? 'text-black' : 'text-gray-400'
            )}
          >
            {title}
          </Link>
          <Loader>
            {data => (
              <p className={c('text-sm', active ? 'text-gray-500' : 'text-gray-300')}>
                <span>
                  Created by <span className="font-medium">{data.name}</span>{' '}
                </span>
                {moment.unix(dateCreated).fromNow()}
              </p>
            )}
          </Loader>
        </div>
        <div className="flex-grow" />
        <Authorized roles={['Admin']}>
          <Button.Edit link={`/announcements/${_id}/edit`} />
        </Authorized>
      </div>
      <Markdown
        source={body}
        className={c('px-6 pt-3 pb-1', active ? 'text-gray-700' : 'text-gray-400')}
      />
    </Card>
  );
}
