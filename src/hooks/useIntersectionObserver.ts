import { useRef, useEffect } from 'react';

const useIntersectionObserver = (callback: IntersectionObserverCallback, options: IntersectionObserverInit) => {
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(callback, options);
    const currentTarget = targetRef.current;

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [callback, options]);

  return targetRef;
};

export default useIntersectionObserver; 