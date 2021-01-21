import c from 'classnames';
import React from 'react';

export function Spacer(): JSX.Element {
  return <span className="flex-grow" />;
}

export function Title({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <h1 className={c('text-2xl font-bold leading-tight text-black', className)}>{children}</h1>
  );
}

export function Header({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <div
      className={c(
        'flex flex-row space-between items-center w-full sticky px-6 py-4 bg-white border-b border-gray-300 top-0 z-50',
        className
      )}
    >
      {children}
    </div>
  );
}

export function Body({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="pt-6 px-6 bg-gray-100 overflow-auto">
      <div className="mb-6">{children}</div>
    </div>
  );
}

export function ContentWrapper({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="h-screen flex flex-col bg-gray-100">{children}</div>;
}

export function Page({
  title,
  buttons,
  children,
}: {
  title: string;
  buttons?: React.ReactNode;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <ContentWrapper>
      <Header>
        <Title>{title}</Title>
        {buttons && <Spacer />}
        {buttons}
      </Header>
      <Body>{children}</Body>
    </ContentWrapper>
  );
}

export function SidebarWrapper({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div style={{ gridTemplateColumns: 'auto 1fr' }} className="grid grid-cols-2">
      {children}
    </div>
  );
}

export function Card({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}): JSX.Element {
  const classes =
    'flex flex-col bg-white overflow-hidden shadow-sm border border-gray-300 rounded-md';
  return (
    <div style={style} className={c(classes, className)}>
      {children}
    </div>
  );
}
