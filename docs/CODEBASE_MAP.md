# Codebase Map (on-demand reference)

Snapshot verified 2026-11-04. Re-verify against source before relying on it.

## Entry points
| File | Role |
|---|---|
| `src/app/layout.tsx` | Root layout, metadata, Restaurant JSON-LD, mounts `ConsentManager`, imports `globals.css` |
| `src/app/page.tsx` | Home: `LegacyPageMarkup` → `HeroMotion` → `LegacyRuntime` |
| `src/app/privacy-policy/page.tsx`, `src/app/cookie-policy/page.tsx` | Legal routes (use `components/legal/LegalPage.tsx`, `legal.css`) |
| `index.html` | Legacy page; its `<body>` is extracted at build time |
| `app.js` (~2.5k lines) | Legacy runtime: menu, interactions, observers |
| `reviews-orbit.js` / `reviews-orbit.css` | Reviews orbit section |

## Component ownership
- `src/lib/legacy-markup.ts`: reads `index.html`, strips `<script>`, rewrites `public/assets/` → `/assets/`.
- `src/components/LegacyPageMarkup.tsx`: `dangerouslySetInnerHTML` of that markup.
- `src/components/runtime/LegacyRuntime.tsx` (client): loads Leaflet 1.9.4 (unpkg, SRI), then dynamically imports `app.js` then `reviews-orbit.js`; guarded by `window.__bigMamaRuntimeStarted`.
- `src/components/sections/Hero.tsx` + `hero/KineticBrandmark.tsx`: React/`motion` hero.
- `src/components/consent/ConsentManager.tsx`: cookie consent.

## Stylesheets
`src/app/globals.css` imports `../../styles.css` (~7k lines, main) and `../../reviews-orbit.css`. `legal.css` for legal pages.

## Animation ownership
- `motion`: `Hero.tsx`, `KineticBrandmark.tsx`.
- Legacy JS/CSS (`app.js`, `styles.css`, `reviews-orbit.*`): IntersectionObserver reveals and CSS animations. No GSAP installed.

## Build / config
`next.config.mjs` (static export), `tsconfig.json`, `eslint.config.mjs`, `package.json` scripts: dev, typecheck, lint, build, preview.

## Tooling & data
- `scripts/`: `check-baseline-diff.sh`, `restore-approved-baseline.sh`, `normalize-menu-assets.py`, `preview.mjs`, `seo/`.
- `seo/*.json`: SEO research and data (`menu.json`, `business.json`, ...).
- `.approved-baseline/`: source-of-truth copies of `index.html`, `styles.css`, `app.js`, `README.md`.
- Assets: `public/assets/` (menu images under `menu/normalized/`).

## Tests
None exist. Use `npm run typecheck`, `npm run lint`, `npm run build`, plus manual checks.
