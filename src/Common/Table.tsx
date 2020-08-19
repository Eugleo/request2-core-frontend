import c from 'classnames';
import React, { ReactNode } from 'react';

import { Card } from './Layout';

function TableHeading({ align, text }: { align: 'left' | 'right'; text: string }) {
  return (
    <p
      className={c(
        'flex items-center text-xs text-gray-600 font-medium text-right',
        align === 'left' ? 'justify-start' : 'justify-end'
      )}
    >
      {text.toLocaleUpperCase()}
    </p>
  );
}

export function Row({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ gridAutoFlow: 'column', gridAutoColumns: '1fr' }}
      className="list-item border-gray-200 px-6 py-3 hover:bg-gray-100 grid col-gap-12 border-b"
    >
      {children}
    </div>
  );
}

export function Cell({
  align = 'right',
  width = 1,
  children,
  className,
}: {
  align?: 'left' | 'right';
  width?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={c(
        'flex items-center text-sm',
        align === 'left' ? 'justify-start' : 'justify-end',
        `col-span-${width}`,
        className
      )}
    >
      {children}
    </span>
  );
}

export default function Table<T>({
  columns,
  children,
}: {
  columns: string[];
  children: ReactNode;
}) {
  const width = columns.length;
  return (
    <Card>
      <div className={`grid grid-cols-${width} px-6 col-gap-12 py-3 bg-gray-100`}>
        {columns.map((col, ix) => (
          <TableHeading align={ix === 0 ? 'left' : 'right'} text={col} key={col} />
        ))}
      </div>
      <div className="border-gray-300">{children}</div>
    </Card>
  );
}

export function Pill({ text, className }: { text: string; className: string }) {
  return <span className={c('py-1 px-3 text-xs rounded-full border', className)}>{text}</span>;
}
