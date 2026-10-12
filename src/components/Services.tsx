import { UsersRound, MessagesSquare, BadgeCheck, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { company, contactHref } from '../config/company';
import { Reveal } from './Reveal';
const icons = [UsersRound, MessagesSquare, BadgeCheck];
export function Services() { const reduced = useReducedMotion(); return <section id="services" className="services section" aria-labelledby="services-title"><div className="container"><Reveal className="section-heading"><p className="eyebrow">OUR SERVICES</p><h2 id="services-title">Comprehensive Solutions for Your Needs</h2></Reveal><div className="services-grid">{company.services.map((service,i)=>{const Icon=icons[i];return <Reveal key={service.title} delay={i*0.08}><motion.article className="service-card" whileHover={reduced?undefined:{y:-4}}><div className="icon-circle"><Icon size={24} strokeWidth={1.6}/></div><div><h3>{service.title}</h3><p>{service.description}</p><a href={contactHref} aria-label={`Discuss ${service.title}`}>Let's talk <ArrowRight size={14}/></a></div></motion.article></Reveal>})}</div></div></section>; }
