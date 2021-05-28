import c from 'classnames';
import moment from 'moment';
import React from 'react';
import { Link, Route, Routes, useSearchParams } from 'react-router-dom';
import { defaultTheme } from 'react-select';

import * as Button from '../Common/Buttons';
import { Card, Page } from '../Common/Layout';
import { Markdown } from '../Common/MdRender';
import { usePagination, Pagination } from '../Common/PageSwitcher';
import { ActivityPill, PillWithIndicator } from '../Common/Pills';
import { SearchBar } from '../Common/SearchBar';
import { User, UserName } from '../User/User';
import { LinkToProfile } from '../User/UserProfile';
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
              <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-6">
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

function Item({
  ann: { _id, active, title, body, authorId, dateCreated },
}: {
  ann: WithID<Announcement>;
}) {
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
    <div className="rounded-xl transition-all duration-150">
      <Link to={_id.toString()} className="group">
        <ActivityPill active={active} />
        <h2 className="text-2xl font-bold mb-4 mt-4 transition-all group-hover:underline">
          {title}
        </h2>

        <Markdown
          source={paragraphs.length > 0 ? paragraphs[0] : '_No textual content_'}
          className={c('text-gray-700 mb-4')}
        />
      </Link>

      <div className={c('text-sm text-gray-600')}>
        <LinkToProfile userId={authorId} />
        <p>
          {moment.unix(dateCreated).fromNow()} · {paraText}
        </p>
      </div>
    </div>
  );
}

{
  /* <Authorized roles={['Admin']}>
  <Button.Edit link={`/announcements/${_id}/edit`} />
</Authorized>; */
}
