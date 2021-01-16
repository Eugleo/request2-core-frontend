import c from 'classnames';
import { ClassValue } from 'classnames/types';
import { To } from 'history';
import React, { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type Status = 'Normal' | 'Danger';

type BaseButtonParams =
  | { title: string; children?: ReactNode; className?: string }
  | { children: ReactNode; title?: string; className?: string };

type LinkParams = BaseButtonParams & { to: To; status?: Status };

type ButtonParams = BaseButtonParams & {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  status?: Status;
};

type SubmitButtonParams =
  | (BaseButtonParams & { type: 'submit' | 'reset'; onClick?: undefined; status?: Status })
  | (ButtonParams & { type?: 'button' });

export function primaryClasses(status: Status): ClassValue[] {
  return [
    'rounded-lg',
    'text-white',
    'shadow-sm',
    status === 'Danger' && 'bg-red-400 hover:bg-red-500',
    status === 'Normal' && 'bg-green-400 hover:bg-green-500',
  ];
}

export function secondaryClasses(status: Status): ClassValue[] {
  return [
    'border-2',
    'rounded-lg',
    'shadow-sm',
    'hover:shadow-inner',
    'border-gray-400',
    'hover:border-gray-500',
    'border',
    status === 'Danger' && 'text-red-600',
    status === 'Normal' && 'text-gray-700 hover:text-gray-800',
  ];
}

export function tertiaryClasses(status: Status): ClassValue[] {
  return [
    'text-gray-600',
    'font-medium',
    status === 'Danger' && 'hover:text-red-800',
    status === 'Normal' && 'hover:text-gray-700',
  ];
}

export const baseClasses = [
  'px-3',
  'py-2',
  'inline-flex',
  'items-center',
  'focus:outline-none',
  'font-medium',
  'text-sm',
  'justify-center',
];

export function Activate({ onClick }: { onClick: () => void }): JSX.Element {
  return <Secondary title="Reactivate" status="Normal" onClick={onClick} />;
}

export function Deactivate({ onClick }: { onClick: () => void }): JSX.Element {
  return <Secondary title="Deactivate" status="Danger" onClick={onClick} />;
}

function makeButton(
  { status, className, title, children, onClick, type = 'button' }: SubmitButtonParams,
  getClasses: (status: Status) => ClassValue[]
) {
  const cl = c(getClasses(status || 'Normal'), className);
  return (
    <button type={type} onClick={onClick} className={c(baseClasses, cl)}>
      {title || children}
    </button>
  );
}

function makeLinkedButton(p: LinkParams, getClasses: (status: Status) => ClassValue[]) {
  const cl = c(getClasses(p.status || 'Normal'), p.className);
  return (
    <Link to={p.to} className={c(baseClasses, cl)}>
      {p.title || p.children}
    </Link>
  );
}

export function Create({ title }: { title: string }): JSX.Element {
  return <PrimaryLinked to="new" title={title} className="flex-shrink-0" />;
}

export function Edit({ link }: { link: string }): JSX.Element {
  return (
    <Link
      to={link}
      className={c(
        'inline-flex',
        'items-center',
        'focus:outline-none',
        'font-medium',
        'text-sm',
        tertiaryClasses('Normal')
      )}
    >
      Edit
    </Link>
  );
}

export function Cancel({ className }: { className?: string }): JSX.Element {
  const navigate = useNavigate();
  return (
    <Tertiary
      className={className}
      title="Cancel"
      status="Normal"
      onClick={() => {
        navigate(-1);
      }}
    />
  );
}

export function Primary(props: SubmitButtonParams): JSX.Element {
  return makeButton(props, primaryClasses);
}

export function PrimaryLinked(props: LinkParams): JSX.Element {
  return makeLinkedButton(props, primaryClasses);
}

export function Secondary(props: SubmitButtonParams): JSX.Element {
  return makeButton(props, secondaryClasses);
}

export function SecondaryLinked(props: LinkParams): JSX.Element {
  return makeLinkedButton(props, secondaryClasses);
}

export function Tertiary(props: ButtonParams): JSX.Element {
  return makeButton(props, tertiaryClasses);
}

export function TertiaryLinked(props: LinkParams): JSX.Element {
  return makeLinkedButton(props, tertiaryClasses);
}
