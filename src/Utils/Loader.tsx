import React, { useEffect, useState } from 'react';
import { AtomSpinner } from 'react-epic-spinners';

export type Result<T> =
  | { status: 'Pending' }
  | { status: 'Success'; data: T }
  | { status: 'Error'; data: string };

function Spinner() {
  console.log('SPIN IT UP');
  return (
    <span className="mx-auto">
      <AtomSpinner color="gray"></AtomSpinner>
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
    func()
      .then(t => setResult({ status: 'Success', data: t }))
      .catch(e => setResult({ status: 'Error', data: e }));
  }, [func]);

  switch (result.status) {
    case 'Pending':
      return { result, Loader: Spinner };
    case 'Error':
      return { result, Loader: () => <Problem /> };
    default:
      return { result, Loader: ({ children }) => children(result.data) };
  }
}

export function ok<T>(res: Result<T>): res is { status: 'Success'; data: T } {
  return res.status === 'Success';
}
