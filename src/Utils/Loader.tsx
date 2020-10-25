import React, { useEffect, useState } from 'react';
import { AtomSpinner } from 'react-epic-spinners';

export type Result<T> =
  | { status: 'Pending' }
  | { status: 'Success'; data: T }
  | { status: 'Error'; data: string };

function Spinner() {
  return (
    <span className="mx-auto">
      <AtomSpinner color="gray" />
    </span>
  );
}

function Problem() {
  return <p>Failed to load resource</p>;
}

export function useAsync<T>(
  func: () => Promise<T>
): {
  result: Result<T>;
  Loader: ({ children }: { children: (data: T) => JSX.Element }) => JSX.Element;
} {
  const [result, setResult] = useState<Result<T>>({ status: 'Pending' });

  useEffect(() => {
    const fetchData = async () => {
      const t = await func();
      setResult({ data: t, status: 'Success' });
    };
    fetchData().catch(console.log);
  }, [func]);

  switch (result.status) {
    case 'Pending':
      return { Loader: Spinner, result };
    case 'Error':
      return { Loader: () => <Problem />, result };
    default:
      return { Loader: ({ children }) => children(result.data), result };
  }
}

export function ok<T>(res: Result<T>): res is { status: 'Success'; data: T } {
  return res.status === 'Success';
}
