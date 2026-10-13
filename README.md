# ZET X SOLUTIONS

Compact, single-page corporate website built with React, Vite, TypeScript, Tailwind CSS, Motion for React and Lucide icons.

## Develop and verify

Requires Node.js 22.12+ (Node 24 recommended).

```sh
npm install
npm run dev
npm run typecheck
npm run build
npm run preview
```

The production output is `dist/`. No backend or environment variables are required. The TypeScript build is strict. No separate lint task is configured.

## Company details and contact

Edit `src/config/company.ts` for the company name, introduction, services, benefits and navigation. Set `company.email` to a verified business email before public launch. Until then, contact actions navigate to a contact section with an expandable, honest availability notice; no email address or fake form is provided. Once configured, all contact actions open the visitor's mail application.

Replace `src/components/Logo.tsx` with your final logo, preserving the accessible home link and reserved dimensions. Place local logo and hero files in `src/assets/`. The hero currently uses an original CSS illustration, the explicitly permitted fallback for an unavailable licensed handshake photo. Replace `.hero-art` with a locally imported, optimized WebP/AVIF photograph when licensed imagery is available; retain its overlay and fixed container dimensions. No external image or font requests are made. The type stack uses a fast local sans-serif and a restrained Georgia accent.

## GitHub and Vercel deployment

1. Create an empty GitHub repository.
2. From this directory, run `git init`, `git add .`, and `git commit -m "Build ZET X SOLUTIONS website"`.
3. Run `git branch -M main`, `git remote add origin https://github.com/YOUR-ACCOUNT/YOUR-REPOSITORY.git`, then `git push -u origin main`.
4. Sign into Vercel, select **Add New → Project**, and import that GitHub repository.
5. Choose **Vite**, use the repository root, build command `npm run build`, and output directory `dist`. Keep the default install command. No environment variables are needed.
6. Click **Deploy**. Future pushes to `main` deploy automatically; pull requests receive preview deployments.
7. Check the production URL on desktop and mobile and verify the configured email before announcing the site.

`vercel.json` supplies the static Vite settings. This site uses anchor navigation and needs no SPA route rewrites.

## Custom domain later

In Vercel, open the project → **Settings → Domains → Add Domain**. Enter your domain and apply the exact DNS records Vercel displays at your DNS provider. Add both the apex and `www` variants if desired, choose the primary domain and configure the other to redirect. Wait for DNS verification and automatic HTTPS provisioning.

## Launch assets and metadata

Replace `public/favicon.svg` with the final brand icon. `public/og-image.svg` is a local placeholder; export a 1200×630 PNG/JPEG for broad social crawler compatibility, update `og:image` in `index.html` to its absolute deployed URL, and add `og:url` once the final domain is known. The SEO title, description, language and basic Open Graph tags are included.

## Layout and accessibility

The supplied reference guides the short header, left-aligned hero, three service columns, five benefits, CTA and compact footer. Mobile content stacks naturally. Motion honors the operating system's reduced-motion setting; smooth scrolling is disabled for that preference. Semantic landmarks, a skip link, keyboard focus styles and a labelled mobile menu are included. Navigation targets are real page sections; About Us points to the company introduction within the hero to keep the supplied section order.


## Verification

`npm install`, `npm run build` and `npm run typecheck` passed. Browser QA checked desktop at 1536px and mobile at 390px: no horizontal overflow, all anchor targets exist, mobile menu opens and closes on selection, contact disclosure opens, and no browser console errors or warnings were captured. The desktop page measured about 1040px tall against the supplied 1024px reference. Reduced-motion logic was verified in source and loaded CSS; OS preference emulation was unavailable, so it was not dynamically tested. Recheck the configured email and final assets before publishing.

## V1.6 EmailJS enquiries

See [contact setup](docs/contact-setup.md) for public environment variables, EmailJS template configuration and delivery verification. V1.6 supersedes the V1.5 Resend backend; the contact modal now uses EmailJS directly. WhatsApp and direct email remain available.

## V1.8 About page

The dedicated /about page reuses the shared header, footer and contact modal. Company aspirations and values are editable in src/config/about.ts; existing service descriptions remain in src/config/company.ts. No router dependency is required: the page is selected by pathname and loaded separately. Two exact Vercel rewrites support direct refresh of /about and /about/. Homepage anchors are resolved from either page. Run node --test tests/*.test.mjs for contact and navigation checks.

## V2.1 Carbon Black + Electric Blue

All UI color values are centralized in src/tokens.css. Electric Blue is used for accents and CTA surfaces with Carbon Black labels; darker accent-text and lighter accent-soft tokens provide AA text contrast on light and dark surfaces. Original photography is unchanged. The currently approved metallic logo and favicon are raster assets and remain intact. Older SVG logos in public/assets use a different monogram and are retained only as originals; a matching editable source of the final metallic logo is needed for a faithful blue/white variant. No CSS image recoloring filter is applied. The social preview SVG uses the new palette.
