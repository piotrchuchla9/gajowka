# gajówka w drodze — site

Astro + React + Tailwind + Contentful + MapLibre.

## Quick start

```bash
cd site
npm install
cp .env.example .env   # uzupełnij tokens
npm run dev
```

Dev server: <http://localhost:4321>

Bez `.env` strona też działa — używa fallback danych z `src/lib/fallback.ts`.

## Stack

- **Astro 5** — SSG, React islands
- **React 19 + Framer Motion** — animowane sekcje (Stats counter, mapa)
- **Tailwind 3** — design system w `tailwind.config.mjs`
- **Contentful** — CMS (zobacz `CONTENTFUL.md`)
- **MapLibre + Maptiler** — mapa świata na `/mapa`
- **Vercel adapter** — deploy target

## Struktura

```
site/
├── CONTENTFUL.md           # schema content models (do założenia w UI)
├── astro.config.mjs
├── tailwind.config.mjs
├── public/                 # favicon, assets statyczne
└── src/
    ├── layouts/Layout.astro
    ├── components/
    │   ├── Nav.astro
    │   ├── Footer.astro
    │   ├── Hero.astro
    │   ├── Stats.tsx            ← React island (count-up)
    │   ├── LatestTrips.astro
    │   ├── MapTeaser.astro
    │   ├── Countries.astro
    │   ├── About.astro
    │   ├── Newsletter.astro
    │   ├── TripCard.astro
    │   └── WorldMap.tsx         ← React island (MapLibre)
    ├── lib/
    │   ├── contentful.ts        # client + queries + types
    │   └── fallback.ts          # placeholder dane
    ├── pages/
    │   ├── index.astro          # /
    │   ├── mapa.astro           # /mapa
    │   ├── o-mnie.astro         # /o-mnie
    │   ├── [country]/
    │   │   ├── index.astro      # /gruzja
    │   │   └── [region].astro   # /gruzja/swaneti
    │   └── podroze/
    │       └── [slug].astro     # /podroze/mestia-trekking
    └── styles/global.css
```

## Setup krok po kroku

### 1. Contentful

Załóż content models wg `CONTENTFUL.md` (API IDs muszą się zgadzać 1:1).

Wklej tokeny do `.env`:
```
CONTENTFUL_SPACE_ID=xxx
CONTENTFUL_ACCESS_TOKEN=xxx
CONTENTFUL_PREVIEW_TOKEN=xxx
CONTENTFUL_ENVIRONMENT=master
```

### 2. Maptiler

<https://cloud.maptiler.com/> → free tier → API key:
```
PUBLIC_MAPTILER_KEY=xxx
```

Bez klucza mapa fallback do tile OpenStreetMap.

### 3. Deploy Vercel

```bash
npx vercel link
npx vercel --prod
```

Lub Git push → import w Vercel UI.

Env vars: skopiuj `.env` → Vercel Project Settings → Environment Variables.

### 4. Webhook rebuild

Contentful → Webhooks → URL deploy hooka z Vercel → triggery na publish/unpublish (`trip`, `country`, `region`, `siteSettings`).

## Animacje / interakcje

- Hero — Ken Burns + fade-up (CSS only)
- Stats — count-up przy scroll (Framer Motion + `useInView`)
- Karty — hover scale + sepia transition (Tailwind)
- Reveal — IntersectionObserver w `Layout.astro`, atrybut `data-reveal`
- Mapa — MapLibre + custom markery, fly-to przy klik

## Skrypty

```bash
npm run dev       # dev server
npm run build     # build produkcyjny → dist/ + .vercel/output
npm run preview   # podgląd buildu lokalnie
```

## Notes

- Wszystkie strony **statyczne** (`output: 'static'`). Webhook z Contentful triggeruje rebuild na Vercelu.
- Obrazki z Contentful używają Images API (resize on-the-fly) — patrz `assetUrl()` w `contentful.ts`.
- Fallback dane zostają dopóki Contentful nie ma `trip` entries → płynne przejście.
- Newsletter form jest mockiem (alert). Podłącz MailerLite / Buttondown przed publikacją.
