import { pageLink } from '../lib/navigation';
import { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { navigation, contactHref } from '../config/company';
import { Logo } from './Logo';
export function Header() {
 const [open, setOpen] = useState(false);
 return <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="header"><div className="container header-inner"><a href="/" aria-label="ZET X SOLUTIONS home"><Logo/></a><nav aria-label="Main navigation" className="desktop-nav">{navigation.map(([label,href])=><a key={href} href={pageLink(href)} aria-current={href === window.location.pathname ? 'page' : undefined}>{label}</a>)}</nav><a className="button accent header-cta" href={contactHref}>Get in Touch <ArrowUpRight size={15}/></a><button className="menu-button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-nav" onClick={()=>setOpen(!open)}>{open ? <X/> : <Menu/>}</button></div>{open && <nav id="mobile-nav" aria-label="Mobile navigation" className="mobile-nav" onKeyDown={e=>{if(e.key==='Escape')setOpen(false)}}>{navigation.map(([label,href])=><a key={href} href={pageLink(href)} aria-current={href === window.location.pathname ? 'page' : undefined} onClick={()=>setOpen(false)}>{label}</a>)}</nav>}</motion.header>;
}
