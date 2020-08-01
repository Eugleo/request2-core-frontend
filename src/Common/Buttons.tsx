import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import c from 'classnames';
import * as Icon from 'react-feather';
import { To } from 'history';

type BaseButtonParams = {
  title?: string;
  children?: React.ReactNode;
  className?: string;
};

type ButtonParams = BaseButtonParams & {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

type LinkParams = BaseButtonParams & { to: To };

function Button({
  type = 'button',
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type: 'button' | 'submit' | 'reset';
}) {
  const classes = [
    'inline-flex',
    'items-center',
    'rounded-md',
    'shadow-sm',
    'text-sm',
    'px-4',
    'py-2',
    'border',
    'focus:outline-none',
    'hover:shadow-inner',
    className,
  ];

  return (
    <button type={type} onClick={onClick} className={c(classes)}>
      {children}
    </button>
  );
}

export function Edit({ id }: { id?: number }) {
  return (
    <PlainLink to={id ? `${id}/edit` : 'edit'} className="pl-2 pr-3 bg-white">
      <Icon.Edit3 className="mr-1 text-gray-700 h-4 stroke-2" />
      Edit
    </PlainLink>
  );
}

export function Cancel() {
  const navigate = useNavigate();
  return <Plain title="Cancel" onClick={() => navigate(-1)} className="bg-white" />;
}

const plainClasses = [
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
];

export function Plain({ title, children = null, className, onClick }: ButtonParams) {
  return (
    <Button type="button" onClick={onClick} className={c(plainClasses, className)}>
      {title || children}
    </Button>
  );
}

export function PlainLink({ to, title, children, className }: LinkParams) {
  return (
    <Link to={to} className={c(plainClasses, className)}>
      {title || children}
    </Link>
  );
}

const primaryClasses = [
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
];

export function Primary({ title, children, className, onClick }: ButtonParams) {
  return (
    <Button type="button" onClick={onClick} className={c(primaryClasses, className)}>
      {title || children}
    </Button>
  );
}

export function PrimarySubmit({ title, children, className }: BaseButtonParams) {
  return (
    <Button type="submit" className={c(primaryClasses, className)}>
      {title || children}
    </Button>
  );
}

export function Danger({ className, title, children, onClick }: ButtonParams) {
  const classes = [
    'text-red-500',
    'bg-red-100',
    'border-red-300',
    'hover:border-red-400',
    className,
  ];

  return (
    <Button type="button" onClick={onClick} className={c(classes)}>
      {title || children}
    </Button>
  );
}

export function Secondary({ className, title, children, onClick }: ButtonParams) {
  const classes = [
    'text-green-600',
    'bg-green-100',
    'border-green-300',
    'hover:border-green-400',
    className,
  ];

  return (
    <Button type="button" onClick={onClick} className={c(classes)}>
      {title || children}
    </Button>
  );
}
