import './Logo.css';

export function Logo({ variant = 'header' }: { variant?: 'header' | 'footer' }) {
  return (
    <img
      className={`brand-logo brand-logo--${variant}`}
      src="/assets/zetx-final-logo.webp"
      width={1270}
      height={355}
      alt="ZET X SOLUTIONS"
    />
  );
}
