import c from 'classnames';
import React, { ReactNode } from 'react';

import { Card } from './Layout';

function TableHeading({ text }: { text: string }) {
  return (
    <th className={c('text-xs text-gray-600 font-medium px-6 py-3 text-left')}>
      {text.toLocaleUpperCase()}
    </th>
  );
}

export function Row({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <tr
      style={{ gridAutoColumns: '1fr', gridAutoFlow: 'column' }}
      className="list-item border-gray-200 px-6 py-3 hover:bg-gray-100 border-b"
    >
      {children}
    </tr>
  );
}

export function Cell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return <td className={c('px-6 py-3 text-sm', 'whitespace-no-wrap', className)}>{children}</td>;
}

export function Table({
  columns,
  children,
}: {
  columns: string[];
  children: ReactNode;
}): JSX.Element {
  return (
    <Card>
      <table className="min-w-full">
        <thead className="px-6 col-gap-12 py-3 bg-gray-100 min-w-full">
          <tr>
            {columns.map(col => (
              <TableHeading text={col} key={`${col}-key`} />
            ))}
          </tr>
        </thead>
        <tbody className="border-gray-300 min-w-full">{children}</tbody>
      </table>
    </Card>
  );
}

export function Pill({ text, className }: { text: string; className: string }): JSX.Element {
  return <span className={c('py-1 px-3 text-xs rounded-full border', className)}>{text}</span>;
}
