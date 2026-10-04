# Portfolio Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current single-page Qarumi portfolio into a clean multi-page portfolio platform with case studies, Lab, command navigation, GitHub Pulse, Resume, developer terminal, analytics/privacy controls, and preserved seasonal visuals.

**Architecture:** Keep the existing React/Vite application and add React Router with two layouts: `SiteLayout` for the normal portfolio experience and `ResumeLayout` for the strict CV view. Shared registries own projects, technologies, social links, commands, routes and content references; browser-only integrations such as analytics, GitHub API access and seasonal overrides are isolated behind small services/contexts. GitHub Pages direct routes are handled by a post-build route-entry generator.

**Tech Stack:** React 19, Vite 8, React Router, CSS, Node built-in test runner, GitHub Pages, Google Analytics 4, Yandex Metrica.

**Spec:** `docs/superpowers/specs/2026-10-04-portfolio-expansion-design.md`

## Global Constraints

- Work directly on `main`; use small local commits and one final push after the feature batch is verified.
- The user edits/runs/commits locally in VS Code/PowerShell; do not modify or push the repository remotely on their behalf.
- Preserve the existing dark purple/cyan Qarumi visual identity.
- Existing RU/EN switching stays on the same URL; do not create `/ru` or `/en` routes.
- Normal seasonal selection remains automatic; there is no visible season switcher.
- `?season=` remains the highest-priority season override for testing.
- Resume must not render seasonal effects, parallax, normal Header, or decorative reveal animations.
- No backend, SSR, authentication, contact-form backend, AI chatbot, visitor counter, music player, or secret frontend credentials.
- No `eval` or dynamic shell/code execution in Developer Terminal.
- Optional analytics must not load before the required consent is granted.
- Keep `prefers-reduced-motion` behavior across all new animations/effects.
- Do not invent confidential commercial-project details, QRumiX claims, resume history, social addresses, or contact data.

## Content / Configuration Gates

These do not block foundation work, but the relevant task must not fabricate missing values.

- Social task: user supplies exact Telegram/email/other public links before they are exposed.
- QRumiX case-study task: user supplies or approves factual case-study copy, screenshots, links and architecture claims; unavailable sections are omitted.
- Resume task: user supplies/approves actual role wording, experience dates/details, education/learning, languages and contact fields.
- Analytics task: user supplies GA4 Measurement ID and Yandex Metrica counter ID before production verification.
- Lab task: first experiment is `particle-field`; additional experiments are added only after their actual implementation exists.

## Plan Setup

Save this file as:

```text
docs/superpowers/plans/2026-10-04-portfolio-expansion-implementation-plan.md
```

Before Task 01, commit the approved design spec and this plan so implementation history starts from a clean documentation checkpoint:

```powershell
git add docs/superpowers/specs/2026-10-04-portfolio-expansion-design.md docs/superpowers/plans/2026-10-04-portfolio-expansion-implementation-plan.md
git commit -m "Add portfolio expansion design and implementation plan"
```

Do not push yet.

## Progress Tracker

Update these checkboxes as implementation proceeds. The last checked task is the exact restart point.

- [ ] 01 — Routing foundation
- [ ] 02 — Route-aware navigation and reveal lifecycle
- [ ] 03 — GitHub Pages route-entry generation
- [ ] 04 — Canonical project and technology data
- [ ] 05 — Social/contact registry and UI
- [ ] 06 — Consent and privacy foundation
- [ ] 07 — GA4 + Yandex Metrica integration
- [ ] 08 — Shared command system
- [ ] 09 — Command Palette
- [ ] 10 — Tech Stack → Projects filtering
- [ ] 11 — Project case-study framework
- [ ] 12 — QRumiX flagship case study
- [ ] 13 — Qarumi Lab platform
- [ ] 14 — First Lab experiment: Particle Field
- [ ] 15 — GitHub Pulse
- [ ] 16 — Resume
- [ ] 17 — Developer Terminal
- [ ] 18 — Session season override
- [ ] 19 — Route SEO metadata and final route generation
- [ ] 20 — Accessibility/performance/final verification

## Review Focus

1. **Direct-route refreshes:** known routes must boot the app from GitHub Pages; unknown routes must boot the branded 404 instead of failing to load assets. Pinned by Tasks 03 and 19.
2. **URL-state coexistence:** `?tech=...`, `?season=...`, hashes and unknown parameters must not corrupt each other; invalid technology/season values must fall back safely. Pinned by Tasks 10 and 18.
3. **Consent gating:** GA4/Yandex scripts and event sends must remain inactive before opt-in, and rejecting/revoking optional tracking must prevent future sends. Pinned by Tasks 06 and 07.
4. **Global shortcut safety:** Command Palette/Terminal shortcuts must not fire while the visitor is typing in form or content-editable fields. Pinned by the keyboard tests in Tasks 09 and 17; focus-trap/restoration behavior remains in the manual accessibility matrix.
5. **External-service failure:** malformed cache, API timeout, GitHub rate limit, analytics blocking and missing IDs must leave a functional portfolio with local fallback. Pinned by Tasks 07 and 15.

---

### Task 01: Routing Foundation

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/main.jsx`
- Modify: `src/App.jsx`
- Create: `src/layouts/SiteLayout.jsx`
- Create: `src/layouts/ResumeLayout.jsx`
- Create: `src/pages/HomePage.jsx`
- Create: `src/pages/NotFoundPage.jsx`
- Create: `src/router/routeConfig.js`
- Test: `tests/routeConfig.test.js`

**Interfaces:**
- Consumes: existing `Header`, `Footer`, `SeasonalBackground`, homepage section components and `LanguageProvider`.
- Produces: `routePaths`, `isKnownTopLevelRoute(pathname)`, `SiteLayout`, `ResumeLayout`, and React Router route skeleton used by all later page tasks.

- [ ] **Step 1: Write the failing route-config test**

Create `tests/routeConfig.test.js` asserting:
- `routePaths.home === '/'`
- `routePaths.lab === '/lab'`
- `routePaths.resume === '/resume'`
- `routePaths.privacy === '/privacy'`
- `routePaths.project('qrumix') === '/projects/qrumix'`
- `routePaths.labExperiment('particle-field') === '/lab/particle-field'`

- [ ] **Step 2: Verify the new test fails**

Run:

```powershell
npm test
```

Expected: FAIL because `src/router/routeConfig.js` does not exist.

- [ ] **Step 3: Install React Router**

Run:

```powershell
npm install react-router-dom
```

Expected: `react-router-dom` added to `dependencies`; lockfile updated.

- [ ] **Step 4: Implement `src/router/routeConfig.js`**

Export:
- `routePaths.home`
- `routePaths.lab`
- `routePaths.resume`
- `routePaths.privacy`
- `routePaths.project(slug)`
- `routePaths.labExperiment(slug)`

Keep it browser-independent so Node tests and build scripts can import it.

- [ ] **Step 5: Split the current App into route/page/layout responsibilities**

`HomePage.jsx` renders the existing homepage sequence.

`SiteLayout.jsx` renders:

```text
SeasonalBackground
Header
Outlet
Footer
```

`ResumeLayout.jsx` renders only `<Outlet />` for now; Resume UI arrives in Task 16.

`NotFoundPage.jsx` renders a minimal branded 404 with links to `/` and `/#projects`.

`App.jsx` becomes the route tree using `Routes`/`Route`.

At this task, mount only:
- `/` → `HomePage` inside `SiteLayout`
- `*` → `NotFoundPage` inside `SiteLayout`

Create `ResumeLayout` now but do not mount `/resume` until Task 16. Later substantial pages may use `lazy()`.

- [ ] **Step 6: Wrap the application with `BrowserRouter`**

In `src/main.jsx`, keep `LanguageProvider` and place `BrowserRouter` inside it so routing is available to the app.

- [ ] **Step 7: Verify**

Run:

```powershell
npm test
npm run lint
npm run build
npm run dev
```

Manually verify `/` still looks and behaves like the current homepage and an unknown Vite-dev path renders the branded 404.

- [ ] **Step 8: Commit**

```powershell
git add package.json package-lock.json src/main.jsx src/App.jsx src/layouts src/pages src/router tests/routeConfig.test.js
git commit -m "Add portfolio routing foundation"
```

---

### Task 02: Route-Aware Navigation and Reveal Lifecycle

**Files:**
- Modify: `src/components/Header.jsx`
- Modify: `src/hooks/useScrollReveal.js`
- Create: `src/router/RouteScrollManager.jsx`
- Create: `src/utils/navigation.js`
- Modify: `src/layouts/SiteLayout.jsx`
- Test: `tests/navigation.test.js`

**Interfaces:**
- Consumes: `routePaths` from Task 01.
- Produces: `getHomeSectionTarget(sectionId)`, route/hash scrolling behavior, and reveal reinitialization on route changes.

- [ ] **Step 1: Write failing navigation tests**

Assert:
- `getHomeSectionTarget('about')` produces `/#about`.
- `getHomeSectionTarget('projects', { tech: 'react' })` produces `/?tech=react#projects`.
- empty/undefined optional query does not produce a dangling `?`.

- [ ] **Step 2: Run `npm test` and confirm failure**

- [ ] **Step 3: Implement `src/utils/navigation.js`**

Export:

```js
getHomeSectionTarget(sectionId, options = {})
```

It must construct query before hash and preserve only explicitly supplied supported query values.

- [ ] **Step 4: Add `RouteScrollManager.jsx`**

Use `useLocation()`.

Behavior:
- if `location.hash` exists, find that element after route render and `scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })`;
- otherwise scroll to top on pathname changes;
- do not fight normal back/forward scrolling more than necessary.

- [ ] **Step 5: Make Header route-aware**

Replace raw `href="#"`/`href="#section"` assumptions with React Router navigation:
- logo → `/`
- About → `/#about`
- Stack → `/#stack`
- Projects → `/#projects`
- Contact → `/#contact`

Active-section scroll calculation runs only when `location.pathname === '/'`; internal pages should not falsely mark Contact active.

Keep mobile-menu closing and body-overflow cleanup.

- [ ] **Step 6: Re-run scroll reveal when route content changes**

Change:

```js
useScrollReveal()
```

to accept a refresh key:

```js
useScrollReveal(refreshKey)
```

and include it in the effect dependency list.

`SiteLayout` passes `location.pathname`.

- [ ] **Step 7: Verify**

Run tests/lint/build.

Manual:
- from `/`, section nav scrolls without page reload;
- from a fake internal route or 404, clicking Projects returns to `/#projects`;
- browser back/forward remains usable;
- reveal elements on a newly navigated page become visible.

- [ ] **Step 8: Commit**

```powershell
git add src/components/Header.jsx src/hooks/useScrollReveal.js src/router/RouteScrollManager.jsx src/utils/navigation.js src/layouts/SiteLayout.jsx tests/navigation.test.js
git commit -m "Make navigation route aware"
```

---

### Task 03: GitHub Pages Route-Entry Generation

**Files:**
- Create: `src/data/staticRoutes.js`
- Create: `scripts/generate-route-entries.mjs`
- Modify: `package.json`
- Test: `tests/staticRoutes.test.js`
- Test: `tests/generateRouteEntries.test.js`

**Interfaces:**
- Consumes: `routePaths`.
- Produces: `staticRoutes`, `renderRouteHtml(baseHtml, metadata)`, `routeOutputPath(route)`, and post-build `dist/<route>/index.html` plus `dist/404.html`.

- [ ] **Step 1: Write failing tests**

`staticRoutes.test.js` asserts the initial registry is valid and duplicate route paths are rejected by a validation helper.

`generateRouteEntries.test.js` uses fixture routes and asserts:
- `/privacy` maps to `privacy/index.html`;
- `/projects/qrumix` maps to `projects/qrumix/index.html`;
- route output never escapes `dist`;
- 404 HTML can receive `noindex`.

- [ ] **Step 2: Verify failure**

Run `npm test`.

- [ ] **Step 3: Implement the static-route registry**

Start with an empty `staticRoutes` array because no new direct route has shipped yet. Tasks that add real pages append their own route metadata.

Each future record:

```js
{
  path,
  title,
  description,
  robots
}
```

- [ ] **Step 4: Implement `scripts/generate-route-entries.mjs`**

After Vite build:
- read `dist/index.html`;
- create directories for every `staticRoutes` entry;
- inject route-specific title/description/robots/canonical/OG URL;
- write `<route>/index.html`;
- write `dist/404.html` with app bootstrap and `noindex`;
- never rewrite asset URLs to relative paths.

Export pure helpers for tests and run filesystem writes only when executed as the script entry point.

- [ ] **Step 5: Update the build script**

Change:

```json
"build": "vite build"
```

to:

```json
"build": "vite build && node scripts/generate-route-entries.mjs"
```

No deploy-workflow change is needed for route generation because the existing workflow already runs `npm run build` and uploads `dist`.

- [ ] **Step 6: Verify generated files**

Run:

```powershell
npm test
npm run build
Test-Path dist\404.html
```

Expected: `dist\404.html` exists. Route-specific files appear only after the corresponding page task registers them.

- [ ] **Step 7: Commit**

```powershell
git add src/data/staticRoutes.js scripts/generate-route-entries.mjs package.json tests/staticRoutes.test.js tests/generateRouteEntries.test.js
git commit -m "Add GitHub Pages route generation"
```

---

### Task 04: Canonical Project and Technology Data

**Files:**
- Create: `src/data/technologies.js`
- Modify: `src/data/projects.js`
- Modify: `src/components/TechStack.jsx`
- Modify: `src/components/Projects.jsx`
- Test: `tests/technologies.test.js`
- Test: `tests/projects.test.js`

**Interfaces:**
- Produces:
  - `technologies` keyed by stable IDs
  - `technologyGroups`
  - `getTechnology(id)`
  - `projects`
  - `getProjectById(id)`
  - `getProjectsByType(type)`
- All later features use technology IDs and project IDs instead of duplicated display strings.

- [ ] **Step 1: Write failing data-integrity tests**

Assert:
- every project ID is unique;
- every technology ID used by a project exists in `technologies`;
- every `technologyGroups` entry references a known technology;
- `getProjectById('qrumix')` returns QRumiX;
- unknown project/technology lookups return `null` rather than throwing.

- [ ] **Step 2: Verify failure**

- [ ] **Step 3: Build `technologies.js`**

Include canonical IDs for all technology names currently present in `TechStack.jsx` and `projects.js`.

Example:

```js
react -> React
django-rest-framework -> Django REST Framework
html -> HTML
css -> CSS
```

Do not translate technology product names.

- [ ] **Step 4: Normalize `projects.js`**

Use one `projects` array with:

```text
id
title
type
technologies
repository
isPrivate
caseStudySlug (optional)
```

Preserve the current project inventory and public/private status.

- [ ] **Step 5: Update TechStack and Projects rendering**

Resolve labels through `getTechnology()`.

Keep the existing page appearance at this task; interactivity arrives in Task 10.

- [ ] **Step 6: Verify**

Run tests/lint/build and manually compare all current project/stack labels against the live pre-change layout.

- [ ] **Step 7: Commit**

```powershell
git add src/data/technologies.js src/data/projects.js src/components/TechStack.jsx src/components/Projects.jsx tests/technologies.test.js tests/projects.test.js
git commit -m "Normalize project technology data"
```

---

### Task 05: Social / Contact Registry and UI

**Files:**
- Create: `src/data/socialLinks.js`
- Modify: `src/components/Contact.jsx`
- Modify: `src/components/Footer.jsx`
- Modify: `src/i18n/translations.js`
- Modify: `src/index.css`
- Create: `src/utils/clipboard.js`
- Test: `tests/socialLinks.test.js`

**Interfaces:**
- Produces `socialLinks`, `getSocialLinksFor(surface)`, and `copyText(text)`.
- Later Resume, Command Palette and Terminal consume the same social registry.

- [ ] **Step 1: Write failing social-registry tests**

Assert:
- all link IDs are unique;
- GitHub is present with `https://github.com/Koneky`;
- surface filtering respects `showInContact`, `showInFooter`, `showInResume`, `showInCommands`;
- external links are distinguishable from `mailto:` actions.

- [ ] **Step 2: Verify failure**

- [ ] **Step 3: Create the registry**

Add GitHub immediately.

Add Telegram/email only after the user supplies exact values. Do not fabricate placeholders that render publicly.

- [ ] **Step 4: Add clipboard helper**

`copyText(text)` returns a Promise and uses `navigator.clipboard.writeText` when available. UI must handle failure without crashing.

- [ ] **Step 5: Refactor Contact and Footer**

Contact renders registry-driven links and supports `Copy email` only when an email entry exists.

Footer renders compact social links plus future Privacy/Cookie settings hooks without duplicating hardcoded URLs.

- [ ] **Step 6: Add RU/EN copy and styles**

Keep labels concise and use existing visual language.

- [ ] **Step 7: Verify and commit**

```powershell
npm test
npm run lint
npm run build
git add src/data/socialLinks.js src/components/Contact.jsx src/components/Footer.jsx src/i18n/translations.js src/index.css src/utils/clipboard.js tests/socialLinks.test.js
git commit -m "Add shared social contact data"
```

---

### Task 06: Consent and Privacy Foundation

**Files:**
- Create: `src/context/ConsentContext.jsx`
- Create: `src/context/ConsentProvider.jsx`
- Create: `src/context/useConsent.js`
- Create: `src/utils/consent.js`
- Create: `src/components/consent/CookieBanner.jsx`
- Create: `src/components/consent/CookiePreferences.jsx`
- Create: `src/components/consent/consent.css`
- Create: `src/pages/PrivacyPage.jsx`
- Create: `src/pages/privacy.css`
- Modify: `src/App.jsx`
- Modify: `src/main.jsx`
- Modify: `src/components/Footer.jsx`
- Modify: `src/data/staticRoutes.js`
- Modify: `src/i18n/translations.js`
- Test: `tests/consent.test.js`

**Interfaces:**
- Produces `CONSENT_STORAGE_KEY = 'qarumi-consent-v1'`, `normalizeConsent()`, `readConsent()`, `writeConsent()`, and `useConsent()`.
- Consent value:

```js
{
  version: 1,
  analytics: boolean,
  behaviorAnalytics: boolean
}
```

`behaviorAnalytics: true` is invalid when `analytics: false`; normalization forces behavior analytics off.

- [ ] **Step 1: Write failing consent tests**

Assert:
- absent storage resolves to `null`/undecided;
- invalid JSON resolves safely to undecided;
- reject optional → both false;
- accept all → both true;
- `{ analytics:false, behaviorAnalytics:true }` normalizes behavior analytics to false;
- unknown extra fields are ignored.

- [ ] **Step 2: Verify failure**

- [ ] **Step 3: Implement consent utilities/context**

Necessary functionality is always available.

Do not treat language preference or consent preference itself as optional analytics.

- [ ] **Step 4: Implement Cookie Banner**

First undecided visit shows:
- Accept all
- Reject optional
- Settings

Accept/reject choices must have comparable prominence.

- [ ] **Step 5: Implement preferences UI**

Allow toggling:
- Analytics
- Behavior analytics

Behavior analytics is disabled when Analytics is off.

Footer permanently exposes:
- Cookie settings
- Privacy

- [ ] **Step 6: Implement `/privacy`**

Explain actual intended providers and categories without claiming IDs/services are active when configuration is absent.

Add `/privacy` to React routes and `staticRoutes`.

- [ ] **Step 7: Verify**

Manual:
- clean localStorage → banner appears;
- reject → banner stays gone after reload and settings show both optional categories off;
- accept → both on;
- settings can change preference;
- keyboard-only use works;
- Resume route (once implemented) will inherit root consent UI because provider/banner live outside visual layouts.

- [ ] **Step 8: Commit**

```powershell
git add src/context/Consent* src/context/useConsent.js src/utils/consent.js src/components/consent src/pages/PrivacyPage.jsx src/pages/privacy.css src/App.jsx src/main.jsx src/components/Footer.jsx src/data/staticRoutes.js src/i18n/translations.js tests/consent.test.js
git commit -m "Add analytics consent controls"
```

---

### Task 07: GA4 + Yandex Metrica Integration

**Files:**
- Create: `.env.example`
- Create: `src/analytics/config.js`
- Create: `src/analytics/analytics.js`
- Create: `src/analytics/GoogleAnalytics.jsx`
- Create: `src/analytics/YandexMetrica.jsx`
- Create: `src/analytics/AnalyticsManager.jsx`
- Modify: `src/App.jsx`
- Modify: `.github/workflows/deploy.yml`
- Test: `tests/analytics.test.js`

**Interfaces:**
- Produces:
  - `getAnalyticsConfig(env)`
  - `normalizeAnalyticsEvent(name, params)`
  - `trackEvent(name, params = {})`
  - `trackPageView(pathname)`
- Consumes `useConsent()` and React Router location.

- [ ] **Step 1: Write failing analytics tests**

Assert:
- missing IDs result in disabled providers, not an exception;
- development mode disables provider loading;
- event normalizer rejects arbitrary free-form terminal/search text fields;
- pathname tracking excludes hash and raw query values;
- no event is sent through adapters when analytics consent is false.

- [ ] **Step 2: Verify failure**

- [ ] **Step 3: Add env configuration**

`.env.example`:

```text
VITE_GA_ID=
VITE_YM_ID=
```

Do not commit real secret material. Measurement/counter IDs may be provided through GitHub Actions repository variables.

- [ ] **Step 4: Implement provider components**

Rules:
- no provider script injection in development;
- no provider script injection before `consent.analytics === true`;
- Yandex Webvisor/session replay enabled only when `consent.behaviorAnalytics === true`;
- provider script failure is silent from the visitor's perspective;
- never block route rendering.

- [ ] **Step 5: Implement route page views**

`AnalyticsManager` watches `location.pathname`.

On provider initialization after consent, send the current page view once.

Do not treat hash scrolling as a new page.

- [ ] **Step 6: Add deployment env wiring**

In the build step, expose repository variables:

```yaml
env:
  VITE_GA_ID: ${{ vars.VITE_GA_ID }}
  VITE_YM_ID: ${{ vars.VITE_YM_ID }}
```

- [ ] **Step 7: Verify**

Without IDs: build and app work.

With local test IDs in a temporary untracked `.env.local`: verify scripts appear only after consent.

Test reject/revoke path. If a provider has already been initialized and the visitor disables its consent category, save the new preference and reload the page once so stale provider code cannot continue tracking in the current SPA session. Where first-party analytics cookies can be identified safely, clear them on revocation; do not claim control over provider-side/third-party storage that the site cannot delete.

- [ ] **Step 8: Commit**

```powershell
git add .env.example src/analytics src/App.jsx .github/workflows/deploy.yml tests/analytics.test.js
git commit -m "Add consent gated analytics"
```

---

### Task 08: Shared Command System

**Files:**
- Create: `src/data/commands.js`
- Create: `src/commands/searchCommands.js`
- Create: `src/commands/executeCommand.js`
- Test: `tests/commands.test.js`

**Interfaces:**
- Produces:
  - command objects `{ id, labelKey, keywords, action, visibility }`
  - `searchCommands(commands, query)`
  - `executeCommand(command, adapters)`
- Visibility values:
  - `public`
  - `hidden-search`
  - `terminal-only`

- [ ] **Step 1: Write failing command tests**

Assert:
- exact label match ranks above starts-with, which ranks above includes, then keywords;
- public empty-query results do not include hidden/terminal-only commands;
- a synthetic `hidden-search` fixture is returned only when query explicitly matches its hidden keyword;
- synthetic terminal-only commands never appear in palette results;
- unknown command action throws a controlled developer error rather than silently executing arbitrary data.

- [ ] **Step 2: Verify failure**

- [ ] **Step 3: Create initial registry**

Include only actions that already lead somewhere at Task 08:
- About
- Projects
- GitHub
- Contact
- RU
- EN

If Telegram/email entries already exist in `socialLinks`, derive their palette actions from that registry rather than duplicating URLs.

QRumiX, Lab and Resume commands are added by the tasks that actually ship those routes (Tasks 12, 13 and 16), so the palette never contains a knowingly broken destination.

The search engine supports `hidden-search` and `terminal-only` visibility now, but do not register `Open terminal` until the Terminal actually exists in Task 17.

Do not add season commands to the palette registry.

- [ ] **Step 4: Implement search/scoring**

Normalize case/whitespace. No fuzzy dependency.

- [ ] **Step 5: Implement adapter-based execution**

Adapters may include:

```text
navigate
setLanguage
openExternal
copyText
openTerminal
```

The command module itself must not import browser globals directly.

- [ ] **Step 6: Verify and commit**

```powershell
npm test
npm run lint
git add src/data/commands.js src/commands tests/commands.test.js
git commit -m "Add shared command system"
```

---

### Task 09: Command Palette

**Files:**
- Create: `src/context/CommandUIContext.jsx`
- Create: `src/context/CommandUIProvider.jsx`
- Create: `src/context/useCommandUI.js`
- Create: `src/components/command-palette/CommandPalette.jsx`
- Create: `src/components/command-palette/commandPalette.css`
- Create: `src/utils/keyboard.js`
- Modify: `src/layouts/SiteLayout.jsx`
- Modify: `src/components/Header.jsx`
- Modify: `src/i18n/translations.js`
- Test: `tests/keyboard.test.js`

**Interfaces:**
- Produces `useCommandUI()` with `openPalette()` and `closePalette()`.
- Produces `isTypingTarget(target)` for global shortcut guards.
- Consumes Task 08 command registry/search/executor.

- [ ] **Step 1: Write failing keyboard tests**

Assert `isTypingTarget()` returns true for:
- `INPUT`
- `TEXTAREA`
- `SELECT`
- contenteditable elements

and false for ordinary buttons/divs/body.

- [ ] **Step 2: Verify failure**

- [ ] **Step 3: Implement CommandUI context and shortcut**

`Ctrl+K`/`Cmd+K` toggles/open palette only when the event target is not a typing target.

- [ ] **Step 4: Implement palette UI**

Required behavior:
- search field autofocus;
- ArrowUp/ArrowDown selection;
- Enter execute;
- Escape close;
- Tab focus remains inside overlay;
- closing restores focus to opener when possible;
- body scroll locked while open;
- mobile uses full-screen overlay.

- [ ] **Step 5: Add Header trigger**

Use an unobtrusive button, e.g. `⌘K`/`Ctrl K`, consistent with current header.

- [ ] **Step 6: Wire command execution and analytics-safe IDs**

When Task 07 analytics exists:
- `command_palette_open`
- `command_execute` with predefined command ID only

Never send typed search query.

- [ ] **Step 7: Manual verification**

Keyboard-only, mouse, mobile viewport, RU/EN, reduced motion, focus restore.

- [ ] **Step 8: Commit**

```powershell
git add src/context/CommandUI* src/context/useCommandUI.js src/components/command-palette src/utils/keyboard.js src/layouts/SiteLayout.jsx src/components/Header.jsx src/i18n/translations.js tests/keyboard.test.js
git commit -m "Add command palette"
```

---

### Task 10: Tech Stack → Projects Filtering

**Files:**
- Create: `src/utils/projectFilters.js`
- Modify: `src/components/TechStack.jsx`
- Modify: `src/components/Projects.jsx`
- Modify: `src/index.css`
- Test: `tests/projectFilters.test.js`

**Interfaces:**
- Produces:
  - `getTechnologyFilter(search)`
  - `filterProjectsByTechnology(projects, technologyId)`
  - `hasProjectsForTechnology(projects, technologyId)`
- Consumes canonical technology/project registries.

- [ ] **Step 1: Write failing filter tests**

Assert:
- `?tech=react` resolves to `react`;
- unknown tech resolves to `null`;
- `?season=winter&tech=react` still resolves to `react`;
- filtering returns only projects containing that technology ID;
- clearing tech leaves unrelated query parameters intact;
- no matches produces `[]` without throwing.

- [ ] **Step 2: Verify failure**

- [ ] **Step 3: Implement pure filter helpers**

Never parse the hash as part of the technology ID.

- [ ] **Step 4: Make TechStack items interactive only when useful**

A technology with public portfolio projects becomes a real `<button>`/`Link`.

Selecting it navigates to:

```text
/?tech=<id>#projects
```

Non-project technologies remain non-interactive visual chips.

- [ ] **Step 5: Filter Projects from URL state**

Show one active filter chip with clear action and visible result count.

Keep category headings sensible; categories with zero matches may be omitted while filtered.

- [ ] **Step 6: Track safe event**

`technology_filter` sends only the canonical technology ID.

- [ ] **Step 7: Verify and commit**

```powershell
npm test
npm run lint
npm run build
git add src/utils/projectFilters.js src/components/TechStack.jsx src/components/Projects.jsx src/index.css tests/projectFilters.test.js
git commit -m "Add project technology filtering"
```

---

### Task 11: Project Case-Study Framework

**Files:**
- Create: `src/data/caseStudies/index.js`
- Create: `src/pages/CaseStudyPage.jsx`
- Create: `src/pages/caseStudy.css`
- Create: `src/components/case-study/CaseStudyHero.jsx`
- Create: `src/components/case-study/CaseStudySection.jsx`
- Modify: `src/App.jsx`
- Modify: `src/components/Projects.jsx`
- Modify: `src/data/projects.js`
- Test: `tests/caseStudies.test.js`

**Interfaces:**
- Produces `getCaseStudyBySlug(slug)` and optional case-study section rendering.
- Case-study data shape supports:
  - `slug`
  - bilingual `title`, `summary`
  - `technologies`
  - optional `role`, `challenge`, `solution`, `architecture`, `gallery`, `results`, `links`

- [ ] **Step 1: Write failing lookup/render-data tests**

Assert:
- unknown slug returns `null`;
- optional missing sections are allowed;
- all referenced technology IDs resolve;
- duplicate case-study slugs fail validation.

- [ ] **Step 2: Verify failure**

- [ ] **Step 3: Implement registry and generic page**

`CaseStudyPage` reads `:slug`.

Unknown slug renders the branded NotFound content, not a blank page.

Only sections present in data render.

- [ ] **Step 4: Add Projects CTA**

Projects with `caseStudySlug` render `Case Study / Подробнее`.

Do not render the CTA on commercial/private cards that have no approved case study.

- [ ] **Step 5: Make technology tags link back to filtered Projects**

Target:

```text
/?tech=<technology-id>#projects
```

- [ ] **Step 6: Verify and commit**

```powershell
npm test
npm run lint
npm run build
git add src/data/caseStudies src/pages/CaseStudyPage.jsx src/pages/caseStudy.css src/components/case-study src/App.jsx src/components/Projects.jsx src/data/projects.js tests/caseStudies.test.js
git commit -m "Add project case study framework"
```

---

### Task 12: QRumiX Flagship Case Study

**Files:**
- Create: `src/data/caseStudies/qrumix.js`
- Modify: `src/data/caseStudies/index.js`
- Modify: `src/data/projects.js`
- Modify: `src/data/staticRoutes.js`
- Modify: `src/data/commands.js`
- Add as supplied: `public/projects/qrumix/*`
- Modify: `src/i18n/translations.js` only for shared UI labels, not case-study body copy
- Test: `tests/qrumixCaseStudy.test.js`
- Modify: `tests/commands.test.js`

**Interfaces:**
- Produces the real `/projects/qrumix` case study.
- Consumes only factual user-approved QRumiX content.

- [ ] **Step 1: Gather/approve QRumiX content before writing it**

Required input classes:
- what QRumiX is and why it exists;
- your role/contribution;
- technology IDs;
- challenge/solution;
- real architecture/technical decisions;
- screenshots;
- public links if any;
- results/lessons;
- future improvements.

Any unavailable item is omitted.

- [ ] **Step 2: Write failing QRumiX data test**

Assert:
- slug is `qrumix`;
- project `qrumix.caseStudySlug === 'qrumix'`;
- every technology ID resolves;
- every gallery item has `src` and bilingual/neutral `alt`;
- no link is rendered as public when the project data marks it private.

- [ ] **Step 3: Implement data/media**

Keep body copy in `qrumix.js` as bilingual structured data.

- [ ] **Step 4: Add static route metadata and palette command**

Register `/projects/qrumix` in `staticRoutes`.

Add the now-valid `Open QRumiX` command to `src/data/commands.js` and extend the command test to assert its target.

Track `project_case_study_open` by stable slug only when the case-study page is viewed.

- [ ] **Step 5: Verify**

Manual desktop/mobile/RU/EN, screenshot lazy loading, filtered-tech return links, direct build route exists.

- [ ] **Step 6: Commit**

```powershell
git add src/data/caseStudies/qrumix.js src/data/caseStudies/index.js src/data/projects.js src/data/staticRoutes.js src/data/commands.js src/i18n/translations.js tests/qrumixCaseStudy.test.js tests/commands.test.js
# If approved media files were added, stage those exact files under public/projects/qrumix/ too.
git commit -m "Add QRumiX case study"
```

---

### Task 13: Qarumi Lab Platform

**Files:**
- Create: `src/data/labExperiments.js`
- Create: `src/lab/experimentLoaders.js`
- Create: `src/pages/LabPage.jsx`
- Create: `src/pages/LabExperimentPage.jsx`
- Create: `src/pages/lab.css`
- Create: `src/components/lab/LabErrorBoundary.jsx`
- Modify: `src/App.jsx`
- Modify: `src/data/staticRoutes.js`
- Modify: `src/data/commands.js`
- Modify: `src/i18n/translations.js`
- Test: `tests/labExperiments.test.js`
- Modify: `tests/commands.test.js`

**Interfaces:**
- Produces:
  - `labExperiments`
  - `getLabExperiment(slug)`
  - `experimentLoaders[slug]`
- Experiment metadata includes `slug`, bilingual title/description, technology IDs, mode and optional repository/external URL.

- [ ] **Step 1: Write failing Lab registry tests**

Assert:
- unique slugs;
- unknown slug returns `null`;
- every internal experiment has a loader;
- every technology ID resolves;
- external experiments require an external URL;
- no loader is executed merely by importing the registry.

- [ ] **Step 2: Verify failure**

- [ ] **Step 3: Implement `/lab` catalog**

Render cards from registry.

Projects and Lab remain visually/semantically distinct.

- [ ] **Step 4: Implement `/lab/:slug`**

Internal experiment:
- lazy-load the component;
- wrap only the experiment area in `LabErrorBoundary`;
- render lightweight loading fallback.

External experiment:
- provide clear external navigation rather than embedding heavy code.

Unknown slug → branded NotFound content.

- [ ] **Step 5: Add static route and command**

Register `/lab` in `staticRoutes`.

Add `Open Qarumi Lab` to the palette registry now that the route exists.

Track `lab_open` on the Lab index and `lab_experiment_open` with a stable experiment slug on experiment pages.

Experiment route entries are added only when internal experiments exist.

- [ ] **Step 6: Verify and commit**

```powershell
npm test
npm run lint
npm run build
git add src/data/labExperiments.js src/lab/experimentLoaders.js src/pages/Lab* src/pages/lab.css src/components/lab src/App.jsx src/data/staticRoutes.js src/data/commands.js src/i18n/translations.js tests/labExperiments.test.js tests/commands.test.js
git commit -m "Add Qarumi Lab platform"
```

---

### Task 14: First Lab Experiment — Particle Field

**Files:**
- Create: `src/lab/particle-field/ParticleField.jsx`
- Create: `src/lab/particle-field/particleField.css`
- Create: `src/lab/particle-field/particleField.js`
- Modify: `src/data/labExperiments.js`
- Modify: `src/lab/experimentLoaders.js`
- Modify: `src/data/staticRoutes.js`
- Test: `tests/particleField.test.js`

**Interfaces:**
- Produces deterministic particle seed/config generation in `particleField.js`.
- Internal route: `/lab/particle-field`.

- [ ] **Step 1: Write failing pure-logic tests**

Assert deterministic particle generation for a fixed seed/config and that reduced/mobile configs use lower counts than desktop.

- [ ] **Step 2: Verify failure**

- [ ] **Step 3: Implement particle data helper**

Keep animation loop/render concerns out of the pure helper.

- [ ] **Step 4: Implement experiment component**

Requirements:
- pointer/touch responsive;
- no impact on global page styles;
- no unbounded React state updates per animation frame;
- reduced-motion fallback is static/minimal;
- cleanup animation frame/listeners on unmount.

- [ ] **Step 5: Register loader/data/static route**

Add `/lab/particle-field`.

- [ ] **Step 6: Verify and commit**

```powershell
npm test
npm run lint
npm run build
git add src/lab/particle-field src/data/labExperiments.js src/lab/experimentLoaders.js src/data/staticRoutes.js tests/particleField.test.js
git commit -m "Add particle field lab experiment"
```

---

### Task 15: GitHub Pulse

**Files:**
- Create: `src/data/githubRepositories.js`
- Create: `src/services/github.js`
- Create: `src/utils/githubCache.js`
- Create: `src/components/github/GitHubPulse.jsx`
- Create: `src/components/github/githubPulse.css`
- Modify: `src/pages/HomePage.jsx`
- Modify: `src/i18n/translations.js`
- Test: `tests/githubService.test.js`
- Test: `tests/githubCache.test.js`

**Interfaces:**
- Produces:
  - `githubRepositories`
  - `normalizeRepository(apiJson, fallback)`
  - `readGithubCache(key, now)`
  - `writeGithubCache(key, value, now)`
  - `fetchFeaturedRepositories({ fetchImpl, signal })`
- Cache TTL: 1 hour.
- Network timeout: 4 seconds.

- [ ] **Step 1: Write failing cache/service tests**

Assert:
- fresh cache is accepted;
- expired/malformed cache is ignored;
- API fields are normalized into the local UI shape;
- partial API responses merge with fallback values;
- failed/rate-limited/timeout fetch returns fallback path without throwing to the UI.

- [ ] **Step 2: Verify failure**

- [ ] **Step 3: Create curated registry**

Start from currently public portfolio repositories only. Do not automatically list newest repositories.

Each record contains owner/name plus local fallback title/description/language.

- [ ] **Step 4: Implement service/cache**

Flow:
1. render local fallback immediately;
2. use fresh cache if available;
3. otherwise fetch public GitHub REST API in background;
4. update component/cache on success;
5. silently keep fallback on failure.

No token in frontend.

- [ ] **Step 5: Add GitHub Pulse between Projects and Contact**

Show 3–4 curated cards maximum.

Track only safe actions such as repository link clicks.

- [ ] **Step 6: Verify offline/rate-limit behavior**

Use DevTools offline/network blocking. UI must remain complete.

- [ ] **Step 7: Commit**

```powershell
git add src/data/githubRepositories.js src/services/github.js src/utils/githubCache.js src/components/github src/pages/HomePage.jsx src/i18n/translations.js tests/githubService.test.js tests/githubCache.test.js
git commit -m "Add GitHub Pulse"
```

---

### Task 16: Resume

**Files:**
- Create: `src/data/resume.js`
- Create: `src/pages/ResumePage.jsx`
- Create: `src/pages/resume.css`
- Modify: `src/layouts/ResumeLayout.jsx`
- Modify: `src/App.jsx`
- Modify: `src/data/staticRoutes.js`
- Modify: `src/data/commands.js`
- Modify: `src/i18n/translations.js`
- Test: `tests/resumeData.test.js`
- Modify: `tests/commands.test.js`

**Interfaces:**
- Produces `/resume` and `resume` structured data referencing project/technology/social IDs.

- [ ] **Step 1: Gather/approve factual Resume content**

Do not invent dates, employers, education, languages or experience.

Anonymous commercial work may use approved generic names.

- [ ] **Step 2: Write failing data-integrity tests**

Assert:
- all skill IDs resolve;
- all project IDs resolve;
- all social IDs marked for Resume resolve;
- optional sections may be absent/empty;
- no duplicate experience/project IDs.

- [ ] **Step 3: Implement `resume.js`**

Bilingual fields live in data.

Reuse project/technology/social IDs.

- [ ] **Step 4: Implement strict Resume UI**

Include minimal:
- Qarumi identity/role
- RU/EN toggle
- Print / Save PDF button
- approved sections only

No SeasonalBackground/Header/parallax/reveal.

- [ ] **Step 5: Add print CSS**

`@media print`:
- white background;
- dark text;
- hide controls;
- remove shadows;
- sensible page breaks;
- readable URLs/links.

`Print / Save PDF` calls `window.print()` and tracks `resume_print`.

- [ ] **Step 6: Add `/resume` static route and command**

Register `/resume` in `staticRoutes`.

Add `Open Resume` to the palette registry now that the route exists.

Track `resume_open` on page view and `resume_print` only when the print action is invoked.

- [ ] **Step 7: Verify**

Browser + print preview in both languages, mobile, direct built route.

- [ ] **Step 8: Commit**

```powershell
git add src/data/resume.js src/pages/ResumePage.jsx src/pages/resume.css src/layouts/ResumeLayout.jsx src/App.jsx src/data/staticRoutes.js src/data/commands.js src/i18n/translations.js tests/resumeData.test.js tests/commands.test.js
git commit -m "Add printable resume"
```

---

### Task 17: Developer Terminal

**Files:**
- Create: `src/terminal/terminalCommands.js`
- Create: `src/terminal/parseTerminalCommand.js`
- Create: `src/components/terminal/DeveloperTerminal.jsx`
- Create: `src/components/terminal/developerTerminal.css`
- Modify: `src/context/CommandUIProvider.jsx`
- Modify: `src/data/commands.js`
- Modify: `src/layouts/SiteLayout.jsx`
- Modify: `src/i18n/translations.js`
- Test: `tests/terminal.test.js`

**Interfaces:**
- Produces:
  - `parseTerminalCommand(input)`
  - terminal command descriptors
  - `useCommandUI().openTerminal()` / `closeTerminal()`
  - hidden-search `Open terminal` palette action
- Consumes shared command execution for navigation/actions.

- [ ] **Step 1: Write failing parser tests**

Assert:
- whitespace/case normalized;
- `project qrumix` returns command + arg;
- unknown command returns controlled `unknown`;
- empty input returns `empty`;
- `rm -rf /` never maps to executable behavior;
- raw input is not exposed as an analytics payload.

- [ ] **Step 2: Verify failure**

- [ ] **Step 3: Implement predefined terminal commands**

Initial commands:
- help
- about
- projects
- project qrumix
- skills
- lab
- resume
- github
- contact
- email
- history
- clear
- language en
- language ru
- whoami
- sudo

Season commands are parsed in Task 18.

- [ ] **Step 4: Add terminal open/close state and hidden palette entry**

Extend `CommandUIProvider` with `openTerminal()` / `closeTerminal()`.

Add `open-terminal` to `src/data/commands.js` with `visibility: 'hidden-search'`, revealed only by an explicit terminal-related search.

- [ ] **Step 5: Implement overlay UI**

Requirements:
- command history;
- prompt/input;
- Escape close;
- focus trap/restore;
- body scroll lock;
- internal scroll;
- reduced-motion friendly;
- desktop `~` / backtick shortcut ignored while typing in other inputs;
- mobile opens via hidden-search Command Palette action.

- [ ] **Step 6: Analytics**

Track `terminal_open`.

For command events, send only predefined command ID if desired; never send arbitrary typed text.

- [ ] **Step 7: Verify and commit**

```powershell
npm test
npm run lint
npm run build
git add src/terminal src/components/terminal src/context/CommandUIProvider.jsx src/data/commands.js src/layouts/SiteLayout.jsx src/i18n/translations.js tests/terminal.test.js
git commit -m "Add developer terminal"
```

---

### Task 18: Session Season Override

**Files:**
- Create: `src/context/SeasonContext.jsx`
- Create: `src/context/SeasonProvider.jsx`
- Create: `src/context/useSeason.js`
- Create: `src/utils/resolveSeason.js`
- Modify: `src/components/seasonal/SeasonalBackground.jsx`
- Modify: `src/layouts/SiteLayout.jsx`
- Modify: `src/terminal/terminalCommands.js`
- Modify: `src/terminal/parseTerminalCommand.js`
- Modify: `tests/getSeason.test.js`
- Create: `tests/resolveSeason.test.js`
- Modify: `tests/terminal.test.js`

**Interfaces:**
- Produces:
  - `SEASON_STORAGE_KEY = 'qarumi-season-override'`
  - `resolveSeason({ search, sessionOverride, date })`
  - `useSeason()` with `{ season, sessionOverride, setSeasonOverride, clearSeasonOverride }`

Priority:

```text
1. valid ?season=
2. valid session override
3. calendar season
```

- [ ] **Step 1: Write failing resolver tests**

Assert:
- query override wins over session override;
- valid session override wins over calendar;
- invalid query does not suppress a valid session override;
- invalid session value falls back to calendar;
- `auto` clears the session override;
- ordinary query such as `?tech=react` does not affect calendar/session season resolution.

- [ ] **Step 2: Verify failure**

- [ ] **Step 3: Implement SeasonProvider**

Use `sessionStorage`, never localStorage.

React to Router `location.search` so `?season=` changes are reflected.

- [ ] **Step 4: Refactor SeasonalBackground**

Consume `useSeason()` instead of reading `window.location.search` directly.

Keep existing parallax/effect components unchanged.

- [ ] **Step 5: Add terminal commands**

Support:
- `season`
- `season spring`
- `season summer`
- `season autumn`
- `season winter`
- `season auto`

`season` reports effective mode/current season.

Do not add these to public Command Palette results.

- [ ] **Step 6: Verify**

Manual:
- all terminal overrides;
- reload in same tab keeps session override;
- new browser session returns auto;
- query override beats terminal override;
- `season auto` clears override;
- reduced motion still stops seasonal motion.

- [ ] **Step 7: Commit**

```powershell
git add src/context/Season* src/context/useSeason.js src/utils/resolveSeason.js src/components/seasonal/SeasonalBackground.jsx src/layouts/SiteLayout.jsx src/terminal tests/getSeason.test.js tests/resolveSeason.test.js tests/terminal.test.js
git commit -m "Add terminal season override"
```

---

### Task 19: Route SEO Metadata and Final Route Generation

**Files:**
- Create: `src/components/Seo.jsx`
- Create: `src/utils/seo.js`
- Modify: `src/data/staticRoutes.js`
- Modify: `scripts/generate-route-entries.mjs`
- Modify: `src/App.jsx`
- Modify: `index.html`
- Test: `tests/seo.test.js`
- Modify: `tests/generateRouteEntries.test.js`

**Interfaces:**
- Produces `getSeoMetadata(pathname, dynamicData)` and client-side `Seo` updates.
- Static-route entries include at minimum:
  - `/privacy`
  - `/projects/qrumix`
  - `/lab`
  - `/lab/particle-field`
  - `/resume`
- 404 uses `noindex`.

- [ ] **Step 1: Write failing SEO tests**

Assert known titles:
- `/` → `Qarumi — Developer Portfolio`
- `/projects/qrumix` → QRumiX case-study title
- `/lab` → `Qarumi Lab`
- `/resume` → `Qarumi — Resume`
- unknown → branded 404 metadata with `noindex`

Canonical URLs always use `https://koneky.github.io` and strip transient query/hash state, so `/?tech=react#projects` still canonicalizes to the homepage.

- [ ] **Step 2: Verify failure**

- [ ] **Step 3: Implement runtime SEO component**

Update:
- document title
- description
- robots
- canonical
- OG title/description/url

Do not duplicate body content into meta logic when case-study data already provides it.

- [ ] **Step 4: Align post-build metadata injection**

Generated direct-route HTML must contain route-correct metadata before React loads.

Keep root metadata in `index.html` as the homepage fallback.

- [ ] **Step 5: Verify every generated route**

Run:

```powershell
npm run build
Get-ChildItem dist -Recurse -Filter index.html
Select-String -Path dist\projects\qrumix\index.html -Pattern "QRumiX"
Select-String -Path dist\404.html -Pattern "noindex"
```

Also use `npm run preview` and manually refresh every known route.

- [ ] **Step 6: Commit**

```powershell
git add src/components/Seo.jsx src/utils/seo.js src/data/staticRoutes.js scripts/generate-route-entries.mjs src/App.jsx index.html tests/seo.test.js tests/generateRouteEntries.test.js
git commit -m "Add route SEO metadata"
```

---

### Task 20: Accessibility, Performance and Final Verification

**Files:**
- Modify as needed: feature CSS/JSX files touched above
- Modify: `src/index.css`
- Modify: `README.md` if deployment/configuration documentation needs GA/YM variables
- Test: existing tests only unless a discovered regression needs a focused new test

**Interfaces:**
- No new public interface. This task closes regressions and validates the whole batch.

- [ ] **Step 1: Run the full automated gate**

```powershell
npm test
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 2: Check bundle/build output**

Confirm Lab experiment code is emitted as a lazy chunk rather than folded into the initial homepage path where practical.

No warning should indicate broken route imports or missing assets.

- [ ] **Step 3: Run preview and direct-route matrix**

```powershell
npm run preview
```

Manually load/refresh:
- `/`
- `/projects/qrumix`
- `/lab`
- `/lab/particle-field`
- `/resume`
- `/privacy`
- unknown route

- [ ] **Step 4: Keyboard/accessibility matrix**

Verify:
- visible `:focus-visible`;
- Header/mobile nav;
- Command Palette focus trap and restore;
- Terminal focus trap and restore;
- Escape behavior;
- no global shortcut while typing;
- real buttons/links instead of clickable divs;
- logical one-`h1` page structure;
- decorative visual layers `aria-hidden`.

- [ ] **Step 5: Reduced-motion matrix**

Enable `prefers-reduced-motion: reduce`.

Verify:
- seasonal effects static/minimal;
- Command Palette/Terminal transitions minimal;
- Particle Field static/minimal;
- no easter egg bypasses the preference.

- [ ] **Step 6: Analytics/privacy matrix**

With production-like IDs:
- no GA/YM request before consent;
- Reject optional keeps both off;
- Analytics-only enables GA4 + basic Metrica but not Webvisor;
- Accept all enables behavior analytics;
- Cookie settings can be reopened from Footer;
- page views fire on route changes, not hash-only navigation;
- safe predefined event IDs only;
- ad blocker/script failure does not break site.

- [ ] **Step 7: GitHub fallback matrix**

Verify:
- normal API;
- offline;
- timeout;
- rate-limit/failure;
- corrupt cache.

Local cards remain usable in all cases.

- [ ] **Step 8: Resume print matrix**

Check Chrome/Edge print preview in RU and EN:
- white page;
- no site decorations;
- no hidden content clipping;
- page breaks sensible;
- links readable.

- [ ] **Step 9: Responsive matrix**

Check at minimum:
- narrow mobile
- tablet
- normal desktop
- wide desktop

Verify no horizontal overflow.

- [ ] **Step 10: Commit final polish if Task 20 changed code/docs**

Only if the verification pass required fixes:

```powershell
git add <only-final-polish-files>
git commit -m "Polish portfolio expansion"
```

If no changes were required, do not create an empty commit.

- [ ] **Step 11: Production deployment verification**

Before push:

```powershell
git status
git log --oneline --decorate -20
```

Confirm the working tree is clean and all Tasks 01–20 are checked.

Then perform the single final push:

```powershell
git push origin main
```

After GitHub Pages deploy:
- repeat direct-route refreshes on `https://koneky.github.io/`;
- verify actual production analytics consent behavior;
- verify no console errors on homepage/Lab/Resume/case study.

---

## Restart Protocol

At the end of every implementation session:

1. Check the completed task in **Progress Tracker**.
2. Check every completed step inside that task.
3. Record the latest local commit SHA next to the task if useful.
4. Run `git status`.
5. Stop only at a task boundary unless a failure is explicitly documented.
6. On the next session, start from the first unchecked task/step.

Recommended note format inside this document:

```text
Checkpoint: Task 09 complete
Last commit: abc1234 Add command palette
Verification: npm test ✓ | npm run lint ✓ | npm run build ✓
Next: Task 10 — Tech Stack → Projects filtering
```

This keeps the implementation state recoverable without relying on chat history.
