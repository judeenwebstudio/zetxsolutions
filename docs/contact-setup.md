# V1.5 contact configuration

## Current status

WhatsApp and direct email are configured. Production email delivery is **NOT CONFIGURED** until all server variables below are set and Resend authorizes the sender. No API credentials or verified sender were supplied during implementation. No real email delivery test has been performed.

The owner approved privacy notice version `2026-10-12-v1` in this chat before activation. The exact wording is in `src/config/contact.ts`. If it changes, obtain fresh owner approval before updating both frontend and backend privacy versions. The form requires explicit visitor consent to the same version. Phone is optional; no sensitive information is requested.

## Secure Vercel setup

Project → Settings → Environment Variables. Set the following for Production (and separately for Preview only when intended):

- `VITE_PUBLIC_WHATSAPP_NUMBER=917829422815` (public; rebuild required after changes).
- `CONTACT_RECIPIENT_EMAIL=Zetxsolutionsofficial@gmail.com` (server only).
- `RESEND_API_KEY` — paste your restricted Resend sending key directly into Vercel. Never put it in chat, source control or a VITE_ variable.
- `CONTACT_SENDER_EMAIL` — a plain email address on a domain you have verified and authorized in Resend. The Gmail recipient is **not** an authorized sender. The implementation refuses Gmail sending addresses; it does not invent a sender domain.
- `CONTACT_REDIS_REST_URL` and `CONTACT_REDIS_REST_TOKEN` — credentials from an Upstash Redis database. Required so the shared rate limit works across serverless instances. These are server-only secrets.
- Optional `CONTACT_ALLOWED_ORIGIN` — the exact canonical origin when using an additional proxy; otherwise same-origin validation uses the incoming request host.

Redeploy after configuring. `GET /api/contact` returns only `configured` and the privacy version, never secrets. A configured result means values are present, not that sender verification or delivery has been tested. Perform an owner-controlled enquiry after setup and verify its acceptance in Resend and receipt in Gmail. Provider acceptance does not guarantee inbox delivery. No auto-reply or marketing subscription is created.

The form remains disabled and the API returns 503 for otherwise valid submissions when configuration is missing. WhatsApp and mailto remain available. The WhatsApp message is a fixed URL-encoded service enquiry and never contains form contents.

## Validation, privacy and abuse controls

Server validation checks field types and lengths, allowed services, email/phone formats and explicit versioned consent. HTML is escaped, message content goes only into the email body, the visitor email is Reply-To, and the configured sender is From. Requests must be same-origin JSON and at most 16KB. Honeypot and minimum two-second completion checks discourage simple bots. All enquiries (including provider failures) consume a limit of five attempts per 15 minutes via atomic Redis Lua. Redis failure fails closed. Add Vercel Firewall bot/rate rules if abuse warrants stronger challenge-based protection; a honeypot does not defeat determined bots.

Only a keyed hash of client IP is stored in Redis, with a 15-minute expiry; no form contents are stored there. Form contents are not logged by this handler and are sent only to Resend and the configured recipient. No browser storage persists the fields. Inbox/Resend retention and deletion must be managed by the owner in those services. No retention duration is promised by the notice. Other service/platform operational logs remain subject to their settings.

## Local development and tests

`npm run dev` serves the frontend. Use `node tests/contact-preview.mjs` in another terminal and open `http://127.0.0.1:8787` for same-origin frontend + local API testing. The local API has no email configuration by default, so submission is unavailable. The harness proxies Vite's files; use a manual refresh rather than HMR through the harness. `npm run build`, `npm run typecheck`, and `node --test tests/contact.test.mjs` validate the project. Tests stub both Redis and Resend; no real emails or personal data are sent.

The modal is a native accessible dialog with keyboard focus containment, Escape/backdrop dismissal, focus restoration, labelled fields, required consent, disabled/loading/error/success states and reduced-motion support. Existing #contact entry points open one shared modal; unmodified clicks with modifier keys retain normal link behavior. The underlying page's contact CTA retains its prior dimensions.

API references: https://resend.com/docs/api-reference/emails/send-email , https://vercel.com/docs/functions/runtimes/node-js , https://vercel.com/docs/headers/request-headers , https://upstash.com/docs/redis/features/restapi .
