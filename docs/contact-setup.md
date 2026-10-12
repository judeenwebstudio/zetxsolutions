# V1.6 EmailJS contact setup

The contact modal sends directly through @emailjs/browser. No private key or custom sender domain is used by this application. The former Resend /api/contact endpoint returns 410 and is never called by the frontend. Old Resend/Redis variables can be removed from Vercel if unused elsewhere.

## Environment and template

Configure Vercel Production variables and redeploy after changes:
- VITE_EMAILJS_SERVICE_ID: service_dj82mhm
- VITE_EMAILJS_TEMPLATE_ID: template_n7pzenl
- VITE_EMAILJS_PUBLIC_KEY: the EmailJS public key (never a private key)

These are browser-visible values. For local development copy .env.example to .env.local and replace placeholders; .env.local is ignored by Git. WhatsApp defaults to the confirmed official number when its optional variable is absent.

In the EmailJS dashboard, confirm the Gmail service is connected and authorized. Set the template recipient to zetxsolutionsofficial@gmail.com and Reply-To to {{from_email}}. Use these exact variables: {{from_name}}, {{from_email}}, {{phone}}, {{service}}, {{message}}. The recipient and Reply-To are controlled by the saved template, not frontend parameters. Use escaped template variables, not unescaped HTML interpolation. This implementation matches the owner's supplied parameter contract; dashboard contents require owner verification.

Allow https://zetxsolutions.vercel.app in EmailJS origin settings. Configure provider-side abuse controls as appropriate. The honeypot, completion delay, duplicate submission lock and SDK throttle are browser-side deterrents, not server-enforced protection. The old Redis rate limit no longer applies.

The existing privacy notice now correctly identifies EmailJS instead of Resend, following the requested provider migration. Required visitor consent remains. Phone is optional. No fields are stored by the application or inserted into WhatsApp messages. EmailJS and Gmail processing/retention are managed in those services.

## Verification

Run npm run typecheck, npm run build and node --test tests/contact.test.mjs. No lint script is configured. Automated tests mock the sender and send no email. Success requires EmailJS status 200; failures retain entered details and show a useful error. Missing frontend variables keep submission disabled, with direct email and WhatsApp still available.

After deployment, submit one clearly labelled production test enquiry, confirm EmailJS acceptance and check receipt in the recipient Gmail inbox. Acceptance alone is not proof of inbox delivery. Until Gmail receipt is confirmed, delivery is unverified. No private key is needed or permitted in source or VITE_ variables.

SDK reference: https://www.emailjs.com/docs/sdk/send/
