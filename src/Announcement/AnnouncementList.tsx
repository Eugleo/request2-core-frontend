import c from 'classnames';
import moment from 'moment';
import React from 'react';
import { Link, Route, Routes, useSearchParams } from 'react-router-dom';
import { defaultTheme } from 'react-select';

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
      <div className="mb-6 flex flex-row items-stretch w-full justify-between">
        <SearchBar
          query={padWithSpace(query)}
          onSubmit={values => {
            setSearchParams({ query: values.query.trim() });
          }}
        />
        <Authorized roles={['Admin']}>
          <Button.Create title="New announcement" />
        </Authorized>
      </div>
      <div>
        <Loader>
          {({ values, total }) => (
            <>
              <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-10">
                {values.map(ann => (
                  <Item key={ann._id} ann={ann} />
                ))}
              </div>
              <Pagination currentPage={currentPage} limit={limit} total={total} />
            </>
          )}
        </Loader>
      </div>
    </Page>
  );
}

export function StatusBadge({ active }: { active: boolean }): JSX.Element {
  return (
    <span
      className={c(
        active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
        'px-2.5 py-0.5 rounded-full inline-flex flex-row items-center'
      )}
    >
      <span
        className={c(
          active ? 'bg-green-500' : 'bg-red-500',
          'relative inline-flex rounded-full h-2 w-2 mr-2'
        )}
      />
      <span className="text-sm font-bold">{active ? 'Active' : 'Archived'}</span>
    </span>
  );
}

function Item({
  ann: { _id, active, title, body, authorId, dateCreated },
}: {
  ann: WithID<Announcement>;
}) {
  const { Loader } = useAsyncGet<WithID<User>>(`/users/${authorId}`);

  const paragraphs = body.split(/\n\w*\n/u);

  let paraText: string;
  switch (paragraphs.length) {
    case 0:
    case 1:
      paraText = 'This is the whole announcement';
      break;
    case 2:
      paraText = '1 more paragraph inside';
      break;
    default:
      paraText = `${paragraphs.length - 1} more paragraphs inside`;
  }

  return (
    <Link to={_id.toString()}>
      <div className="rounded-xl transition-all duration-150 group">
        <StatusBadge active={active} />
        <h2 className="text-2xl font-bold mb-4 mt-4 group-hover:text-indigo-800 transition-all group-hover:underline">
          {title}
        </h2>

        <Markdown
          source={paragraphs.length > 0 ? paragraphs[0] : '_No textual content_'}
          className={c('text-gray-800 mb-4')}
        />

        <Loader>
          {data => (
            <div className={c('text-sm text-gray-800')}>
              <p className="text-black font-medium">{data.name}</p>
              <p>
                {moment.unix(dateCreated).fromNow()} · {paraText}
              </p>
            </div>
          )}
        </Loader>
      </div>
    </Link>
  );
}

{
  /* <Authorized roles={['Admin']}>
  <Button.Edit link={`/announcements/${_id}/edit`} />
</Authorized>; */
}
