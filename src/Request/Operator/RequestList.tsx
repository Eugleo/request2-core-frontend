import moment from 'moment';
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';

import { Secondary } from '../../Common/Buttons';
import { useQuery } from '../../Common/Hooks';
import { Page } from '../../Common/Layout';
import { usePagination } from '../../Common/PageSwitcher';
import { Pill, RequestStatusPill } from '../../Common/Pills';
import { SearchBar } from '../../Common/SearchBar';
import { Cell, Row, Table } from '../../Common/Table';
import { User, UserName } from '../../User/User';
import { LinkToProfile } from '../../User/UserProfile';
import * as Api from '../../Utils/Api';
import { padWithSpace } from '../../Utils/Func';
import { ok } from '../../Utils/Loader';
import { WithID } from '../../Utils/WithID';
import { EditRequestPage } from '../EditRequest';
import { idToStr, Request } from '../Request';
import { RequestPage } from '../RequestPage';

export function Requests(): JSX.Element {
  return (
    <Routes>
      <Route path="" element={<RequestList />} />
      <Route path=":id" element={<RequestPage />} />
      <Route path=":id/edit" element={<EditRequestPage />} />
    </Routes>
  );
}

function RequestTableItem({ request }: { request: WithID<Request> }) {
  const { type, code } = idToStr(request);

  return (
    <Row>
      <Cell>
        <Link
          to={request._id.toString()}
          className="text-black hover:text-indigo-700 w-full inline-block"
        >
          {request.title}
        </Link>
      </Cell>
      <Cell className="text-gray-700 font-mono">
        <span className="text-gray-500">{type}/</span>
        {code}
      </Cell>
      <Cell>
        <LinkToProfile userId={request.authorId} className="text-gray-700 font-medium" />
      </Cell>
      <Cell className="text-gray-700">{moment.unix(request.dateCreated).fromNow()}</Cell>
      <Cell>
        <RequestStatusPill status={request.status} />
      </Cell>
    </Row>
  );
}

function RequestList() {
  const { limit, offset } = usePagination(10);
  const [query, setQuery] = useQuery('-status:deleted');
  const { Loader } = Api.useAsyncGet<{ values: WithID<Request>[]; total: number }>(
    Api.urlWithParams('/requests', { limit, offset, query })
  );

  return (
    <Page title="Clients' requests">
      <div className="mb-6 flex flex-row items-stretch w-full justify-between">
        <SearchBar
          query={padWithSpace(query)}
          onSubmit={values => {
            setQuery(values.query.trim());
          }}
        />
      </div>
      <Loader>
        {({ values }) => (
          <Table columns={['Name', 'ID code', 'Author', 'Created', 'Status']}>
            {values.map(v => (
              <RequestTableItem key={v._id} request={v} />
            ))}
          </Table>
        )}
      </Loader>
    </Page>
  );
}
