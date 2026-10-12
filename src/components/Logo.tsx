import './Logo.css';

export function Logo({ variant = 'header' }: { variant?: 'header' | 'footer' }) {
  const footer = variant === 'footer';
  return (
    <img
      className={`brand-logo brand-logo--${variant}`}
      src={`/assets/${footer ? 'zetx-logo-horizontal' : 'zetx-logo-header'}.svg`}
      width={footer ? 440 : 350}
      height={footer ? 110 : 100}
      alt="ZET X SOLUTIONS"
    />
  );
}
