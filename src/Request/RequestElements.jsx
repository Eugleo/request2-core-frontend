import React from 'react';
import c from 'classnames';
import { ItemContainer, LinkedItemTitle } from '../Common/List';
import formatDate from '../Utils/Date';
import { useLoadResources } from '../Utils/Api';
import { statusStyle } from './Status';

export function idToCode(id) {
  const table = [1, 2, 3, 4, 5, 6, 7, 8, 9, ...'ABCDEFGHIJKLMNPQRSTUVWXYZ'.split('')];
  const k = table.length;

  const code = [...Array(10).keys()]
    .reverse()
    .reduce(([dgs, rst], n) => [[...dgs, Math.floor(rst / k ** n)], rst % k ** n], [[], id])[0]
    .map(i => table[i])
    .join('');

  return code.replace(/^1+(?=\w\w\w)/, '');
}

export function EmptyLabel({ text }) {
  return (
    <div className="flex flex-col justify-center rounded-md border h-32 text-center text-lg text-gray-500">
      {text}
    </div>
  );
}

export function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 mt-8">{title}</h2>
      {children}
    </div>
  );
}

export function ListItem({
  request: { _id, name, requestType, status, authorId, dateCreated },
  to,
}) {
  const { data: author } = useLoadResources(`/users/${authorId}`);

  return (
    <ItemContainer>
      <div className="flex flex-col col-span-5">
        <LinkedItemTitle to={to} title={name} />
        <span className="text-xs text-gray-600">
          #{requestType.charAt(0).toUpperCase()}/{idToCode(_id)} created by{' '}
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

export function ListItemWithoutAuthor({
  request: { _id, name, requestType, status, dateCreated },
  to,
}) {
  return (
    <ItemContainer>
      <div className="flex flex-col col-span-5">
        <LinkedItemTitle to={to} title={name} />
        <span className="text-xs text-gray-600">
          #{requestType.charAt(0).toUpperCase()}/{idToCode(_id)}
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
  return <div className={c('py-1 px-4 rounded-full text-xs', statusStyle(status))}>{status}</div>;
}
