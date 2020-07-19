import React from 'react';
import { ItemContainer, LinkedItemTitle } from '../Common/List';
import formatDate from '../Utils/Date';
import { useGet } from '../Utils/Api';

export function EmptyLabel({ text }) {
  return (
    <div className="flex flex-col justify-center  rounded-md border-dashed border-2 border-gray-500 h-32 text-center text-lg text-gray-500">
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

export function ListItem({ request: { name, code, status, authorId, dateCreated }, to }) {
  const author = useGet(`/users/${authorId}`);

  return (
    <ItemContainer>
      <div className="flex flex-col col-span-5">
        <LinkedItemTitle to={to} title={name} />
        <span className="text-xs text-gray-600">
          #{code} created by <span className="font-semibold">{(author && author.name) || ''}</span>
        </span>
      </div>
      <span className="text-sm text-gray-700 col-span-2">{formatDate(dateCreated)}</span>

      <div className="col-span-3 flex-row-reverse flex">
        <StatusLabel status={status} />
      </div>
    </ItemContainer>
  );
}

function StatusLabel({ status }) {
  if (status === 'Done') {
    return <div className="bg-green-200 py-2 px-4 rounded-full text-xs text-green-700">Done</div>;
  }
  if (status === 'WIP') {
    return (
      <div className="bg-yellow-200 py-2 px-4 rounded-full text-xs text-yellow-700">
        In progress
      </div>
    );
  }
  if (status === 'Requested') {
    return (
      <div className="bg-gray-200 py-2 px-4 rounded-full text-xs text-gray-700">Requested</div>
    );
  }
}
