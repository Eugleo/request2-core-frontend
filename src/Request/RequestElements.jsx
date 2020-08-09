import c from 'classnames';
import React from 'react';

import { ItemContainer, LinkedItemTitle } from '../Common/List';
import { useAsyncGet } from '../Utils/Api';
import formatDate from '../Utils/Date';
import { idToStr } from './Request';
import { statusStyle, statusToStr } from './Status';

export function EmptyLabel({ text }) {
  return (
    <div className="flex flex-col justify-center rounded-md border h-32 text-center text-lg text-gray-500">
      {text}
    </div>
  );
}

export function Section({ title, children }) {
  return null;
}

export function ListItem({
  request: { _id, name, requestType, status, authorId, dateCreated },
  to,
}) {
  const { data: author } = useAsyncGet(`/users/${authorId}`);

  return (
    <ItemContainer>
      <div className="flex flex-col col-span-5">
        <LinkedItemTitle to={to} title={name} />
        <span className="text-xs text-gray-600">
          #{idToStr({ requestType, _id })} created by{' '}
          {author && <span className="font-semibold">{author.name}</span>}
        </span>
      </div>
      <span className="text-sm text-gray-700 col-span-2">{formatDate(dateCreated)}</span>

      <div className="col-span-3 flex-row-reverse flex">
        <StatusLabel status={status} />
      </div>
    </ItemContainer>
  );
}

export function StatusLabel({ status }) {
  return (
    <div className={c('py-1 px-4 rounded-full text-xs', statusStyle(status))}>
      {statusToStr(status)}
    </div>
  );
}
