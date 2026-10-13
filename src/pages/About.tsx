import { useEffect } from 'react';
import { Mail, ArrowUpRight, Target, Telescope, ShieldCheck, Sparkles, Handshake, TrendingUp, UsersRound, MessagesSquare, BadgeCheck } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { company, contactHref } from '../config/company';
import { about } from '../config/about';
import handshake from '../assets/handshake-1920.webp';
import handshakeSmall from '../assets/handshake-640.webp';
import handshakeMedium from '../assets/handshake-1280.webp';
import './About.css';
const serviceIcons = [UsersRound, MessagesSquare, BadgeCheck];
const valueIcons = [ShieldCheck, Sparkles, Handshake, TrendingUp];
export default function About() {
  useEffect(() => {
    document.title = 'About Us | ZET X SOLUTIONS';
    document.querySelector('meta[name="description"]')?.setAttribute('content', company.intro);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'About Us | ZET X SOLUTIONS');
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', company.intro);
  }, []);
  return <div className="about-page">
    <section className="about-hero" aria-labelledby="about-title">
      <img className="about-hero-image" src={handshake} srcSet={`${handshakeSmall} 640w, ${handshakeMedium} 1280w, ${handshake} 1920w`} sizes="100vw" width="1920" height="1080" fetchPriority="high" alt=""/>
      <div className="container"><Reveal><p className="eyebrow">ABOUT ZET X SOLUTIONS</p>
        <h1 id="about-title">Building Connections.<br/><span>Creating Opportunities.</span></h1>
        <p className="about-lead">{company.intro}</p><span className="about-gold-line" aria-hidden="true"/>
      </Reveal></div>
    </section>
    <section className="about-who about-space" aria-labelledby="who-title"><div className="container about-split">
      <Reveal className="about-portrait"><img src="/images/why-choose-us-woman-1280.webp" srcSet="/images/why-choose-us-woman-640.webp 640w, /images/why-choose-us-woman-1280.webp 1280w" sizes="(max-width: 760px) 90vw, 45vw" width="1280" height="853" loading="lazy" decoding="async" alt="Smiling professional woman in a modern corporate office"/><span aria-hidden="true">YOUR GROWTH. OUR COMMITMENT.</span></Reveal>
      <Reveal><p className="eyebrow">WHO WE ARE</p><h2 id="who-title">{about.identity}</h2><p>{about.who}</p><p>{about.approach}</p><a className="about-text-link" href="/#services">Explore our services <ArrowUpRight size={18}/></a></Reveal>
    </div></section>
    <section className="about-purpose about-space" aria-labelledby="purpose-title"><div className="container">
      <Reveal className="about-section-heading"><p className="eyebrow">OUR DIRECTION</p><h2 id="purpose-title">Purpose in every connection.</h2><p>What we aspire to do. The future we hope to help shape.</p></Reveal>
      <div className="about-purpose-grid">{[{title:'Our Mission',text:about.mission,Icon:Target},{title:'Our Vision',text:about.vision,Icon:Telescope}].map(({title,text,Icon},i)=><Reveal key={title} delay={i*0.08}><article className="about-purpose-card"><Icon size={32} strokeWidth={1.4} aria-hidden="true"/><h3>{title}</h3><p>{text}</p></article></Reveal>)}</div>
    </div></section>
    <section className="about-work about-space" aria-labelledby="work-title"><div className="container">
      <Reveal className="about-section-heading"><p className="eyebrow">WHAT WE DO</p><h2 id="work-title">Three ways to move forward.</h2></Reveal>
      <div className="about-work-grid">{company.services.map((service,i)=>{const Icon=serviceIcons[i];return <Reveal key={service.title} delay={i*0.08}><article><Icon size={28} strokeWidth={1.5} aria-hidden="true"/><span className="about-work-number">0{i+1}</span><h3>{service.title}</h3><p>{service.description}</p><a className="about-text-link" href={`/#service-${i}`}>Explore service <ArrowUpRight size={18}/><span className="about-sr-only">: {service.title}</span></a></article></Reveal>;})}</div>
    </div></section>
    <section className="about-values about-space" aria-labelledby="values-title"><div className="container">
      <Reveal className="about-section-heading"><p className="eyebrow">OUR VALUES</p><h2 id="values-title">The principles that guide us.</h2></Reveal>
      <div className="about-values-grid">{about.values.map((value,i)=>{const Icon=valueIcons[i];return <Reveal key={value.title} delay={i*0.06}><article><Icon size={26} strokeWidth={1.5} aria-hidden="true"/><h3>{value.title}</h3><p>{value.description}</p></article></Reveal>;})}</div>
    </div></section>
    <section id="leadership" className="about-leadership about-space" aria-labelledby="leadership-title"><div className="container">
      <Reveal className="about-section-heading"><p className="eyebrow">OUR PEOPLE</p><h2 id="leadership-title">Meet Our Leadership</h2><p>The people behind our commitment to meaningful connections and professional growth.</p></Reveal>
      <div className="about-leadership-grid">{about.leadership.map((leader,i)=><Reveal key={leader.email} delay={i*0.08}>
        <article className="about-leader-card" aria-labelledby={`leader-${i}`}>
          <div className="about-leader-photo"><img src={`/images/leadership/${leader.portrait}-960.webp`} srcSet={`/images/leadership/${leader.portrait}-480.webp 480w, /images/leadership/${leader.portrait}-960.webp 960w`} sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1200px) calc((100vw - 92px) / 2), 554px" width={960} height={1152} loading="lazy" decoding="async" alt={leader.alt}/></div>
          <div className="about-leader-info"><h3 id={`leader-${i}`}>{leader.name}</h3><p className="about-leader-role">{leader.title}</p>
            <a className="about-leader-email" href={`mailto:${leader.email}`}><Mail size={17} aria-hidden="true"/><span>{leader.email}</span></a>
          </div>
        </article>
      </Reveal>)}</div>
    </div></section>
    <section id="contact" className="about-final about-space" aria-labelledby="about-cta-title"><div className="container"><Reveal><p className="eyebrow">YOUR NEXT CHAPTER</p><h2 id="about-cta-title">Let&#8217;s Build Your Future Together</h2><p>Start a conversation about the people, guidance or opportunities you need.</p><a className="button gold" href={contactHref}>Get in Touch <ArrowUpRight size={17}/></a></Reveal></div></section>
  </div>;
}
