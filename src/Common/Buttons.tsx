import c from 'classnames';
import { ClassValue } from 'classnames/types';
import { To } from 'history';
import React, { ReactNode } from 'react';
import * as Icon from 'react-feather';
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

export function primaryClasses(status: Status) {
  return [
    'rounded-lg',
    'text-white',
    'shadow-sm',
    status === 'Danger' && 'bg-red-400 hover:bg-red-500',
    status === 'Normal' && 'bg-teal-400 hover:bg-teal-500',
  ];
}

export function secondaryClasses(status: Status) {
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

export function tertiaryClasses(status: Status) {
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
];

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

export function Create({ title }: { title: string }) {
  return <PrimaryLinked to="new" title={title} />;
}

export function More({ id }: { id?: number }) {
  return (
    <TertiaryLinked to={id ? `${id}/edit` : 'edit'} className="p-1">
      <Icon.MoreVertical className="text-gray-700 h-4 stroke-2" />
    </TertiaryLinked>
  );
}

export function Cancel({ className }: { className?: string }) {
  const navigate = useNavigate();
  return (
    <Tertiary className={className} title="Cancel" status="Normal" onClick={() => navigate(-1)} />
  );
}

export function Primary(props: SubmitButtonParams) {
  return makeButton(props, primaryClasses);
}

export function PrimaryLinked(props: LinkParams) {
  return makeLinkedButton(props, primaryClasses);
}

export function Secondary(props: ButtonParams) {
  return makeButton(props, secondaryClasses);
}

export function SecondaryLinked(props: LinkParams) {
  return makeLinkedButton(props, secondaryClasses);
}

export function Tertiary(props: ButtonParams) {
  return makeButton(props, tertiaryClasses);
}

export function TertiaryLinked(props: LinkParams) {
  return makeLinkedButton(props, tertiaryClasses);
}
