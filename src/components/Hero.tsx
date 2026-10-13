/// <reference types="vite/client" />
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { company, contactHref } from '../config/company';
import { Reveal } from './Reveal';
import handshakeSmall from '../assets/handshake-640.webp';
import handshakeMedium from '../assets/handshake-1280.webp';
import handshakeLarge from '../assets/handshake-1920.webp';
import './Hero.css';

export function Hero() {
  const reduced = useReducedMotion();
  const lineReveal = {
    hidden: { opacity: 0, y: 9 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.08 + index * 0.1 },
    }),
  };

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <motion.div
        aria-hidden="true"
        className="hero-visual"
        initial={reduced ? false : { opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: reduced ? 0 : 1.1, ease: 'easeOut' }}
      >
        <motion.img
          className="hero-photo"
          src={handshakeMedium}
          srcSet={`${handshakeSmall} 640w, ${handshakeMedium} 1280w, ${handshakeLarge} 1920w`}
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 65vw, 60vw"
          width={1920}
          height={1080}
          alt=""
          loading="eager"
          fetchPriority="high"
          initial={reduced ? false : { scale: 1 }}
          animate={{ scale: reduced ? 1 : 1.05 }}
          transition={{ duration: reduced ? 0 : 18, ease: 'easeInOut' }}
        />
      </motion.div>
      <div className="container hero-inner">
        <Reveal><p className="eyebrow">YOUR GROWTH <span className="separator">/</span> OUR COMMITMENT</p></Reveal>
        <h1 id="hero-title">
          <motion.span className="hero-heading-line" custom={0} variants={lineReveal} initial={reduced ? false : 'hidden'} animate="visible">Connecting Talent</motion.span><br/>
          <motion.span className="hero-heading-line" custom={1} variants={lineReveal} initial={reduced ? false : 'hidden'} animate="visible">with <span>Opportunities</span></motion.span>
        </h1>
        <Reveal delay={0.16}><p className="hero-copy" id="about">{company.intro}</p></Reveal>
        <Reveal className="hero-actions" delay={0.24}>
          <a href="#services" className="button accent">Explore Our Services <ArrowRight size={16}/></a>
          <a href={contactHref} className="button outline">Get in Touch <ArrowUpRight size={16}/></a>
        </Reveal>
      </div>
    </section>
  );
}
