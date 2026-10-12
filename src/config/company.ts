import { contact } from './contact';
export const company = {
  name: 'ZET X SOLUTIONS',
  email: contact.email,
  tagline: 'Your growth. Our commitment.',
  intro: 'We connect businesses with the right people through thoughtful staffing, workforce consultation and certification support. Together, we help shape what comes next.',
  services: [
    { title: 'Staffing Solutions', description: 'Temporary, permanent and contract hiring aligned with your team, your industry and your goals.', icon: 'people' },
    { title: 'Consultation Services', description: 'Practical hiring guidance, workforce planning and talent advisory for your next stage.', icon: 'consult' },
    { title: 'Certification Support', description: 'Guidance to help professionals navigate relevant certifications and prepare for their next step.', icon: 'certificate' },
  ],
  benefits: ['Industry Expertise', 'Tailored Solutions', 'Trusted Partnerships', 'Quality Commitment', 'Career Growth'],
};
export const navigation = [ ['Home', '/'], ['About Us', '/about'], ['Services', '#services'], ['Why Choose Us', '#why-us'], ['Contact', '#contact'] ];
export const contactHref = '#contact';
