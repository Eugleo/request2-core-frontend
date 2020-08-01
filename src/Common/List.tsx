import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { To } from 'history';

export function List({ elements, empty }: { elements: Array<ReactNode>; empty: JSX.Element }) {
  return elements.length > 0 ? (
    <div className="flex flex-col bg-white rounded-lg shadow-sm mb-2 overflow-hidden">
      {elements}
    </div>
  ) : (
    empty
  );
}

export function ItemContainer({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-10 last:border-b-0 px-6 py-3 items-center border-b border-gray-200 hover:bg-gray-200">
      {children}
    </div>
  );
}

export function LinkedItemTitle({ to, title }: { to: To; title: string }) {
  return (
    <Link to={to} className="text-md font text-black hover:text-green-700">
      {title}
    </Link>
  );
}
