import React from 'react';
import c from 'classnames';
import { WithID } from '../Utils/WithID';
import { Card } from './Layout';

function TableHeading({ text }: { text: string }) {
  return (
    <p className="flex items-center text-xs text-gray-600 font-medium justify-end text-right">
      {text.toLocaleUpperCase()}
    </p>
  );
}

function Item({ columnCount, elements }: { columnCount: number; elements: JSX.Element[] }) {
  const cl =
    'border-b list-item border-gray-200 px-6 py-3 hover:bg-gray-100 grid grid-cols-4 col-gap-12';

  return (
    <div
      style={{ gridTemplateColumns: `2fr ${'1fr '.repeat(columnCount - 1)}` }}
      className={c(cl, `grid-cols-${columnCount}`)}
    >
      <span className="flex justify-start items-center">{elements[0]}</span>

      {[...Array(columnCount).keys()].slice(1).map(i => (
        <span className="flex justify-end items-center">{elements[i]}</span>
      ))}
    </div>
  );
}

export default function Table<T>({
  columns,
  source,
  getRow,
}: {
  columns: string[];
  source: WithID<T>[];
  getRow: (item: WithID<T>) => JSX.Element[];
}) {
  const width = columns.length;
  return (
    <Card>
      <div
        style={{ gridTemplateColumns: `2fr ${'1fr '.repeat(width - 1)}` }}
        className={`grid grid-cols-${width} px-6 col-gap-12 py-3 bg-gray-100 border-b border-gray-200`}
      >
        <p className="flex items-center text-xs text-gray-600 font-medium justify-start">
          {columns[0].toLocaleUpperCase()}
        </p>
        {columns.slice(1).map(col => (
          <TableHeading text={col} key={col} />
        ))}
      </div>
      {source.map(item => (
        <Item key={item._id} columnCount={width} elements={getRow(item)} />
      ))}
    </Card>
  );
}
