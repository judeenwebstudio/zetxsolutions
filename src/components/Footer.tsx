import { pageLink } from '../lib/navigation';
import { Logo } from './Logo';
import { navigation, company } from '../config/company';
export function Footer(){return <footer className="footer"><div className="container footer-top"><a href="/" aria-label="Back to home"><Logo variant="footer"/></a><nav aria-label="Footer navigation">{navigation.map(([label,href])=><a key={href} href={pageLink(href)}>{label}</a>)}</nav><a href="#main" className="back-top">Back to top ↑</a></div><p className="copyright">© {new Date().getFullYear()} {company.name}. All rights reserved.</p></footer>}
