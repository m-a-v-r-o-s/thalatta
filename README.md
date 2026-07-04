# Thalatta Bay Resort & Spa

A sample five-star seafront resort website — built as a portfolio / demo piece for **Akos Digital**.

Fictional luxury resort in Elounda, Crete. Multilingual, with a working demo booking flow and Stripe test-mode payments.

> Sample site. All images and copy are placeholders. Images are AI-generated, royalty-free stock from [Lummi](https://www.lummi.ai).

---

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS**
- **next-intl** — four languages: English, Greek, German, French
- **Stripe** — test-mode Payment Element, with a simulated fallback so the demo runs with zero configuration

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you'll be redirected to `/en`. Switch languages from the header (EN · ΕΛ · DE · FR).

Production build:

```bash
npm run build && npm start
```

## Stripe (optional)

The booking flow works out of the box in **simulated mode** — no keys needed. To enable the real Stripe test-mode Payment Element:

1. Copy `.env.example` to `.env`
2. Add your Stripe **test** keys (from https://dashboard.stripe.com/test/apikeys):

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

3. Restart. Pay with test card `4242 4242 4242 4242`, any future expiry, any CVC. No real charge is made.

## Project structure

```
src/
  app/[locale]/          Localised routes (home, rooms, dining, spa, gallery, booking, contact)
  app/[locale]/dining/[slug]/   Individual venue pages
  app/api/create-payment-intent Stripe PaymentIntent endpoint (+ simulated fallback)
  components/            Header, Footer, CookieConsent, BookingWizard, PaymentStep, …
  i18n/                  next-intl routing / navigation / request config
  lib/images.ts          Central image manifest — swap artwork here
  lib/content.ts         Rooms, venues, hotel details
messages/                en.json · el.json · de.json · fr.json (identical key sets)
```

## Customising

- **Images** — edit `src/lib/images.ts`. Paste a new Lummi asset hash, or drop files into `/public/images` and point a value at `/images/your-file.jpg`.
- **Copy / translations** — edit `messages/*.json`. All four files share the same keys.
- **Rooms, venues, prices** — `src/lib/content.ts`.
- **Colours & fonts** — `tailwind.config.ts` and `src/app/globals.css`.

## Notes

- The cookie banner is intentionally kept in **Greek** across all locales, with a working accept / reject / manage-preferences flow. Consent persists in `localStorage` and gates a mock analytics loader.
- Contact form and booking confirmation are front-end demos — no data is sent or stored.
