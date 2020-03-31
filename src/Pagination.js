import React from "react";

import * as Icon from "react-feather";

export default function Pagination(props) {
  let page = Math.floor(props.offset / props.limit);
  let totalPages = Math.floor(props.total / props.limit);

  let start = [...Array(props.bound).keys()];
  let middle = [...Array(props.around * 2 + 1).keys()]
    .map(n => page + n - props.around)
    .filter(n => n > props.bound - 1 && n < totalPages - props.bound);
  let end = start
    .slice() // needed to prevent reverse from reversiong the original array
    .reverse()
    .map(n => totalPages - 1 - n)
    .filter(n => n > props.bound - 1);

  let buttons = [start, middle, end]
    .reduce((acc, a) => {
      if (a.length > 0) {
        let dif = a[0] - acc[acc.length - 1];
        if (dif > 2) {
          acc.push("...");
        } else if (dif === 2) {
          acc.push(a[0] - 1);
        }
      }

      return acc.concat(a);
    })
    .map((txt, i) => {
      if (txt === "...") {
        return <EtcLabel key={i} />;
      } else {
        return (
          <NumberButton
            key={i}
            disabled={txt === page}
            onClick={() => props.setOffset(txt * props.limit)}
          >
            {txt + 1}
          </NumberButton>
        );
      }
    });

  buttons = [
    <ArrowButton
      dir="LEFT"
      disabled={page === 0}
      key="LEFT"
      onClick={() => props.setOffset(props.offset - props.limit)}
    />,
    ...buttons,
    <ArrowButton
      dir="RIGHT"
      disabled={page === totalPages - 1}
      key="RIGHT"
      onClick={() => props.setOffset(props.offset + props.limit)}
    />
  ];

  return (
    <div className="px-6 py-3 text-sm flex items-center justify-center">
      {totalPages > 1 ? (
        <div className="flex border border-gray-300 rounded-md ">{buttons}</div>
      ) : (
        <div className="text-sm tracking-wide text-gray-600">These are all the items</div>
      )}
    </div>
  );
}

function EtcLabel() {
  return (
    <div className="list-item px-3 py-1 border-r border-gray-200 focus:outline-none flex items-center">
      ...
    </div>
  );
}

function ArrowButton({ dir, ...props }) {
  let icon;
  if (dir === "LEFT") {
    icon = <Icon.ChevronLeft className="h-4" />;
  } else {
    icon = <Icon.ChevronRight className="h-4" />;
  }

  return (
    <button
      className="list-item px-3 py-1 border-r border-gray-200 focus:outline-none flex items-center disabled:text-gray-500"
      {...props}
    >
      {icon}
    </button>
  );
}

function NumberButton(props) {
  let classes = "list-item px-3 py-1 border-r border-gray-200 focus:outline-none flex items-center";
  if (!props.disabled) {
    classes += " hover:bg-gray-200 text-gray-800";
  } else {
    classes += " font-extrabold";
  }

  return (
    <button className={classes} {...props}>
      {props.children}
    </button>
  );
}
