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
      className="px-6 py-3 hover:bg-gray-50"
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
  return <td className={c('px-6 py-3 text-sm whitespace-nowrap', className)}>{children}</td>;
}

export function Table({
  columns,
  children,
}: {
  columns: string[];
  children: ReactNode;
}): JSX.Element {
  return (
    <Card className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="col-gap-12 py-3 bg-gray-50 bordr-b border-gray-200">
          <tr>
            {columns.map(col => (
              <TableHeading text={col} key={`${col}-key`} />
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">{children}</tbody>
      </table>
    </Card>
  );
}
