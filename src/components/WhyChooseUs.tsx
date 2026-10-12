import { Target, SlidersHorizontal, Handshake, ShieldCheck, TrendingUp } from 'lucide-react';
import { company } from '../config/company';
import { Reveal } from './Reveal';
import './WhyChooseUs.css';

const icons = [Target, SlidersHorizontal, Handshake, ShieldCheck, TrendingUp];

export function WhyChooseUs() {
  return (
    <section id="why-us" className="why section why-portrait" aria-labelledby="why-title">
      <div className="container why-portrait-grid">
        <div className="why-content">
          <Reveal className="section-heading">
            <p className="eyebrow">WHY CHOOSE US</p>
            <h2 id="why-title">Your Success Is Our Priority</h2>
          </Reveal>
          <div className="benefits">
            {company.benefits.map((benefit, i) => {
              const Icon = icons[i];
              return (
                <Reveal key={benefit} className="benefit" delay={i * 0.05}>
                  <Icon size={26} strokeWidth={1.65}/>
                  <h3>{benefit}</h3>
                </Reveal>
              );
            })}
          </div>
        </div>
        <Reveal className="why-image" delay={0.1}>
          <picture>
            <source
              type="image/webp"
              srcSet="/images/why-choose-us-woman-640.webp 640w, /images/why-choose-us-woman-1280.webp 1280w"
              sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1200px) 42vw, 511px"
            />
            <img
              src="/images/why-choose-us-woman.png"
              width={1536}
              height={1024}
              alt="Smiling professional woman in a modern corporate office"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </Reveal>
      </div>
    </section>
  );
}
