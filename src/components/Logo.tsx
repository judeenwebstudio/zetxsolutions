import './Logo.css';

export function Logo({ variant = 'header' }: { variant?: 'header' | 'footer' }) {
  return <picture className={`brand-logo-frame brand-logo-frame--${variant}`}>
    {variant === 'header' && <source media="(max-width: 700px)" srcSet="/assets/zetx-official-blue-compact.webp" width={423} height={157}/>}
    <img className={`brand-logo brand-logo--${variant}`} src="/assets/zetx-official-blue.webp" width={423} height={208} alt="Zet X Solutions"/>
  </picture>;
}
