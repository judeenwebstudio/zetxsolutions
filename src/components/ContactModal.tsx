import { useEffect, useRef, useState, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { sendEnquiry } from '../lib/sendEnquiry';
import { motion, useReducedMotion } from 'motion/react';
import { X, MessageCircle, Mail, ArrowUpRight } from 'lucide-react';
import { company } from '../config/company';
import { contact, whatsappHref } from '../config/contact';
import './ContactModal.css';

type FieldErrors = Record<string, string>;
type Status = 'ready' | 'unavailable' | 'sending' | 'success';

export function ContactModal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const sending = useRef(false);
  const startedAt = useRef(Date.now());
  const reduced = useReducedMotion();
  const [status, setStatus] = useState<Status>(contact.emailjsConfigured ? 'ready' : 'unavailable');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    const open = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href="#contact"]');
      if (!anchor || !dialog.current) return;
      event.preventDefault();
      if (dialog.current.open) return;
      returnFocus.current = anchor;
      startedAt.current = Date.now();
      setError(''); setFieldErrors({}); setStatus(contact.emailjsConfigured ? 'ready' : 'unavailable');
      form.current?.reset();
      dialog.current.showModal();
    };
    document.addEventListener('click', open);
    return () => { document.removeEventListener('click', open); };
  }, []);

  useEffect(() => {
    if (status === 'success') dialog.current?.querySelector<HTMLButtonElement>('.contact-success button')?.focus();
  }, [status]);

  const close = () => { if (status !== 'sending') dialog.current?.close(); };
  const onClosed = () => { if (returnFocus.current?.isConnected) returnFocus.current.focus(); else document.querySelector<HTMLButtonElement>('.menu-button')?.focus(); };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || status !== 'ready' || !form.current?.reportValidity()) return;
    const fields = new FormData(form.current);
    if (String(fields.get('website') || '').trim() || Date.now() - startedAt.current < 2000) {
      setError('Please review your enquiry and try again.'); return;
    }
    sending.current = true;
    setStatus('sending'); setError(''); setFieldErrors({});
    try {
      await sendEnquiry(fields, contact.emailjs, emailjs.send);
      setStatus('success'); form.current?.reset();
    } catch (failure) {
      setStatus('ready');
      const statusCode = (failure as { status?: number })?.status;
      setError(statusCode === 429
        ? 'Too many enquiries. Please wait a moment and try again, or use WhatsApp or email.'
        : 'Your enquiry could not be confirmed. Please try again later or use WhatsApp or email.');
    } finally { sending.current = false; }
  }

  const fieldError = (name: string) => ({ 'aria-invalid': Boolean(fieldErrors[name]), 'aria-describedby': fieldErrors[name] ? `error-${name}` : undefined });
  const message = (name: string) => fieldErrors[name] && <span className="contact-field-error" id={`error-${name}`}>{fieldErrors[name]}</span>;

  return <dialog ref={dialog} className="contact-dialog" aria-labelledby="enquiry-title" aria-describedby="enquiry-intro"
    onClose={onClosed} onCancel={event => { if (status === 'sending') event.preventDefault(); }}
    onClick={event => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if(event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close(); } }}>
    <motion.div className="contact-modal-inner" initial={reduced ? false : { opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.25 }}>
      <button type="button" className="contact-close" aria-label="Close contact dialog" onClick={close} disabled={status === 'sending'}><X size={22}/></button>
      <p className="eyebrow">LET'S CONNECT</p>
      <h2 id="enquiry-title">Get in Touch</h2>
      <p id="enquiry-intro">Tell us what you need. Let's explore your next step.</p>
      <div className="contact-direct">
        <a className="button gold" href={whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle size={17}/>Chat on WhatsApp <ArrowUpRight size={15}/></a>
        <a className="button contact-email" href={`mailto:${contact.email}`}><Mail size={16}/>Email us</a>
      </div>
      <p className="contact-address">{contact.email} · +91 78294 22815</p>
      {status === 'unavailable' && <p role="status" className="contact-form-status">Online enquiries are not configured yet. Please use WhatsApp or email to get in touch.</p>}
      {status === 'success' ? <div className="contact-success" role="status"><h3>Enquiry accepted</h3><p>Our email provider has accepted your enquiry for delivery. Thank you for contacting ZET X SOLUTIONS.</p><button type="button" className="button gold" onClick={close}>Close</button></div> :
      <form ref={form} onSubmit={submit} aria-busy={status === 'sending'}>
        <fieldset disabled={status === 'sending'}>
          <legend className="contact-form-legend">Send an enquiry</legend>
          <div className="contact-fields">
            <label>Full Name <span aria-hidden="true">*</span><input name="name" required minLength={2} maxLength={100} autoComplete="name" {...fieldError('name')}/>{message('name')}</label>
            <label>Email <span aria-hidden="true">*</span><input name="email" type="email" required maxLength={254} autoComplete="email" {...fieldError('email')}/>{message('email')}</label>
            <label>Phone <span className="optional">(optional)</span><input name="phone" type="tel" maxLength={25} autoComplete="tel" pattern="[0-9+\s.\(\)\-]{7,25}" {...fieldError('phone')}/>{message('phone')}</label>
            <label>Service Required <span aria-hidden="true">*</span><select name="service" required {...fieldError('service')}><option value="">Select a service</option>{company.services.map(service => <option key={service.title}>{service.title}</option>)}</select>{message('service')}</label>
            <label className="contact-message">Message <span aria-hidden="true">*</span><textarea name="message" rows={3} required minLength={10} maxLength={3000} {...fieldError('message')}/>{message('message')}</label>
          </div>
          <div className="contact-honey" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" maxLength={200}/></label></div>
          <details className="contact-privacy"><summary>How we use your details</summary><p>{contact.privacyNotice}</p></details>
          <label className="contact-consent"><input name="consent" type="checkbox" required {...fieldError('consent')}/><span>I agree to the privacy notice and the use of my details to respond to this enquiry.</span></label>{message('consent')}
          {error && <p role="alert" className="contact-field-error">{error}</p>}
          <button type="submit" className="button gold contact-submit" disabled={status !== 'ready'}>{status === 'sending' ? 'Sending enquiry…' : 'Send Enquiry'}<ArrowUpRight size={16}/></button>
        </fieldset>
      </form>}
    </motion.div>
  </dialog>;
}
