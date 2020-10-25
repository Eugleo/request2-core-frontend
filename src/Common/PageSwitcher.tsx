import c from 'classnames';
import { To } from 'history';
import React, { useEffect, useMemo, useState } from 'react';
import * as Icon from 'react-feather';
import { Link, useLocation } from 'react-router-dom';

import { urlWithParams } from '../Utils/Api';

type Page =
  | { hidden: false; link: To; number: number; active: boolean }
  | { hidden: true; number: number };

function isHidden(p: Page): p is { hidden: true; number: number } {
  return p.hidden;
}

function getPages(
  currentPage: number,
  finalPage: number,
  pathname: string,
  bufferOnBoundary: number,
  bufferAround: number
): Page[] {
  const shouldBeHidden = (n: number) =>
    n >= 0 + bufferOnBoundary &&
    n <= finalPage - bufferOnBoundary &&
    Math.abs(currentPage - n) > bufferAround;

  return (
    [...new Array(finalPage + 1).keys()]
      // Hide pages according to basic rules
      .map((n: number) => ({ hidden: shouldBeHidden(n), number: n }))
      // Unhide a page if it's surrounded by shown pages
      .map((p, i, a) => {
        const prevHidden = i === 0 || a[i - 1].hidden;
        const nextHidden = i === a.length - 1 || a[i + 1].hidden;
        return !p.hidden || (!prevHidden && !nextHidden)
          ? { ...p, hidden: false }
          : { ...p, hidden: true };
      })
      // Collapse hidden pages to one
      .filter((p, i, a) => !p.hidden || i === 0 || !a[i - 1].hidden)
      // Add additional info to shown pages
      .map(p =>
        p.hidden
          ? { ...p, hidden: p.hidden }
          : {
              ...p,
              active: p.number === currentPage,
              link: urlWithParams(pathname, { page: p.number }),
            }
      )
  );
}

export function Pagination({
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
}): JSX.Element {
  const location = useLocation();
  const finalPage = Math.max(Math.floor(total / limit), 0);
  const pages = getPages(currentPage, finalPage, location.pathname, bufferOnBoundary, bufferAround);

  if (pages.length <= 1) {
    return (
      <div className="px-6 py-3 text-sm flex items-center justify-center">
        <div className="text-sm tracking-wide text-gray-600">These are all the items</div>
      </div>
    );
  }

  const pageButons = pages.map(p => {
    return isHidden(p) ? (
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
      <div className="flex border border-gray-300 rounded-md">{buttons}</div>
    </div>
  );
}

export function usePagination(
  initLimit = 10
): {
  currentPage: number;
  limit: number;
  offset: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
} {
  const [limit, setLimit] = useState(initLimit);
  const [offset, setOffset] = useState(0);

  const loc = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(loc.search), [loc.search]);
  const currentPage = Number(queryParams.get('page') || 0);

  useEffect(() => {
    setOffset(currentPage * limit);
  }, [currentPage, limit]);

  return { currentPage, limit, offset, setLimit, setOffset };
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
  const content =
    dir === 'L' ? <Icon.ChevronLeft className="h-4" /> : <Icon.ChevronRight className="h-4" />;

  return disabled ? (
    <div className={c(classes, 'text-gray-500')}>{content}</div>
  ) : (
    <Link key={dir} className={classes} to={link}>
      {content}
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
