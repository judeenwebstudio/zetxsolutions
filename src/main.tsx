import React, { lazy, Suspense, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ContactCTA } from './components/ContactCTA';
import { Footer } from './components/Footer';
import { ContactModal } from './components/ContactModal';
import './styles.css';
const About = lazy(() => import('./pages/About'));
function InitialAnchorScroll() {
  useLayoutEffect(() => {
    if (!window.location.hash) return;
    try {
      document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView({ behavior: 'instant', block: 'start' });
    } catch { /* Ignore malformed external hashes. */ }
  }, []);
  return null;
}
const isAbout = /^\/about\/?$/.test(window.location.pathname);
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><MotionConfig reducedMotion="user"><a className="skip-link" href="#main">Skip to content</a><Header/><main id="main"><Suspense fallback={<div className="container" role="status" style={{ paddingBlock: 80, minHeight: 'calc(100svh - 72px)' }}>Loading page...</div>}>{isAbout ? <About/> : <><Hero/><Services/><WhyChooseUs/><ContactCTA/><InitialAnchorScroll/></>}</Suspense></main><Footer/><ContactModal/></MotionConfig></React.StrictMode>);
