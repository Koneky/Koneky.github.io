# Seasonal Parallax Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a calendar-driven seasonal background with subtle scroll parallax, desktop pointer parallax, mobile density reduction, and reduced-motion support across the Qarumi portfolio.

**Architecture:** A fixed `SeasonalBackground` component sits behind the site content and selects one of four isolated seasonal effect components. A pure season resolver handles calendar and URL override logic, while `useParallax` batches scroll/pointer updates with `requestAnimationFrame` and writes bounded layer offsets into CSS custom properties so animation never drives React rerenders.

**Tech Stack:** React 19, Vite 8, JavaScript/JSX, CSS animations/transforms, Node built-in test runner (`node --test`)

**Spec:** `docs/superpowers/specs/2026-10-03-seasonal-parallax-background-design.md`

## Global Constraints

- Season mapping is fixed: winter = Dec–Feb, spring = Mar–May, summer = Jun–Aug, autumn = Sep–Nov.
- Supported test overrides are exactly `spring`, `summer`, `autumn`, and `winter` through `?season=...`; invalid values fall back to the calendar season.
- Effects run across the entire site, not only the Hero.
- Visual intensity stays medium: noticeable but subordinate to content.
- Scroll parallax runs on desktop and mobile; pointer parallax runs only for fine-pointer/hover-capable devices.
- Continuous animation must not trigger React rerenders.
- Use CSS transforms and `requestAnimationFrame`; do not add animation libraries, Canvas, WebGL, gyroscope access, weather APIs, or geographic season detection.
- Mobile uses fewer visible animated elements than desktop.
- `prefers-reduced-motion: reduce` disables parallax and stops/simplifies seasonal movement.
- Seasonal layers use `pointer-events: none` and must never block clicking, scrolling, text selection, or keyboard navigation.
- Existing grid, dark background, purple/cyan glows, navigation, language switcher, reveal animations, and card interactions remain intact.
- Work on `feature/seasonal-parallax` (or another non-`main` branch) so intermediate commits do not trigger the production GitHub Pages deploy. Merge/push to `main` only after final verification.

## Review Focus

- Query strings containing unrelated parameters or an invalid `season` value must still resolve predictably and fall back correctly.
- Very large `scrollY` values must produce bounded background offsets so fixed layers never drift permanently off-screen.
- Reduced-motion users must receive zero parallax and non-moving/minimally static seasonal visuals.
- Touch/coarse-pointer/mobile environments must not activate pointer-follow movement and must display fewer animated elements.
- The fixed background must not create horizontal overflow, cover interactive content, or change existing stacking behavior.

---

### Task 1: Season Resolver and Test Harness

**Files:**
- Create: `src/utils/getSeason.js`
- Create: `tests/getSeason.test.js`
- Modify: `package.json`

**Interfaces:**
- Produces: `getCalendarSeason(monthIndex: number) -> 'spring' | 'summer' | 'autumn' | 'winter'`
- Produces: `getSeason(search: string, date: Date) -> 'spring' | 'summer' | 'autumn' | 'winter'`
- Consumers: `SeasonalBackground.jsx` in Task 3

- [ ] **Step 1: Create the feature branch**

Run:

```bash
git switch -c feature/seasonal-parallax
```

Expected: Git reports that it switched to a new branch named `feature/seasonal-parallax`.

- [ ] **Step 2: Add the Node test script**

Modify `package.json` scripts to include:

```json
"test": "node --test"
```

Keep the existing `dev`, `build`, `lint`, and `preview` scripts unchanged.

- [ ] **Step 3: Write failing season-resolution tests**

Create `tests/getSeason.test.js` using `node:test` and `node:assert/strict`.

Tests must assert:

```js
getCalendarSeason(0) === 'winter'
getCalendarSeason(2) === 'spring'
getCalendarSeason(5) === 'summer'
getCalendarSeason(8) === 'autumn'
getCalendarSeason(11) === 'winter'

getSeason('?season=winter', new Date(2026, 6, 1)) === 'winter'
getSeason('?foo=1&season=spring&bar=2', new Date(2026, 9, 1)) === 'spring'
getSeason('?season=invalid', new Date(2026, 9, 1)) === 'autumn'
getSeason('', new Date(2026, 9, 1)) === 'autumn'
```

- [ ] **Step 4: Run the tests and verify failure**

Run:

```bash
npm test
```

Expected: FAIL because `src/utils/getSeason.js` does not exist yet.

- [ ] **Step 5: Implement the resolver**

Create `src/utils/getSeason.js` with the exact exported interfaces above.

Implementation requirements:

- Parse `search` with `URLSearchParams`.
- Accept only the four lowercase supported override values.
- Ignore invalid override values.
- Use `date.getMonth()` for calendar fallback.
- Keep the module browser-independent so Node tests can import it.

- [ ] **Step 6: Run tests, lint, and build**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 7: Commit locally**

```bash
git add package.json src/utils/getSeason.js tests/getSeason.test.js
git commit -m "Add seasonal background resolver"
```

Do not push to `main`.

---

### Task 2: Bounded Parallax Engine

**Files:**
- Create: `src/hooks/useParallax.js`
- Create: `tests/useParallax.test.js`

**Interfaces:**
- Produces: `normalizePointer(clientX: number, clientY: number, width: number, height: number) -> { x: number, y: number }`, with each axis clamped to `[-1, 1]`
- Produces: `calculateParallaxOffsets(scrollY: number, pointerX: number, pointerY: number) -> { far, mid, near }`
- Each `far`, `mid`, and `near` object contains `{ x: number, y: number }` in CSS pixels.
- Produces: `useParallax() -> void`
- CSS variables written by `useParallax`:
  - `--parallax-far-x`
  - `--parallax-far-y`
  - `--parallax-mid-x`
  - `--parallax-mid-y`
  - `--parallax-near-x`
  - `--parallax-near-y`

**Exact movement envelope:**
- Far pointer movement: max ±4px X and ±3px Y; scroll contribution max ±6px Y.
- Mid pointer movement: max ±8px X and ±6px Y; scroll contribution max ±12px Y.
- Near pointer movement: max ±12px X and ±9px Y; scroll contribution max ±18px Y.
- Scroll movement uses a bounded smooth wave such as `Math.sin(scrollY / 500)` rather than unbounded `scrollY * factor`.

- [ ] **Step 1: Write failing parallax math tests**

Create `tests/useParallax.test.js`.

Tests must assert:

- viewport center normalizes to `{ x: 0, y: 0 }`
- top-left normalizes to `{ x: -1, y: -1 }`
- bottom-right normalizes to `{ x: 1, y: 1 }`
- out-of-bounds pointer coordinates remain clamped to `[-1, 1]`
- `calculateParallaxOffsets(0, 0, 0)` returns zero offsets
- pointer extremes never exceed the exact movement envelopes above
- an extremely large scroll value such as `10_000_000` still keeps each layer within its maximum scroll envelope

- [ ] **Step 2: Run tests and verify failure**

```bash
npm test
```

Expected: FAIL because `useParallax.js` does not exist.

- [ ] **Step 3: Implement the pure parallax helpers**

Create the two named helper exports in `src/hooks/useParallax.js`.

Keep them deterministic and free of DOM access.

- [ ] **Step 4: Run tests and verify the helpers pass**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 5: Implement `useParallax()`**

The hook must:

- Use one `requestAnimationFrame` update per frame at most.
- Read `window.scrollY`.
- Track pointer position only when `(hover: hover) and (pointer: fine)` matches.
- Set pointer input to zero on coarse-pointer/touch environments.
- Check `prefers-reduced-motion: reduce`; when active, write `0px` to all six variables and skip animated scroll/pointer updates.
- Write all CSS variables to `document.documentElement.style`.
- Remove scroll, pointer, media-query, and pending animation-frame resources on cleanup.
- Avoid `useState` for continuous scroll/pointer values.

- [ ] **Step 6: Verify**

```bash
npm test
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 7: Commit locally**

```bash
git add src/hooks/useParallax.js tests/useParallax.test.js
git commit -m "Add parallax background engine"
```

---

### Task 3: Seasonal Background Shell and Layering

**Files:**
- Create: `src/components/seasonal/SeasonalBackground.jsx`
- Create: `src/components/seasonal/SpringEffect.jsx`
- Create: `src/components/seasonal/SummerEffect.jsx`
- Create: `src/components/seasonal/AutumnEffect.jsx`
- Create: `src/components/seasonal/WinterEffect.jsx`
- Create: `src/components/seasonal/seasonal.css`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `getSeason(search, date)` from Task 1
- Consumes: `useParallax()` from Task 2
- Produces: global `<SeasonalBackground />`
- Seasonal child components take no props in v1.

- [ ] **Step 1: Create four temporary effect components**

Each seasonal effect file exports one default React component that initially returns `null`.

This keeps the shell buildable while later tasks implement each season independently.

- [ ] **Step 2: Implement `SeasonalBackground.jsx`**

Requirements:

- Import `seasonal.css`.
- Call `useParallax()`.
- Resolve the active season from `window.location.search` and `new Date()`.
- Map the four season names to the four effect components.
- Render one fixed root element with:
  - `className="seasonal-background"`
  - `data-season={season}`
  - `aria-hidden="true"`
- Render only the selected seasonal effect.

- [ ] **Step 3: Add base seasonal CSS**

`seasonal.css` must define:

- default `0px` values for all six parallax variables
- `.seasonal-background` as fixed, viewport-sized, overflow-hidden, non-interactive, and behind the page content
- `.seasonal-layer`
- `.seasonal-layer--far`
- `.seasonal-layer--mid`
- `.seasonal-layer--near`

Each layer reads only its matching X/Y custom properties.

Add an approximately `800ms` fade-in for the root seasonal background.

- [ ] **Step 4: Protect the existing stacking order**

In `seasonal.css`:

- make `#root` an isolated stacking context
- keep the seasonal background below page content
- ensure `main` and the footer remain above the background
- do not reduce the existing header `z-index`

The background must not use a positive z-index above content.

- [ ] **Step 5: Mount the background in `App.jsx`**

Render `<SeasonalBackground />` once, before the header/main content.

Do not move or wrap the existing content hierarchy unnecessarily.

- [ ] **Step 6: Verify all season overrides select the expected root value**

Run:

```bash
npm run dev
```

Open:

```text
/?season=spring
/?season=summer
/?season=autumn
/?season=winter
/?season=invalid
```

Expected:

- each valid override yields the matching `data-season`
- invalid override falls back to the current calendar season
- navigation and links are still clickable
- no horizontal scrollbar appears

Then run:

```bash
npm test
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 7: Commit locally**

```bash
git add src/App.jsx src/components/seasonal
git commit -m "Add seasonal background shell"
```

---

### Task 4: Spring Petal Effect

**Files:**
- Modify: `src/components/seasonal/SpringEffect.jsx`
- Modify: `src/components/seasonal/seasonal.css`

**Interfaces:**
- Produces: 21 deterministic desktop petals distributed across far/mid/near layers.
- Mobile target: 12 visible petals.

- [ ] **Step 1: Define deterministic petal data**

At module scope, create exactly 21 petal descriptors.

Each descriptor must provide stable values derived from its index for:

- horizontal start position
- size
- animation duration
- negative animation delay
- horizontal drift
- starting rotation
- opacity/depth group

Do not call `Math.random()` during React render.

- [ ] **Step 2: Render petals into depth layers**

`SpringEffect` renders far, mid, and near `.seasonal-layer` wrappers.

Each petal receives a `.spring-petal` class and inline CSS custom properties for its descriptor values.

- [ ] **Step 3: Add the spring visual and animation**

In `seasonal.css`:

- create a stylized petal using an asymmetric rounded shape
- use pale pink, white, and lavender variants
- animate from above the viewport to below it
- combine falling, gentle lateral drift, and slow rotation
- keep opacity low enough that text remains dominant

The particle's own fall animation must live on the particle; parallax transform remains on the parent layer so transforms do not conflict.

- [ ] **Step 4: Add mobile spring density reduction**

At the existing mobile breakpoint (`max-width: 768px`), hide petals 13–21 with `display: none`.

- [ ] **Step 5: Verify spring manually**

Open:

```text
/?season=spring
```

Check:

- 21 petals on desktop
- approximately 12 visible on mobile
- three apparent depth speeds/sizes
- no jerky rerenders
- petals stay behind content
- scroll and pointer parallax remain subtle

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 6: Commit locally**

```bash
git add src/components/seasonal/SpringEffect.jsx src/components/seasonal/seasonal.css
git commit -m "Add spring petal background"
```

---

### Task 5: Summer Light Effect

**Files:**
- Modify: `src/components/seasonal/SummerEffect.jsx`
- Modify: `src/components/seasonal/seasonal.css`

**Interfaces:**
- Produces: 4 ambient light blobs and 3 subtle light streaks on desktop.
- Mobile target: 3 blobs and 1 streak.

- [ ] **Step 1: Render deterministic summer lights**

`SummerEffect` renders:

- 4 light blobs distributed across far/mid/near layers
- 3 thin light streaks
- stable positions and durations; no render-time randomness

- [ ] **Step 2: Add summer styling**

In `seasonal.css`:

- use blurred soft gradients rather than particle shapes
- retain purple/cyan as primary colors
- add only a faint warm gold/cream accent
- keep blob opacity roughly in the subtle `0.08–0.16` range
- animate slow floating movement
- use longer durations than spring/autumn/winter so summer is the calmest season

- [ ] **Step 3: Add mobile summer density reduction**

At `max-width: 768px`:

- hide one blob
- hide all but one streak
- reduce blur/size if necessary to avoid GPU-heavy full-screen filters

- [ ] **Step 4: Verify summer manually**

Open:

```text
/?season=summer
```

Expected:

- movement is visible only after watching briefly
- no harsh yellow cast
- pointer parallax gently shifts the depth layers on desktop
- mobile remains calm and lightweight

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 5: Commit locally**

```bash
git add src/components/seasonal/SummerEffect.jsx src/components/seasonal/seasonal.css
git commit -m "Add summer light background"
```

---

### Task 6: Autumn Leaf Effect

**Files:**
- Modify: `src/components/seasonal/AutumnEffect.jsx`
- Modify: `src/components/seasonal/seasonal.css`

**Interfaces:**
- Produces: 18 deterministic desktop leaves distributed across far/mid/near layers.
- Mobile target: 10 visible leaves.

- [ ] **Step 1: Define deterministic leaf data**

At module scope, create exactly 18 leaf descriptors with stable:

- horizontal start position
- size
- duration
- negative delay
- lateral drift
- rotation
- depth
- palette variant

Do not use render-time `Math.random()`.

- [ ] **Step 2: Render leaves into depth layers**

Use far, mid, and near `.seasonal-layer` wrappers.

Each leaf receives `.autumn-leaf` plus CSS custom properties for its descriptor.

- [ ] **Step 3: Add autumn styling and animation**

In `seasonal.css`:

- use a minimal stylized leaf silhouette
- palette: muted amber, dark red-brown, and restrained purple
- animate downward fall, side drift, and rotation
- avoid photorealistic SVG assets or emoji leaves

- [ ] **Step 4: Add mobile autumn density reduction**

At `max-width: 768px`, hide leaves 11–18.

- [ ] **Step 5: Verify autumn manually**

Open:

```text
/?season=autumn
```

Expected:

- 18 desktop / about 10 mobile leaves
- varied but coherent motion
- no particle blocks text interaction
- depth feels stronger near the foreground but remains subtle

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 6: Commit locally**

```bash
git add src/components/seasonal/AutumnEffect.jsx src/components/seasonal/seasonal.css
git commit -m "Add autumn leaf background"
```

---

### Task 7: Winter Snow Effect

**Files:**
- Modify: `src/components/seasonal/WinterEffect.jsx`
- Modify: `src/components/seasonal/seasonal.css`

**Interfaces:**
- Produces: 33 deterministic snow particles across three depth layers.
- Mobile target: 20 visible particles.

- [ ] **Step 1: Define deterministic snow data**

At module scope, create exactly 33 descriptors.

Each descriptor supplies stable:

- horizontal position
- diameter
- duration
- negative delay
- slight horizontal drift
- opacity
- depth group

No render-time randomness.

- [ ] **Step 2: Render snow into depth layers**

Render simple circular particles, not snowflake emoji.

- [ ] **Step 3: Add winter styling and animation**

In `seasonal.css`:

- distant flakes are smaller, dimmer, and slower
- near flakes are slightly larger, brighter, and faster
- fall mostly vertically with mild horizontal drift
- avoid large decorative snowflakes

- [ ] **Step 4: Add mobile winter density reduction**

At `max-width: 768px`, hide particles 21–33.

- [ ] **Step 5: Verify winter manually**

Open:

```text
/?season=winter
```

Expected:

- 33 desktop / about 20 mobile particles
- clear three-layer depth
- no visually dense snowstorm
- smooth scrolling while snow is active

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 6: Commit locally**

```bash
git add src/components/seasonal/WinterEffect.jsx src/components/seasonal/seasonal.css
git commit -m "Add winter snow background"
```

---

### Task 8: Reduced Motion, Mobile, and Final Integration Polish

**Files:**
- Modify: `src/components/seasonal/seasonal.css`
- Modify: `src/hooks/useParallax.js` only if final verification exposes a listener/motion issue

**Interfaces:**
- Consumes all seasonal components and parallax variables from earlier tasks.
- Produces the final accessibility/performance behavior required by the spec.

- [ ] **Step 1: Add final reduced-motion CSS**

Under:

```css
@media (prefers-reduced-motion: reduce)
```

ensure:

- seasonal particle/blob/streak animations are stopped
- the background can remain as a very low-opacity static decoration
- layer transforms resolve to zero/no transform
- root fade-in does not animate

Do not hide site content or modify non-seasonal animations outside this feature.

- [ ] **Step 2: Verify JS reduced-motion behavior**

Enable reduced-motion emulation in browser devtools.

Expected:

- the six parallax CSS variables remain `0px`
- pointer movement does not move seasonal layers
- scrolling does not move seasonal layers

If this fails, fix only the event/media-query logic in `useParallax.js`.

- [ ] **Step 3: Verify coarse-pointer/mobile behavior**

Using responsive/mobile emulation:

- no pointer-follow movement
- spring shows at most 12 petals
- summer shows 3 blobs / 1 streak
- autumn shows at most 10 leaves
- winter shows at most 20 particles
- no horizontal overflow at 320px width

- [ ] **Step 4: Run interaction regression checks**

For every season override, verify:

- header navigation works
- RU/EN switcher works
- project links work
- contact/GitHub links work
- scroll reveal still triggers
- cards still hover on desktop
- text can be selected
- seasonal background never captures a click

- [ ] **Step 5: Run long-scroll/performance checks**

On desktop:

- scroll from Hero to Footer several times
- move the pointer while scrolling
- inspect for visible stutter
- verify seasonal layers remain near the viewport instead of drifting away
- verify no repeated React render loop appears in React DevTools

- [ ] **Step 6: Run the complete automated verification**

```bash
npm test
npm run lint
npm run build
```

Expected: all pass.

Then verify production locally:

```bash
npm run preview
```

Check at least one season override in the production build.

- [ ] **Step 7: Commit final polish**

```bash
git add src/components/seasonal/seasonal.css src/hooks/useParallax.js
git commit -m "Polish seasonal background accessibility"
```

If `useParallax.js` did not change, omit it from `git add`.

- [ ] **Step 8: Review branch history and merge only when clean**

Run:

```bash
git status
git log --oneline --decorate -8
```

Expected:

- working tree clean
- seasonal feature commits are present on `feature/seasonal-parallax`

Then merge using the user's normal Git workflow. After the finished feature reaches `main`, push once so the existing GitHub Pages workflow deploys the complete implementation rather than intermediate states.
