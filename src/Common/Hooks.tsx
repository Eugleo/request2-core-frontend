import { useCallback, useEffect, useRef, useState } from 'react';

export function useOnClickOutside<T extends Node>(handler: () => void): React.RefObject<T> {
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

export function useRefresh(): [number, () => void] {
  const [tick, setTick] = useState(0);
  const update = useCallback(() => {
    setTick(t => t + 1);
  }, []);
  return [tick, update];
}

export function useHover<T extends Node>(): [React.RefObject<T>, boolean] {
  const [value, setValue] = useState(false);

  const ref = useRef<T>(null);

  const handleMouseOver = () => setValue(true);

  const handleMouseOut = () => setValue(false);

  useEffect(() => {
    const node = ref.current;

    if (node) {
      node.addEventListener('mouseenter', handleMouseOver);
      node.addEventListener('mouseleave', handleMouseOut);
    }

    return () => {
      if (node) {
        node.removeEventListener('mouseenter', handleMouseOver);
        node.removeEventListener('mouseleave', handleMouseOut);
      }
    };
  }, [ref]);

  return [ref, value];
}
