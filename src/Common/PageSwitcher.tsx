import React, { useState, useMemo } from 'react';
import * as Icon from 'react-feather';
import { Link, useLocation } from 'react-router-dom';
import { To } from 'history';
import c from 'classnames';
import { urlWithParams } from '../Utils/Api';

type Page =
  | { hidden: false; link: To; number: number; active: boolean }
  | { hidden: true; number: number };

function getPages(
  finalPage: number,
  pathname: string,
  bufferOnBoundary: number,
  bufferAround: number
): Array<Page> {
  const currentPage = 0;

  const shouldBeHidden = (n: number) =>
    n >= 0 + bufferOnBoundary &&
    n <= finalPage - bufferOnBoundary &&
    Math.abs(currentPage - n) > bufferAround;

  return (
    [...Array(finalPage + 1).keys()]
      // Hide pages according to basic rules
      .map((n: number) => ({ number: n, hidden: shouldBeHidden(n) }))
      // Unhide a page if it's surrounded by shown pages
      .map((p, i, a) => {
        const prevHidden = i === 0 || a[i - 1].hidden;
        const nextHidden = i === a.length - 1 || a[i + 1].hidden;
        if (!p.hidden || !(prevHidden || nextHidden)) {
          return { ...p, hidden: false };
        }
        return { ...p, hidden: true };
      })
      // Collapse hidden pages to one
      .filter((p, i, a) => !p.hidden || i === 0 || !a[i - 1].hidden)
      // Add additional info to shown pages
      .map(p =>
        p.hidden
          ? { ...p, hidden: p.hidden }
          : {
              active: p.number === currentPage,
              link: urlWithParams(pathname, { page: p.number }),
              ...p,
            }
      )
  );
}

export default function Pagination({
  currentPage,
  limit,
  total,
  bufferOnBoundary = 1,
  bufferAround = 1,
}: {
  currentPage: number;
  limit: number;
  total: number;
  bufferOnBoundary?: number;
  bufferAround?: number;
}) {
  const location = useLocation();
  const finalPage = Math.max(Math.floor(total / limit) - 1, 0);
  const pages = getPages(finalPage, location.pathname, bufferOnBoundary, bufferAround);

  if (pages.length <= 1) {
    return (
      <div className="px-6 py-3 text-sm flex items-center justify-center">
        <div className="text-sm tracking-wide text-gray-600">These are all the items</div>
      </div>
    );
  }

  const pageButons = pages.map(p => {
    return p.hidden ? (
      <Ellipsis key={p.number} />
    ) : (
      <PaginationItem number={p.number} active={p.active} link={p.link} key={p.number} />
    );
  });

  const lastPage = pages[pages.length - 1].number;

  const buttons = [
    <ArrowButton
      dir="L"
      key="L"
      disabled={currentPage === 0}
      link={urlWithParams(location.pathname, { page: currentPage - 1 })}
    />,
    ...pageButons,
    <ArrowButton
      dir="R"
      key="R"
      disabled={currentPage === lastPage}
      link={urlWithParams(location.pathname, { page: currentPage + 1 })}
    />,
  ];

  return (
    <div className="px-6 py-3 text-sm flex items-center justify-center">
      <div className="flex border border-gray-300 rounded-md ">{buttons}</div>
    </div>
  );
}

function useQuery() {
  const loc = useLocation();
  return useMemo(() => new URLSearchParams(loc.search), [loc.search]);
}

export function usePagination(initLimit = 10) {
  const queryParams = useQuery();

  const [limit, setLimit] = useState(initLimit);
  const [offset, setOffset] = useState(0);

  const currentPage = Number(queryParams.get('page') || 0);

  return { limit, setLimit, offset, setOffset, currentPage };
}

function Ellipsis() {
  return (
    <div className="list-item px-3 py-1 border-r border-gray-200 focus:outline-none flex items-center">
      ...
    </div>
  );
}

function ArrowButton({ dir, disabled, link }: { dir: 'L' | 'R'; disabled: boolean; link: To }) {
  const classes =
    'list-item px-3 py-1 border-r border-gray-200 focus:outline-none flex items-center';
  return (
    <Link key={dir} className={c(classes, disabled && 'text-gray-500')} to={link}>
      {dir === 'L' ? <Icon.ChevronLeft className="h-4" /> : <Icon.ChevronRight className="h-4" />}
    </Link>
  );
}

function PaginationItem({ number, active, link }: { number: number; active: boolean; link: To }) {
  const classes =
    'list-item px-3 py-1 border-r border-gray-200 focus:outline-none flex items-center';
  return (
    <Link
      className={c(classes, active ? 'font-extrabold' : 'hover:bg-gray-200 text-gray-800')}
      to={link}
    >
      {number + 1}
    </Link>
  );
}
