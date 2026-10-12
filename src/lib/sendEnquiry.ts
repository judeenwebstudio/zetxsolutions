export type EmailJSConfig = { serviceId: string; templateId: string; publicKey: string };
type Sender = (service: string, template: string, params: Record<string, string>, options: { publicKey: string; limitRate: { id: string; throttle: number } }) => Promise<{ status: number; text: string }>;

export function templateParameters(fields: FormData): Record<string, string> {
  const value = (key: string) => String(fields.get(key) || '').trim();
  return { from_name: value('name'), from_email: value('email'), phone: value('phone'), service: value('service'), message: value('message') };
}

export async function sendEnquiry(fields: FormData, config: EmailJSConfig, send: Sender) {
  if (!config.serviceId || !config.templateId || !config.publicKey) throw new Error('EmailJS is not configured.');
  if (fields.get('consent') !== 'on') throw new Error('Privacy consent is required.');
  const response = await send(config.serviceId, config.templateId, templateParameters(fields), {
    publicKey: config.publicKey, limitRate: { id: 'zetx-contact', throttle: 10000 },
  });
  if (response.status !== 200) throw new Error('EmailJS acceptance could not be confirmed.');
  return response;
}

// Never display or log raw provider bodies: they can contain customer data or configuration.
export function emailJSDiagnostic(failure: unknown) {
  const value = failure && typeof failure === 'object' ? failure as { status?: unknown; text?: unknown } : {};
  const status = typeof value.status === 'number' && Number.isInteger(value.status) ? value.status : 0;
  const text = typeof value.text === 'string' ? value.text.trim().toLowerCase() : '';
  const code = status === 404 && text === 'account not found' ? 'ACCOUNT_NOT_FOUND'
    : /service.*not found/.test(text) ? 'SERVICE_NOT_FOUND'
    : /template.*not found/.test(text) ? 'TEMPLATE_NOT_FOUND'
    : status === 403 ? 'ACCESS_REJECTED'
    : status === 429 ? 'RATE_LIMITED'
    : status === 404 ? 'NOT_FOUND'
    : status === 0 ? 'NETWORK_OR_CLIENT_ERROR' : 'PROVIDER_REJECTED';
  const message = code === 'ACCOUNT_NOT_FOUND'
    ? 'Online enquiries are temporarily unavailable (EmailJS account configuration). Please use WhatsApp or email.'
    : code === 'RATE_LIMITED'
      ? 'Too many enquiries. Please wait a moment and try again, or use WhatsApp or email.'
      : 'Your enquiry could not be confirmed. Please try again later or use WhatsApp or email.';
  return { status, code, message };
}
