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
    <div className={c('flex flex-row space-between items-center w-full py-8', className)}>
      {children}
    </div>
  );
}

export function Body({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="z-10 relative pb-8">{children}</div>;
}

export function ContentWrapper({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="flex flex-col bg-gray-100 px-8 relative flex-grow overflow-scroll">
      {children}
    </div>
  );
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

export function Card({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}): JSX.Element {
  const classes = 'bg-white shadow-smooth rounded-lg';
  return (
    <div style={style} className={c(classes, className)}>
      {children}
    </div>
  );
}
