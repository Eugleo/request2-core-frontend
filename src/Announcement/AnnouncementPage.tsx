import moment from 'moment';
import { useParams } from 'react-router-dom';

import { SecondaryLinked } from '../Common/Buttons';
import * as Page from '../Common/Layout';
import { Markdown } from '../Common/MdRender';
import { User, UserName } from '../User/User';
import * as Api from '../Utils/Api';
import { Authorized } from '../Utils/Auth';
import { WithID } from '../Utils/WithID';
import { Announcement } from './Announcement';
import { StatusBadge } from './AnnouncementList';

export function AnnouncementPage(): JSX.Element {
  const { id } = useParams();
  const { Loader } = Api.useAsyncGet<WithID<Announcement>>(`/announcements/${id}`);

  return (
    <Loader>
      {ann => (
        <Page.ContentWrapper>
          <div className="max-w-2xl w-full mx-auto">
            <div className="py-8">
              <div className="flex flex-row space-between items-center mb-2">
                <Page.Title className="mr-6">{ann.title}</Page.Title>
                <StatusBadge active={ann.active} />
                <Page.Spacer />
                <Authorized roles={['Admin']}>
                  <SecondaryLinked to={`/announcements/${ann._id}/edit`} title="Edit" />
                </Authorized>
              </div>
              <Author ann={ann} />
            </div>

            <Page.Body>
              <Markdown
                source={ann.body}
                className="bg-white rounded-md shadow-sm px-6 pt-6 pb-4 mb-12"
              />
            </Page.Body>
          </div>
        </Page.ContentWrapper>
      )}
    </Loader>
  );
}

function Author({ ann }: { ann: WithID<Announcement> }) {
  const { Loader } = Api.useAsyncGet<UserName>(`/users/${ann.authorId}/name`);
  return (
    <Loader>
      {author => (
        <p className="text-gray-700 text-sm">
          <span className="font-semibold">{author.name}</span> ·{' '}
          {moment.unix(ann.dateCreated).fromNow()}
        </p>
      )}
    </Loader>
  );
}
