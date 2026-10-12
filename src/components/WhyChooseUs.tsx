import { Target, SlidersHorizontal, Handshake, ShieldCheck, TrendingUp } from 'lucide-react';
import { company } from '../config/company';
import { Reveal } from './Reveal';
const icons=[Target,SlidersHorizontal,Handshake,ShieldCheck,TrendingUp];
export function WhyChooseUs(){return <section id="why-us" className="why section" aria-labelledby="why-title"><div className="container"><Reveal className="section-heading"><p className="eyebrow">WHY CHOOSE US</p><h2 id="why-title">Your Success Is Our Priority</h2></Reveal><div className="benefits">{company.benefits.map((benefit,i)=>{const Icon=icons[i];return <Reveal key={benefit} className="benefit" delay={i*0.05}><Icon size={26} strokeWidth={1.65}/><h3>{benefit}</h3></Reveal>})}</div></div></section>}
