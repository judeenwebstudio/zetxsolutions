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
