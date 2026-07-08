import React, { useEffect, useState, useRef } from 'react';

export default function AnimatedCounter({ value, duration = 1500, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime = null;
          const targetValue = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, ''), 10) : value;

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Easing out quadratic
            const easeOutQuad = progress * (2 - progress);
            setCount(Math.floor(easeOutQuad * targetValue));
            if (progress < 1) {
              requestAnimationFrame(step);
            }
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span ref={elementRef} className="tabular-nums">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
