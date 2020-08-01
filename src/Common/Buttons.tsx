/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import c from 'classnames';
import * as Icon from 'react-feather';

export function Edit({ id = null }) {
  return (
    <NormalLinked to={id ? `${id}/edit` : 'edit'} classNames={['pl-2', 'pr-3', 'bg-white']}>
      <Icon.Edit3 className="mr-1 text-gray-700 h-4 stroke-2" />
      Edit
    </NormalLinked>
  );
}

export function Cancel() {
  const navigate = useNavigate();
  return <Normal title="Cancel" onClick={() => navigate(-1)} classNames={['bg-white']} />;
}

export function Normal({ title, children = null, classNames = [], onClick }) {
  const classes = [
    'inline-flex',
    'items-center',
    'rounded-md',
    'shadow-sm',
    'text-sm',
    'px-4',
    'py-2',
    'text-gray-700',
    'border',
    'border-gray-400',
    'focus:outline-none',
    'hover:border-gray-500',
    'hover:shadow-inner',
    classNames,
  ];

  return (
    <button type="button" onClick={onClick} className={c(classes)}>
      {title || children}
    </button>
  );
}

export function Danger({ classNames = [], title = null, children = null, onClick }) {
  const classes = [
    'inline-flex',
    'items-center',
    'rounded-md',
    'shadow-sm',
    'text-sm',
    'px-4',
    'py-2',
    'text-red-500',
    'bg-red-100',
    'border',
    'border-red-300',
    'focus:outline-none',
    'hover:border-red-400',
    'hover:shadow-inner',
    classNames,
  ];

  return (
    <button type="button" onClick={onClick} className={c(classes)}>
      {title || children}
    </button>
  );
}

export function Secondary({ classNames, title = null, children = null, onClick }) {
  const classes = [
    'inline-flex',
    'items-center',
    'rounded-md',
    'shadow-sm',
    'text-sm',
    'px-4',
    'py-2',
    'text-green-600',
    'bg-green-100',
    'border',
    'border-green-300',
    'focus:outline-none',
    'hover:border-green-400',
    'hover:shadow-inner',
    classNames,
  ];

  return (
    <button type="button" onClick={onClick} className={c(classes)}>
      {title || children}
    </button>
  );
}

export function Primary({ title = null, children = null, classNames = [], onClick }) {
  const classes = [
    'bg-green-600',
    'inline-flex',
    'items-center',
    'rounded-md',
    'shadow-sm',
    'text-sm',
    'px-4',
    'py-2',
    'text-white',
    'border',
    'border-gray-300',
    'focus:outline-none',
    'hover:bg-green-500',
    'hover:shadow-inner',
    classNames,
  ];

  return (
    <button type="button" onClick={onClick} className={c(classes)}>
      {title || children}
    </button>
  );
}

export function PrimarySubmit({ title = null, children = null, classNames = [] }) {
  const classes = [
    'bg-green-600',
    'inline-flex',
    'items-center',
    'rounded-md',
    'shadow-sm',
    'text-sm',
    'px-4',
    'py-2',
    'text-white',
    'border',
    'border-gray-300',
    'focus:outline-none',
    'hover:bg-green-500',
    'hover:shadow-inner',
    classNames,
  ];

  return (
    <button type="submit" className={c(classes)}>
      {title || children}
    </button>
  );
}

export function NormalLinked({ title = null, to, children = null, classNames = [] }) {
  const classes = [
    'inline-flex',
    'items-center',
    'rounded-md',
    'shadow-sm',
    'text-sm',
    'px-4',
    'py-2',
    'text-gray-700',
    'border',
    'border-gray-400',
    'focus:outline-none',
    'hover:border-gray-500',
    'hover:shadow-inner',
    classNames,
  ];

  return (
    <Link to={to} className={c(classes)}>
      {title || children}
    </Link>
  );
}
