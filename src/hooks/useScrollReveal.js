import { useEffect, useRef, useState } from 'react';
import { useHomeScrollRoot } from '../context/HomeScrollContext';

export function useScrollReveal(options = {}) {
  const { threshold = 0.12, rootMargin = '0px 0px -6% 0px', once = true } = options;
  const scrollRoot = useHomeScrollRoot();
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const root = scrollRoot?.current ?? null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin, root }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, scrollRoot]);

  return { ref, isVisible };
}
