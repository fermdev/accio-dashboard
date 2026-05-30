import iconLogo from '../assets/iconlogo.PNG';

/** Scattered logo “petals” — positions & motion are fixed for stable layout */
const LOGO_PETALS = [
  { x: 4, y: 8, size: 44, opacity: 0.12, anim: 'home-float-a', duration: 22, delay: 0, rotate: -12 },
  { x: 18, y: 62, size: 36, opacity: 0.08, anim: 'home-float-b', duration: 26, delay: 2, rotate: 24 },
  { x: 82, y: 14, size: 52, opacity: 0.1, anim: 'home-float-c', duration: 24, delay: 1, rotate: 18 },
  { x: 72, y: 48, size: 40, opacity: 0.09, anim: 'home-float-a', duration: 28, delay: 4, rotate: -20 },
  { x: 38, y: 22, size: 32, opacity: 0.07, anim: 'home-float-b', duration: 20, delay: 0.5, rotate: 45 },
  { x: 55, y: 78, size: 48, opacity: 0.11, anim: 'home-float-c', duration: 30, delay: 3, rotate: -8 },
  { x: 8, y: 38, size: 28, opacity: 0.06, anim: 'home-float-c', duration: 18, delay: 5, rotate: 30 },
  { x: 92, y: 72, size: 38, opacity: 0.08, anim: 'home-float-a', duration: 25, delay: 2.5, rotate: -15 },
  { x: 28, y: 88, size: 42, opacity: 0.1, anim: 'home-float-b', duration: 23, delay: 1.5, rotate: 12 },
  { x: 48, y: 5, size: 34, opacity: 0.07, anim: 'home-float-a', duration: 27, delay: 6, rotate: -25 },
  { x: 65, y: 32, size: 30, opacity: 0.06, anim: 'home-float-c', duration: 21, delay: 3.5, rotate: 60 },
  { x: 12, y: 52, size: 50, opacity: 0.09, anim: 'home-float-b', duration: 29, delay: 0.8, rotate: -30 },
  { x: 88, y: 38, size: 26, opacity: 0.05, anim: 'home-float-a', duration: 19, delay: 4.5, rotate: 8 },
  { x: 42, y: 55, size: 56, opacity: 0.13, anim: 'home-float-c', duration: 32, delay: 2.2, rotate: -5 },
  { x: 78, y: 85, size: 34, opacity: 0.07, anim: 'home-float-b', duration: 24, delay: 5.5, rotate: 22 },
  { x: 22, y: 18, size: 40, opacity: 0.08, anim: 'home-float-c', duration: 26, delay: 1.2, rotate: -18 },
  { x: 58, y: 42, size: 24, opacity: 0.05, anim: 'home-float-a', duration: 17, delay: 7, rotate: 35 },
  { x: 95, y: 8, size: 36, opacity: 0.09, anim: 'home-float-b', duration: 22, delay: 3.8, rotate: -12 },
  { x: 2, y: 75, size: 46, opacity: 0.1, anim: 'home-float-c', duration: 28, delay: 4.2, rotate: 15 },
  { x: 35, y: 68, size: 32, opacity: 0.06, anim: 'home-float-a', duration: 20, delay: 6.5, rotate: -40 },
];

export default function HomeFloatingLogos() {
  return (
    <div className="home-logo-field pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden>
      {LOGO_PETALS.map((p, i) => (
        <img
          key={i}
          src={iconLogo}
          alt=""
          className={`home-floating-logo home-floating-logo--${p.anim.split('-').pop()}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            ['--float-duration']: `${p.duration}s`,
            ['--float-delay']: `${p.delay}s`,
            ['--float-rotate']: `${p.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}
