import { useEffect, useRef, useState } from 'react';

export function useOnClickOutside<T extends Node>(handler: () => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const listener: (ev: MouseEvent | TouchEvent) => void = event => {
      if (!ref || !ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);

  return ref;
}

export function useRefresh() {
  const [, setS] = useState(0);
  return () => setS(s => s + 1);
}
