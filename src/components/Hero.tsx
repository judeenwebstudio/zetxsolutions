import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { company, contactHref } from '../config/company';
import { Reveal } from './Reveal';
export function Hero() {
 const reduced = useReducedMotion();
 return <section id="home" className="hero" aria-labelledby="hero-title"><motion.div aria-hidden="true" className="hero-art" initial={reduced ? false : { scale: 1.04 }} animate={{scale:1}} transition={{duration:1.8}}><div className="art-panel panel-one"/><div className="art-panel panel-two"/><div className="art-orbit"/><div className="art-line"/><span className="art-word">Possibility.<br/><em>Connected.</em></span><span className="art-caption">PEOPLE &nbsp; / &nbsp; PURPOSE &nbsp; / &nbsp; PROGRESS</span></motion.div><div className="container hero-inner"><Reveal><p className="eyebrow">YOUR GROWTH <span className="separator">/</span> OUR COMMITMENT</p></Reveal><Reveal delay={0.08}><h1 id="hero-title">Connecting Talent<br/>with <span>Opportunities</span></h1></Reveal><Reveal delay={0.16}><p className="hero-copy" id="about">{company.intro}</p></Reveal><Reveal className="hero-actions" delay={0.24}><a href="#services" className="button gold">Explore Our Services <ArrowRight size={16}/></a><a href={contactHref} className="button outline">Get in Touch <ArrowUpRight size={16}/></a></Reveal></div></section>;
}
