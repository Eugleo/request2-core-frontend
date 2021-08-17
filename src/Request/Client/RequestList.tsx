import { To } from 'history';
import moment from 'moment';
import { Info, Plus } from 'react-feather';
import { Link, Navigate, Route, Routes, useSearchParams } from 'react-router-dom';
import { isContext } from 'vm';

import { Note } from '../../Common/Form/Question';
import { Page } from '../../Common/Layout';
import { usePagination } from '../../Common/PageSwitcher';
import { Pill, RequestStatusPill } from '../../Common/Pills';
import { SearchBar } from '../../Common/SearchBar';
import { Cell, Row, Table } from '../../Common/Table';
import * as Api from '../../Utils/Api';
import { Authorized, useAuth } from '../../Utils/Auth';
import { padWithSpace } from '../../Utils/Func';
import { Maybe } from '../../Utils/Maybe';
import { WithID } from '../../Utils/WithID';
import { EditRequestPage } from '../EditRequest';
import { NewRequestPage } from '../NewRequest';
import { idToStr, Request } from '../Request';
import { RequestPage } from '../RequestPage';
import { requests } from '../RequestTypes/RequestTypes';

export function Requests(): JSX.Element {
  return (
    <Routes>
      <Route path="" element={<RequestList />} />
      <Route path="new/:requestType" element={<NewRequestPage />} />
      <Route path=":id/edit" element={<EditRequestPage />} />
      <Route path=":id" element={<RequestPage />} />
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
      <Cell className="font-mono text-gray-700">
        <span className="text-gray-500">{type}/</span>
        {code}
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
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') ?? '-status:deleted';
  const { Loader } = Api.useAsyncGet<{ values: WithID<Request>[]; total: number }>(
    Api.urlWithParams('/me/requests', { limit, offset, query })
  );

  return (
    <Authorized roles={['Client']} otherwise={<Navigate to="/requests" />}>
      <Page title="My requests">
        <div className="mb-8">
          <h2 className="font-medium text-xs text-gray-600 mb-4 uppercase">Create new request</h2>
          <NewRequestSection />
        </div>
        <div className="mb-6">
          <h2 className="font-medium text-xs text-gray-600 mb-4 uppercase">Review your requests</h2>
          <SearchBar
            query={padWithSpace(query)}
            onSubmit={values => {
              setSearchParams({ query: values.query.trim() });
            }}
          />
        </div>
        <Loader>
          {({ values }) => {
            return (
              <Table columns={['Name', 'ID code', 'Created', 'Status']}>
                {values.map(r => (
                  <RequestTableItem key={r._id} request={r} />
                ))}
              </Table>
            );
          }}
        </Loader>
      </Page>
    </Authorized>
  );
}

function NewRequestSection() {
  const { auth } = useAuth();
  const requestTypes = [...requests.entries()].map(
    ([key, { newRequestButtonText, description }]) => ({
      type: key,
      title: newRequestButtonText,
      description,
    })
  );

  if (auth.user.teams.length === 0) {
    return (
      <div className="bg-white rounded-md border border-blue-300 overflow-hidden">
        <div className="flex bg-blue-100 px-3 py-2 items-center">
          <Info className="text-blue-900 w-5 mr-2" />
          <h3 className="font-medium text-sm text-blue-900">Note</h3>
        </div>
        <div className="p-4 text-sm text-gray-700">
          <p>You have to be assigned a research group before you'll be able to create requests.</p>
        </div>
      </div>
    );
  }

  // TODO Přidat možnost kompaktního zobrazení, pokud ani jeden typ nemá field description
  return (
    <div
      style={{
        gridAutoRows: '1fr',
        gridTemplateColumns: 'repeat(auto-fill, minmax(40ch, 1fr))',
      }}
      className="grid gap-6"
    >
      {requestTypes.map(rt => (
        <NewRequestButton
          key={rt.title}
          link={`new/${rt.type}`}
          name={rt.title}
          description={rt.description}
        />
      ))}
    </div>
  );
}

function NewRequestButton({
  name,
  link,
  description,
}: {
  name: string;
  link: To;
  description: Maybe<string>;
}) {
  if (description) {
    return (
      <Link to={link} className="group bg-gray-50 rounded-lg">
        <div className="flex flex-row border-b border-gray-200 px-4 py-3 items-center justify-between">
          <h3 className="text-lg font-medium">{name}</h3>
          <p className="duration-150 group-hover:shadow-lg rounded-full px-3 py-3 bg-gray-200 group-hover:bg-green-400 text-white uppercase font-medium text-xs">
            Create
          </p>
        </div>
        <p className="text-sm text-gray-600 p-4">{description}</p>
      </Link>
    );
  }
  return (
    <Link to={link} className="group bg-gray-50 rounded-lg">
      <div className="flex flex-row px-4 py-3 items-center justify-between">
        <h3 className="text-lg font-medium">{name}</h3>
        <p className="duration-150 group-hover:shadow-lg rounded-full px-3 py-3 bg-gray-200 group-hover:bg-green-400 text-white uppercase font-medium text-xs">
          Create
        </p>
      </div>
    </Link>
  );
}
