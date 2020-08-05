import React from 'react';

export function Spacer() {
  return <span className="flex-grow" />;
}

export function Title({ children }: { children: React.ReactNode }) {
  return <h1 className="text-2xl font-bold leading-tight text-black">{children}</h1>;
}

export function Header({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row space-between items-center w-full sticky px-6 py-3 bg-white shadow-sm top-0">
      {children}
    </div>
  );
}

export function Body({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 px-3">{children}</div>;
}

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  return <div className="pb-10 max-h-screen overflow-auto">{children}</div>;
}

export function Page({
  title,
  buttons,
  children,
}: {
  title: string;
  buttons?: React.ReactNode;
  children: React.ReactNode;
}) {
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
