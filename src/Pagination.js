import React, { useState } from "react";
import { urlWithParams } from "./Api";

import * as Icon from "react-feather";
import { Link, useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function usePagination(initLimit = 1, around = 1, onBoundary = 1) {
  const queryParams = useQuery();
  const location = useLocation();
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(initLimit);

  const currentPage = queryParams.get("page") ? Number(queryParams.get("page")) : 0;
  const finalPage = Math.max(Math.floor(total / limit) - 1, 0);

  console.log(currentPage);
  console.log(location.pathname);

  const shouldBeHidden = (n) =>
    n >= 0 + onBoundary && n <= finalPage - onBoundary && Math.abs(currentPage - n) > around;

  const pages = [...Array(finalPage + 1).keys()]
    // Hide pages according to basic rules
    .map((n) => ({ number: n, hidden: shouldBeHidden(n) }))
    // Unhide a page if it's surrounded by shown pages
    .map((p, i, a) => {
      const prevHidden = i === 0 || a[i - 1].hidden;
      const nextHidden = i === a.length - 1 || a[i + 1].hidden;
      if (!p.hidden || !(prevHidden || nextHidden)) {
        return { ...p, hidden: false };
      } else {
        return { ...p, hidden: true };
      }
    })
    // Collapse hidden pages to one
    .filter((p, i, a) => !p.hidden || i === 0 || !a[i - 1].hidden)
    // Add additional info to shown pages
    .map((p) =>
      p.hidden
        ? p
        : {
            active: p === currentPage,
            link: urlWithParams(location.pathname, { page: p.number }),
            ...p,
          }
    );

  return { currentPage, pages, setTotal, setLimit, limit, offset: currentPage * limit };
}

export default function Pagination({ currentPage, pages }) {
  const location = useLocation();

  if (pages.length <= 1) {
    return (
      <div className="px-6 py-3 text-sm flex items-center justify-center">
        <div className="text-sm tracking-wide text-gray-600">These are all the items</div>
      </div>
    );
  }

  const pageButons = pages.map((p) => {
    if (!p.hidden) {
      return <PaginationItem {...p} key={p.number} />;
    } else {
      return <Ellipsis key={p.number} />;
    }
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
  if (dir === "L") {
    icon = <Icon.ChevronLeft className="h-4" />;
  } else {
    icon = <Icon.ChevronRight className="h-4" />;
  }

  let classes = "list-item px-3 py-1 border-r border-gray-200 focus:outline-none flex items-center";

  if (disabled) {
    classes += " text-gray-500";
  }

  return (
    <Link key={dir} className={classes} to={link}>
      {icon}
    </Link>
  );
}

function PaginationItem({ number, active, link }) {
  let classes = "list-item px-3 py-1 border-r border-gray-200 focus:outline-none flex items-center";
  if (!active) {
    classes += " hover:bg-gray-200 text-gray-800";
  } else {
    classes += " font-extrabold";
  }

  return (
    <Link className={classes} to={link}>
      {number + 1}
    </Link>
  );
}
