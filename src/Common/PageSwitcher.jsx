import React, { useState, useMemo } from 'react';

import * as Icon from 'react-feather';
import { Link, useLocation } from 'react-router-dom';
import { urlWithParams } from '../Utils/Api';

function useQuery() {
  const loc = useLocation();
  return useMemo(() => new URLSearchParams(loc.search), [loc.search]);
}

function paginate(finalPage, pathname, onBoundary = 1, around = 1) {
  const currentPage = 0;

  const shouldBeHidden = n =>
    n >= 0 + onBoundary && n <= finalPage - onBoundary && Math.abs(currentPage - n) > around;

  const pages = [...Array(finalPage + 1).keys()]
    // Hide pages according to basic rules
    .map(n => ({ number: n, hidden: shouldBeHidden(n) }))
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
        ? p
        : {
            active: p.number === currentPage,
            link: urlWithParams(pathname, { page: p.number }),
            ...p,
          }
    );

  return pages;
}

export function usePagination(initLimit = 10) {
  const queryParams = useQuery();

  const [limit, setLimit] = useState(initLimit);
  const [offset, setOffset] = useState(0);

  const currentPage = Number(queryParams.get('page') || 0);

  return { limit, setLimit, offset, setOffset, currentPage };
}

export default function Pagination({ currentPage, limit, total }) {
  const location = useLocation();
  const finalPage = Math.max(Math.floor(total / limit) - 1, 0);
  const pages = paginate(finalPage, location.pathname);

  if (pages.length <= 1) {
    return (
      <div className="px-6 py-3 text-sm flex items-center justify-center">
        <div className="text-sm tracking-wide text-gray-600">These are all the items</div>
      </div>
    );
  }

  const pageButons = pages.map(p => {
    if (!p.hidden) {
      return <PaginationItem number={p.number} active={p.active} link={p.link} key={p.number} />;
    }
    return <Ellipsis key={p.number} />;
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

function Ellipsis() {
  return (
    <div className="list-item px-3 py-1 border-r border-gray-200 focus:outline-none flex items-center">
      ...
    </div>
  );
}

function ArrowButton({ dir, disabled, link }) {
  let icon;
  if (dir === 'L') {
    icon = <Icon.ChevronLeft className="h-4" />;
  } else {
    icon = <Icon.ChevronRight className="h-4" />;
  }

  let classes = 'list-item px-3 py-1 border-r border-gray-200 focus:outline-none flex items-center';

  if (disabled) {
    classes += ' text-gray-500';
  }

  return (
    <Link key={dir} className={classes} to={link}>
      {icon}
    </Link>
  );
}

function PaginationItem({ number, active, link }) {
  let classes = 'list-item px-3 py-1 border-r border-gray-200 focus:outline-none flex items-center';
  if (!active) {
    classes += ' hover:bg-gray-200 text-gray-800';
  } else {
    classes += ' font-extrabold';
  }

  return (
    <Link className={classes} to={link}>
      {number + 1}
    </Link>
  );
}
