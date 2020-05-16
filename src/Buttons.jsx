import React from 'react';
import { Link } from 'react-router-dom';

export function Normal(props) {
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
    props.className || '',
  ];

  return (
    <button {...props} className={classes.join(' ')}>
      {props.title || props.children}
    </button>
  );
}

export function Danger(props) {
  const classes = [
    'inline-flex',
    'items-center',
    'rounded-md',
    'shadow-sm',
    'text-sm',
    'px-4',
    'py-2',
    'text-red-600',
    'border',
    'border-red-300',
    'focus:outline-none',
    'hover:border-red-400',
    'hover:shadow-inner',
    props.className || '',
  ];

  return (
    <button {...props} className={classes.join(' ')}>
      {props.title || props.children}
    </button>
  );
}

export function Secondary(props) {
  const classes = [
    'inline-flex',
    'items-center',
    'rounded-md',
    'shadow-sm',
    'text-sm',
    'px-4',
    'py-2',
    'text-green-600',
    'border',
    'border-green-300',
    'focus:outline-none',
    'hover:border-green-400',
    'hover:shadow-inner',
    props.className || '',
  ];

  return (
    <button {...props} className={classes.join(' ')}>
      {props.title || props.children}
    </button>
  );
}

export function Primary(props) {
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
    props.className || '',
  ];

  return (
    <button {...props} className={classes.join(' ')}>
      {props.title || props.children}
    </button>
  );
}

export function NormalLinked(props) {
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
    props.className || '',
  ];

  return (
    <Link {...props} className={classes.join(' ')}>
      {props.title || props.children}
    </Link>
  );
}
