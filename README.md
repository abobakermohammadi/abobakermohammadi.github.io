# Abobaker Mohammadi — build universe

This repository is the static source for `abobakermohammadi.github.io`: one public home for verified products, apps, business systems and experiments built by Abobaker Mohammadi.

## Product rule

The site is not a résumé and it is not an automated dump of every repository.

A project is promoted to a full case study only when the available repository/product evidence is strong enough to describe the current surface without inventing functionality, status, metrics, clients, revenue, screenshots or outcomes.

Thin ideas can appear in the Build Ledger as **seeds** instead of being inflated into fake case studies.

## Current featured set

- SprachPrep — education product across web and native iOS work
- MAMELAT — Turkish-first Istanbul real-estate experience
- NEWAPP — native iPhone book-discovery experiment
- AEGIS — accountable agent mission system
- Sineklik İstanbul — local-business website and operating system
- AUREL Beauty Edit — editorial beauty discovery / affiliate experiment

`data/projects.json` is the machine-readable manifest for the portfolio's current truth state.

## Information architecture

- `/` — master experience, project atlas, project lens, timeline, Proof Mode
- `/projects/<slug>/` — project-specific case-study worlds
- `/ledger/` — promoted work vs seeds
- `/data/projects.json` — machine-readable project truth
- `/contact/` — public contact route
- `/404.html` — branded missing-route state

## Interaction system

`app.js` owns shared behavior:

- Cmd/Ctrl + K project search
- keyboard-safe search dialog and focus restoration
- Build Atlas filters
- homepage project lens
- persistent Proof Mode
- route-aware project interaction lenses
- motion that respects `prefers-reduced-motion`
- pointer tilt only on fine-pointer devices

`styles.css` owns the base visual system. `proof.css` contains Proof Mode, accessibility focus states and the shared interactive case-study lens.

## Truth / privacy boundaries

- Public repositories may be linked directly.
- Private repository contents are never exposed merely to make a case study look more detailed.
- Private contact data is not published by the portfolio.
- Real external product media is used only when it is already part of a verified project implementation or public project asset.
- No fake customer quotes, revenue, downloads, user counts or fabricated screenshots.

## Local preview

The site is deliberately dependency-free static HTML/CSS/JS.

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.

## Manual verification checklist

Before treating a release as finished:

1. Open every route in `sitemap.xml`.
2. Exercise Cmd/Ctrl + K, Escape, arrow-key result navigation and focus restoration.
3. Toggle Proof Mode and refresh to verify persistence.
4. Filter the Build Atlas.
5. Switch every project lens on desktop and mobile widths.
6. Check reduced-motion behavior.
7. Check all previous/next project links.
8. Verify public repository links and external media.
9. Search the repository for `TODO`, `FIXME`, `Lorem`, `placeholder`, `dummy` and `stub`.
10. Confirm retired legacy routes redirect to `/` and remain `noindex`.

## Deployment

GitHub Pages serves the repository. Repository content and commits can be verified through GitHub, but a commit alone is not proof that the Pages edge has finished publishing or that the live render has passed visual browser QA.
