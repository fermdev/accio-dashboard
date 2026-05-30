import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * @param {'up' | 'down' | 'left' | 'right' | 'fade'} direction
 * @param {number} delay - ms stagger
 */
export default function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  as: Tag = 'div',
}) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <Tag
      ref={ref}
      className={`home-reveal home-reveal--${direction} ${isVisible ? 'home-reveal--visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
