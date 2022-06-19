import { useCallback, useEffect, useRef } from 'react';

/**
 * Check mounted for useEffect and then do unmounted its
 */
export const useIsMounted = () => {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return function cleanup() {
      isMounted.current = false;
    };
  }, []);
  const checker = useCallback(() => isMounted.current, []);

  return checker;
};
