import c from 'classnames';
import React from 'react';

import { getStatusColor, Status, statusToStr } from '../Request/Status';

export function Pill({
  children,
  className = 'text-gray-600 bg-gray-200',
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <span
      className={c(
        'py-1 px-3 text-xs rounded-full font-medium inline-flex flex-row items-center',
        className
      )}
    >
      {children}
    </span>
  );
}

export function RequestStatusPill({ status }: { status: Status }): JSX.Element {
  const { general, indicator } = getStatusColor(status);
  return (
    <PillWithIndicator pillClasses={general} indicatorClasses={indicator}>
      {statusToStr(status)}
    </PillWithIndicator>
  );
}

export function ActivityPill({
  active,
  activeText = 'Active',
  inactiveText = 'Archived',
}: {
  active: boolean;
  activeText?: string;
  inactiveText?: string;
}): JSX.Element {
  return active ? (
    <PillWithIndicator pillClasses="bg-green-100 text-green-800" indicatorClasses="bg-green-300">
      {activeText}
    </PillWithIndicator>
  ) : (
    <PillWithIndicator pillClasses="bg-red-100 text-red-800" indicatorClasses="bg-red-300">
      {inactiveText}
    </PillWithIndicator>
  );
}

export function PillWithIndicator({
  indicatorClasses,
  pillClasses,
  children,
}: {
  indicatorClasses: string;
  pillClasses: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <Pill className={pillClasses}>
      <span className={c('relative inline-flex rounded-full h-2 w-2 mr-2', indicatorClasses)} />
      {children}
    </Pill>
  );
}
