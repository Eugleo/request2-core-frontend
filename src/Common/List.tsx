import { To } from 'history';
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function List({ elements, empty }: { elements: Array<ReactNode>; empty: JSX.Element }) {
  return elements.length > 0 ? (
    <div className="flex flex-col bg-white rounded-lg shadow-sm mb-2 overflow-hidden">
      {elements}
    </div>
  ) : (
    empty
  );
}

export function LinkedItemTitle({ to, title }: { to: To; title: string }) {
  return (
    <Link to={to} className="text-md font text-black hover:text-green-700">
      {title}
    </Link>
  );
}
