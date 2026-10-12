/// <reference types="vite/client" />
const emailjs = {
  serviceId: String(import.meta.env.VITE_EMAILJS_SERVICE_ID || '').trim(),
  templateId: String(import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '').trim(),
  publicKey: String(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '').trim(),
};
export const contact = {
  emailjs,
  emailjsConfigured: Object.values(emailjs).every(value => Boolean(value) && !/^your_|^replace_/i.test(value)),
  email: 'Zetxsolutionsofficial@gmail.com',
  whatsappNumber: String(import.meta.env.VITE_PUBLIC_WHATSAPP_NUMBER || '917829422815').replace(/\D/g, ''),
  whatsappText: 'Hello ZET X SOLUTIONS, I would like to enquire about your services.',
  privacyVersion: '2026-10-12-v2',
  privacyNotice: 'ZET X SOLUTIONS uses your name, email, optional phone number, service choice and message only to respond to your enquiry. Submissions are processed through EmailJS and delivered to our Gmail inbox. We do not use enquiry details for marketing without separate consent. Please do not include sensitive personal information. You may request access or deletion by emailing Zetxsolutionsofficial@gmail.com.',
};
export const whatsappHref = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(contact.whatsappText)}`;
