import React from 'react';

export default function Page({ width, title, children }) {
  const classes = ['w-full', width || '', 'px-6', 'flex-grow', 'mx-auto'];

  return (
    <div className={classes.join(' ')}>
      <h1 className="text-3xl font-bold leading-tight text-black mt-8">{title}</h1>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function CenteredPage({ title, width = '', children }) {
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
    <div className={classes.join(' ')}>
      <h1 className="text-3xl text-center font-bold leading-tight text-black">{title}</h1>
      <div className="mt-6">{children}</div>
    </div>
  );
}
