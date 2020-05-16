import { useState } from 'react';

import { useLocation } from 'react-router-dom';
import { urlWithParams } from './Api';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function usePagination(initLimit = 1, around = 1, onBoundary = 1) {
  const queryParams = useQuery();
  const location = useLocation();
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(initLimit);

  const currentPage = queryParams.get('page') ? Number(queryParams.get('page')) : 0;
  const finalPage = Math.max(Math.floor(total / limit) - 1, 0);

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
            link: urlWithParams(location.pathname, { page: p.number }),
            ...p,
          }
    );

  return { currentPage, pages, setTotal, setLimit, limit, offset: currentPage * limit };
}
