import React from 'react';
import { Link } from 'react-router-dom';

export function List({ children }) {
  return <div className="flex flex-col bg-white rounded-lg shadow-sm mb-2">{children}</div>;
}

export function ItemContainer({ children }) {
  return (
    <div className="grid grid-cols-10 last:border-b-0 px-6 py-3 items-center border-b border-gray-200 hover:bg-gray-200">
      {children}
    </div>
  );
}

export function LinkedItemTitle({ link, title }) {
  return (
    <Link to={link} className="text-md font text-black hover:text-green-700">
      {title}
    </Link>
  );
}
