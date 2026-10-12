import { UsersRound, MessagesSquare, BadgeCheck, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { company, contactHref } from '../config/company';
import { Reveal } from './Reveal';
import './Services.css';
const visuals = [
  { image: 'staffing', icon: UsersRound },
  { image: 'consultation', icon: MessagesSquare },
  { image: 'certification', icon: BadgeCheck },
];
export function Services() {
  const reduced = useReducedMotion();
  return <section id="services" className="services cinematic-services" aria-labelledby="services-title">
    <div className="container">
      <Reveal className="section-heading"><p className="eyebrow">OUR SERVICES</p>
        <h2 id="services-title">Comprehensive Solutions<br className="services-heading-break"/> for Your Needs</h2>
        <p className="services-intro">The right people. Thoughtful guidance. A clear path forward.<br/>Explore support shaped around your next step.</p>
      </Reveal>
      <div className="services-grid">{company.services.map((service, i) => {
        const { image, icon: Icon } = visuals[i];
        return <Reveal key={service.title} delay={i * 0.08}>
          <motion.article className="service-card" initial="rest" whileHover="hover" whileFocus="hover"
            variants={{ rest: { y: 0 }, hover: { y: reduced ? 0 : -6 } }} transition={{ duration: 0.3 }} aria-labelledby={`service-${i}`}>
            <motion.img className="service-photo" src={`/images/services/${image}.webp`} alt="" width={image === 'staffing' ? 511 : 512} height={520} loading="lazy" decoding="async"
              variants={{ rest: { scale: 1 }, hover: { scale: reduced ? 1 : 1.045 } }} transition={{ duration: 0.7, ease: 'easeOut' }}/>
            <div className="service-shade" aria-hidden="true"/>
            <div className="service-content">
              <div className="service-meta"><span className="service-number">0{i + 1}</span><span className="service-icon"><Icon size={24} strokeWidth={1.5} aria-hidden="true"/></span></div>
              <h3 id={`service-${i}`}>{service.title}</h3><span className="service-rule" aria-hidden="true"/>
              <p>{service.description}</p>
              <a href={contactHref} data-contact-service={service.title} aria-label={`Discuss ${service.title}`}>Let&#8217;s Talk <ArrowUpRight size={18} aria-hidden="true"/></a>
            </div>
          </motion.article>
        </Reveal>;
      })}</div>
    </div>
  </section>;
}
