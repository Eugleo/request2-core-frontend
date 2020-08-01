import { useEffect, useRef } from 'react';

export default function useOnClickOutside(handler) {
  const ref = useRef();

  useEffect(() => {
    const listener = event => {
      if (!ref || !ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
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
