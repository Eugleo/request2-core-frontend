import React from 'react';
import c from 'classnames';

export default function Page({ width = null, title, children }) {
  const classes = [width || 'w-full', 'px-6', 'flex-grow', 'mx-auto'];

  return (
    <div className={c(classes)}>
      <h1 className="text-3xl font-bold leading-tight text-black mt-8">{title}</h1>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function CenteredPage({ title, width = null, children }) {
  const classes = [
    'w-full',
    'h-full',
    width,
    'px-6',
    'flex-grow',
    'mx-auto',
    'flex',
    'flex-col',
    'justify-center',
  ];

  return (
    <div className={c(classes)}>
      <h1 className="text-3xl text-center font-bold leading-tight text-black">{title}</h1>
      <div className="mt-6">{children}</div>
    </div>
  );
}
