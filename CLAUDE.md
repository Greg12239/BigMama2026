# Big Mama Burgers n' Fries — Claude Code notes

`AGENTS.md` is authoritative and strict: inspect → plan → wait for "APPROVED — PROCEED" → edit narrowly → verify → report. Nothing here overrides it. Deeper map: `docs/CODEBASE_MAP.md` (read on demand only; verify against source).

## Architecture (verified)
- Next.js 16 App Router, React 19, TypeScript, `motion`. `next.config.mjs` uses `output: "export"` (static site), unoptimized images.
- Hybrid: the page body is the LEGACY `index.html`, injected by `src/lib/legacy-markup.ts` via `LegacyPageMarkup`. Legacy JS (`app.js`, `reviews-orbit.js`) is loaded by `src/components/runtime/LegacyRuntime.tsx` after Leaflet loads from unpkg.
- `src/app/page.tsx` renders: `LegacyPageMarkup` → `HeroMotion` (`components/sections/Hero.tsx`) → `LegacyRuntime`.
- Styles: `src/app/globals.css` imports root `styles.css` and `reviews-orbit.css`. Legal pages use `legal.css`.
- Routes: `/`, `/privacy-policy`, `/cookie-policy`. Cookie consent: `components/consent/ConsentManager.tsx`.
- SEO/metadata and Restaurant JSON-LD: `src/app/layout.tsx`; research data in `seo/*.json`.

## Commands
- `npm run dev` · `npm run typecheck` · `npm run lint` · `npm run build` · `npm run preview`
- Baseline diff: `bash scripts/check-baseline-diff.sh`; restore: `scripts/restore-approved-baseline.sh`.
- No automated test suite exists; verification = typecheck + lint + build + manual browser check.

## Protected (do not change unless explicitly asked)
Main menu layout, MENU nav button, category tabs, hero, brand typography, neon-orange identity, existing animations/scroll behavior, assets in `public/assets`, `.approved-baseline/`, `.codex-skills/`, `codex-prompts/`, `docs/` (except requested files).
Never add fake reviews, ratings, phone, address, hours or map links. No new runtime libraries without approval.

## Working rules
- Root `index.html`, `styles.css`, `app.js` are large (about 7k lines of CSS): search with Grep, read ranges only.
- The working tree may hold uncommitted user edits. Never revert, commit or push unasked.
- Keep hydration stable: legacy markup is raw HTML, so changes to it affect SSR output.
- Report: files changed, root cause/change, verification evidence, remaining risks.
