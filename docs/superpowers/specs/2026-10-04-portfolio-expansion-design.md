# Portfolio Expansion — Design Spec

Date: 2026-10-04

## Goal

Expand the current single-page developer portfolio into a small multi-page
portfolio platform while preserving the existing visual identity.

The new architecture should support:

- Clean internal routes without hash routing
- Selected project case studies
- Qarumi Lab experiments
- Command Palette
- Interactive technology filtering
- Live GitHub activity
- A professional Resume page
- Developer Terminal and easter eggs
- Shared social/contact data
- GA4 and Yandex Metrica analytics
- Cookie/privacy controls
- Existing RU/EN support
- Existing seasonal background system

The site must remain deployable on GitHub Pages.

---

## Core Product Principles

The homepage remains a focused portfolio landing page.

New features must improve one of the following:

- Demonstrate development skill
- Improve navigation
- Provide useful professional information
- Make the portfolio more memorable

Features must not turn the site into a collection of unrelated widgets.

The existing dark purple/cyan visual identity remains the primary design
language.

Seasonal backgrounds remain automatic for normal visitors.

---

## Routing

Use React Router with `BrowserRouter`.

Public routes:

```text
/
├── /projects/:slug
├── /lab
├── /lab/:slug
├── /resume
└── *
```

Initial known routes include:

```text
/
/projects/qrumix
/lab
/resume
```

No hash-based routing such as:

```text
/#/projects/qrumix
```

should be used.

---

## GitHub Pages Routing Strategy

GitHub Pages does not provide normal SPA history fallback.

The production build therefore uses two mechanisms.

### Known Routes

After Vite finishes building, a Node post-build script creates entry points
for all known routes.

Example output:

```text
dist/
├── index.html
├── projects/
│   └── qrumix/
│       └── index.html
├── lab/
│   └── index.html
└── resume/
    └── index.html
```

These files bootstrap the same React application.

This allows direct visits such as:

```text
https://koneky.github.io/projects/qrumix
```

to return a valid page instead of a GitHub Pages 404.

Case studies and Lab experiments with dedicated internal routes must be
added to the build route registry.

### Unknown Routes

A `404.html` entry loads the React application and allows it to render the
site's branded Not Found page.

Unknown routes such as:

```text
/projects/not-real
/lab/not-real
```

render `NotFoundPage`.

---

## Layout Architecture

Two layout families are required.

### SiteLayout

Used by:

```text
/
/projects/*
/lab
/lab/*
404
```

Contains:

```text
SeasonalBackground
Header
Route content
Footer
```

The current dark UI, seasonal background, animations, RU/EN switcher and
visual identity remain active.

### ResumeLayout

Used only by:

```text
/resume
```

The Resume layout is deliberately stricter.

It does not render:

- Seasonal particles
- Parallax
- Decorative reveal animations
- Heavy glow effects
- The normal site header

It retains subtle Qarumi branding and language controls.

---

## Homepage

The homepage remains the primary portfolio landing page.

Existing sections remain:

```text
Hero
About
Tech Stack
Projects
Contact
```

A GitHub Pulse section is added between Projects and Contact.

The homepage must not become a dashboard for every new feature.

---

## Main Navigation

The logo always navigates to:

```text
/
```

Homepage section navigation remains hash based:

```text
/#about
/#stack
/#projects
/#contact
```

When already on the homepage, navigation should smoothly scroll to the
section.

When navigating from an internal route, the application first navigates
to `/` and then scrolls to the requested section.

Internal page navigation uses React Router.

External links use normal anchors.

---

## Language

The existing RU/EN architecture remains.

Routes are language independent.

Use:

```text
/projects/qrumix
/lab
/resume
```

Do not create:

```text
/en/projects/qrumix
/ru/projects/qrumix
```

Page content changes through the existing language state.

---

# Project Case Studies

Only selected projects receive case-study pages.

A project should not receive a case study simply for consistency.

Projects without enough public information remain normal cards.

Anonymous commercial work must not expose confidential information.

QRumiX is the first featured case study:

```text
/projects/qrumix
```

Project metadata should support:

```text
id
slug
technologies
caseStudySlug
hasCaseStudy
repository
demo
```

Case-study content lives separately:

```text
src/data/caseStudies/
└── qrumix.js
```

---

## Case Study Structure

Case studies may include:

```text
Project Hero
Overview
Role / Contribution
Technology Stack
Challenge
Solution
Technical Decisions / Architecture
Screenshots / Gallery
Results / Lessons
Project Links
```

Sections are optional.

Missing information must result in omitted sections rather than placeholder
content.

Case studies use a readable editorial layout inside `SiteLayout`.

---

# Technology Catalog

Create one canonical technology registry.

Example identifiers:

```text
react
javascript
python
flutter
html-css
vite
```

Projects, case studies, Resume content and Lab experiments reference IDs,
not independently written display names.

This avoids mismatches such as:

```text
JS
JavaScript
Javascript
```

being treated as different technologies.

---

# Tech Stack → Projects Filtering

Technology items on the homepage become interactive when corresponding
projects exist.

Selecting a technology:

1. Sets one active technology filter
2. Navigates or scrolls to Projects
3. Filters visible project cards
4. Shows an active filter chip

Example:

```text
Filtered by: React ×
```

Only one technology filter is active at a time.

Filter state is represented in the URL:

```text
/?tech=react#projects
/?tech=python#projects
```

Unknown technology parameters are ignored.

Technology tags on case studies can navigate back to filtered Projects.

---

# Command Architecture

Create a shared command/action system rather than embedding navigation
logic directly into the Command Palette.

Conceptual structure:

```text
Command Registry
      │
      ├── Command Palette
      └── Developer Terminal
```

Commands may represent:

```text
navigation
external links
language changes
clipboard actions
project actions
Lab actions
```

Public and hidden commands must be distinguishable.

---

# Command Palette

Open with:

```text
Ctrl + K
Cmd + K
```

A visible Header trigger may also be provided.

Features:

```text
Search
Arrow-key navigation
Enter to execute
Escape to close
Focus trap
Focus restoration
Mobile full-screen mode
```

Search scoring supports:

```text
exact match
startsWith
includes
keywords
```

No fuzzy-search dependency is initially required.

Example commands:

```text
Go to About
Open Projects
Open QRumiX
Open Qarumi Lab
Open Resume
Open GitHub
Switch to Russian
Switch to English
Contact
```

Season controls must not appear in the normal Command Palette.

---

# Qarumi Lab

Use the catalog + dedicated experiment page model.

Routes:

```text
/lab
/lab/:slug
```

`/lab` is a curated experiment gallery.

Individual experiments can open inside the portfolio when appropriate.

Example:

```text
/lab/particle-field
/lab/generative-grid
```

Lab experiments are not normal portfolio projects.

Meaning:

```text
Projects = finished/public work
Lab = experiments, prototypes and exploration
```

---

## Lab Data

Create:

```text
src/data/labExperiments.js
```

Experiment metadata may include:

```text
slug
title
description
technologies
mode
component
repository
```

Possible modes:

```text
internal
external
```

External mode allows heavy experiments or separate applications to remain
outside the main portfolio.

---

## Lab Isolation

Experiment implementation lives outside generic components.

Example:

```text
src/lab/
├── particle-field/
│   ├── ParticleField.jsx
│   └── particleField.css
└── generative-grid/
```

Experiment CSS must not leak into the main portfolio.

Experiment modules should be lazy-loaded.

Heavy Lab dependencies must not enter the initial homepage bundle.

---

# GitHub Pulse

Add a curated live GitHub section between Projects and Contact.

Do not automatically show the most recently modified repositories.

Maintain a curated repository registry:

```text
src/data/githubRepositories.js
```

The GitHub API enriches those repositories with public live data such as:

```text
description
primary language
stars
forks
updated/pushed time
```

Show approximately 3–4 repositories.

---

## GitHub API Resilience

The portfolio must never depend on GitHub API availability.

Flow:

```text
Local fallback data
      ↓
Render immediately
      ↓
Check cache
      ↓
Fetch public API in background
      ↓
Update UI if successful
```

Errors silently fall back to cached/local data.

Do not display a large API error message in the portfolio.

No GitHub access token is shipped to the browser.

Use only public endpoints.

---

# Resume

Route:

```text
/resume
```

Resume has its own strict layout.

Suggested structure:

```text
Profile
Summary
Skills
Experience
Selected Projects
Education / Learning
Languages
Contact Details
```

Sections with no meaningful information may be omitted.

---

## Resume Data

Create:

```text
src/data/resume.js
```

Resume should reuse existing IDs and shared data where possible.

Examples:

```text
technology IDs
project IDs
social/contact IDs
```

Avoid duplicating project or technology information.

---

## Resume Language

The route remains:

```text
/resume
```

for both RU and EN.

A minimal:

```text
EN / RU
```

switcher remains available.

---

## Resume Printing

The Resume is print-first.

Provide dedicated:

```css
@media print
```

rules.

Print mode should:

```text
Use white background
Use high-contrast text
Remove UI controls
Remove shadows
Remove animations
Handle page breaks cleanly
Keep links readable
```

The initial PDF workflow is:

```text
Print / Save PDF
→ window.print()
```

No JavaScript PDF dependency is initially required.

---

# Social Links and Contact

Create one shared registry:

```text
src/data/socialLinks.js
```

It may contain:

```text
GitHub
Telegram
Email
LinkedIn
other future professional links
```

Metadata can define where a link should appear:

```text
showInContact
showInFooter
showInResume
showInCommands
```

This registry is reused by:

```text
Contact
Footer
Resume
Command Palette
Developer Terminal
```

---

## Contact Section

The main Contact section remains a prominent call to action.

It displays direct contact options rather than initially adding an external
contact-form service.

Email supports:

```text
mailto:
Copy email
```

Copy feedback temporarily displays:

```text
Copied
```

---

# Developer Terminal

Developer Terminal is a hidden overlay, not a standalone route.

Desktop activation may support:

```text
`
~
```

when focus is not inside an input.

It can also be opened through the Command Palette.

Mobile activation occurs through discoverable internal navigation rather
than a keyboard gesture.

---

## Terminal Commands

Initial commands may include:

```text
help
about
projects
project qrumix
skills
lab
resume
github
contact
email
history
clear
language en
language ru
whoami
```

Terminal navigation reuses the shared command/action architecture.

No `eval`, shell execution or dynamic JavaScript execution is allowed.

Only predefined commands are parsed.

---

## Terminal Easter Eggs

Small terminal-only responses are allowed.

Examples:

```text
sudo
whoami
rm -rf /
```

They may return harmless custom responses.

Easter eggs must remain subtle and must not introduce disruptive effects,
flashing or audio.

---

# Seasonal Easter Egg

Normal visitors continue to receive automatic calendar seasons.

Manual UI season controls are not exposed.

Developer Terminal supports:

```text
season
season spring
season summer
season autumn
season winter
season auto
```

Manual terminal override is stored only for the current browsing session.

Use `sessionStorage`, not permanent `localStorage`.

Priority:

```text
1. ?season= query parameter
2. Terminal session override
3. Calendar season
```

`?season=` remains the highest priority because it is the deterministic
testing/debugging interface.

---

# Analytics

Support both:

```text
Google Analytics 4
Yandex Metrica
```

Analytics scripts are managed through one shared analytics layer.

Conceptual structure:

```text
src/analytics/
├── analytics.js
├── GoogleAnalytics.jsx
└── YandexMetrica.jsx
```

Analytics must never be required for the application to function.

Script blocking, network failure or ad blockers must not create visible
application errors.

---

## Analytics Configuration

Use Vite environment variables:

```text
VITE_GA_ID
VITE_YM_ID
```

These IDs are configuration values, not secrets.

Analytics is enabled only in production.

Local development and tests must not send production analytics events.

---

## Analytics Page Views

React Router navigation must emit page-view updates for internal routes.

Examples:

```text
/
/projects/qrumix
/lab
/lab/particle-field
/resume
```

Page view tracking must not depend only on initial HTML load.

---

## Analytics Events

Useful events include:

```text
project_case_study_open
lab_open
lab_experiment_open
resume_open
resume_print
external_github_click
external_telegram_click
email_click
email_copy
technology_filter
command_palette_open
command_execute
terminal_open
language_change
not_found_view
```

Avoid collecting unnecessary free-form user data.

In particular:

- Do not send complete Terminal command text
- Do not send copied email content
- Do not send arbitrary search text from Command Palette

For terminal analytics, record only safe predefined command identifiers
when needed.

---

# Cookie Consent and Privacy Controls

Optional analytics must not be initialized before the required user
consent state is known.

Create a consent system with persistent preferences.

Recommended categories:

```text
Necessary
Analytics
Behavior analytics
```

### Necessary

Always enabled.

Includes only functionality required for the site itself, such as storing
language or consent preferences when appropriate.

### Analytics

Controls:

```text
Google Analytics 4
Basic Yandex Metrica
```

### Behavior Analytics

Controls more privacy-sensitive optional functionality such as:

```text
Yandex Webvisor / session replay
```

This category is separate from basic analytics.

---

## Consent UI

First visit displays a compact consent banner.

Actions:

```text
Accept all
Reject optional
Settings
```

Accept and reject options must be similarly accessible and not use dark
patterns.

`Settings` opens a small preferences panel where optional categories can
be enabled or disabled.

The Footer permanently exposes:

```text
Cookie settings
Privacy
```

so choices can be changed later.

---

## Consent Storage

Consent preference can be stored locally.

The consent mechanism itself must not require optional analytics cookies.

Analytics scripts are loaded only after their corresponding consent
category is enabled.

Changing preferences must update future tracking behavior.

Where technically feasible, revoking consent should also clear analytics
state created by the portfolio.

---

## Privacy Page / Section

Provide a concise privacy page or clearly accessible privacy section.

It should explain:

```text
Which analytics services are used
What categories of data are collected
Why analytics is collected
How preferences can be changed
How long preferences are stored
Which external providers receive analytics data
```

The wording should describe actual implementation rather than generic
template text.

Privacy/legal requirements may vary by visitor jurisdiction; the
implementation should favor consent-first behavior rather than assuming
optional tracking is always permitted.

---

# SEO

Every significant route defines its own metadata.

At minimum:

```text
title
meta description
canonical URL
Open Graph title
Open Graph description
```

Examples:

```text
/                 Qarumi — Developer Portfolio
/projects/qrumix  QRumiX — Case Study | Qarumi
/lab              Qarumi Lab
/resume           Qarumi — Resume
```

Case-study metadata derives from case-study data where possible.

404 pages use:

```text
noindex
```

Resume remains indexable.

---

# Accessibility

All new features remain keyboard accessible.

Requirements include:

```text
Visible :focus-visible
Logical heading structure
One primary h1 per page
Real links/buttons for interactions
No hover-only actions
Decorative elements aria-hidden
```

Command Palette and Terminal require:

```text
focus trap
Escape to close
focus restoration
keyboard navigation
```

---

## Reduced Motion

Existing `prefers-reduced-motion` support remains mandatory.

It also applies to:

```text
Command Palette animation
Terminal animation
route transitions
Lab experiments where possible
easter eggs
```

No easter egg may bypass reduced-motion preferences.

---

# Performance

The homepage should not download all optional features immediately.

Use route/component code splitting.

Lab experiments are lazy-loaded.

Heavy future dependencies such as WebGL/Three.js remain outside the main
homepage bundle.

Case-study media below the fold should use lazy loading.

Prefer appropriately sized WebP/AVIF images where practical.

---

# Loading and Error States

Avoid large global loading spinners.

Lazy routes may use a lightweight branded placeholder.

GitHub Pulse renders local data immediately rather than blocking on the
network.

Lab experiments may use experiment-specific loading states.

---

## Error Boundaries

Use an Error Boundary around independent experimental areas such as Lab
experiment rendering.

A crashed experiment must not crash the entire portfolio.

Example fallback:

```text
This experiment crashed.
Back to Lab
```

Do not add unnecessary Error Boundaries around every component.

---

# Not Found

Provide a branded Not Found page.

Example:

```text
404

Looks like this route escaped the lab.

Back home
Open projects
```

Do not automatically redirect unknown routes.

---

# Data Architecture

Target data structure:

```text
src/data/
├── projects.js
├── technologies.js
├── socialLinks.js
├── commands.js
├── resume.js
├── labExperiments.js
├── githubRepositories.js
└── caseStudies/
    └── qrumix.js
```

Data should reference stable IDs instead of duplicating display strings.

---

# Testing Strategy

Continue using Node's built-in test runner for pure logic.

Unit tests should cover:

```text
Route build list
Technology normalization/filtering
Command scoring/search
Public vs hidden commands
Terminal parser
Season override priority
Case-study lookup
Lab experiment lookup
GitHub API normalization
GitHub caching/fallback behavior
Social-link filtering
Analytics event normalization
Consent state resolution
Analytics initialization gating
```

Interactive browser behavior continues to receive manual verification.

If Command Palette, Terminal and routing UI become difficult to validate
through pure logic tests, introduce:

```text
Vitest
React Testing Library
```

as a separate testing infrastructure step.

Do not add them prematurely.

---

# Verification

Before major deployment:

```bash
npm test
npm run lint
npm run build
npm run preview
```

Manual verification includes:

```text
Desktop
Mobile
RU
EN
Direct route refresh
Homepage hash navigation
Known GitHub Pages routes
404 handling
Keyboard-only navigation
Command Palette
Terminal
Reduced motion
Technology filtering
GitHub API fallback
Resume print preview
Cookie consent accept
Cookie consent reject
Cookie settings changes
Analytics disabled before consent
GA4 page/event tracking after consent
Yandex Metrica tracking after consent
External links
```

---

# Implementation Workflow

Use small local commits grouped by implementation task.

Do not combine unrelated features in one commit.

The implementation plan should sequence foundational architecture before
dependent features.

Recommended high-level order:

```text
Routing and layouts
GitHub Pages route generation
Shared data registries
Navigation/social links
Analytics + consent foundation
Command system
Command Palette
Technology filtering
Project case-study system
QRumiX case study
Qarumi Lab
GitHub Pulse
Resume
Developer Terminal
Season easter egg
SEO/accessibility/performance polish
Final verification
```

---

# Out of Scope

Not part of this iteration unless separately approved:

```text
Authentication
Database/backend
User accounts
Server-side rendering
Full static-site generation framework
Contact form backend
Permanent visible season switcher
AI chatbot
Visitor counter
Music player
Automatic creation of case studies for every project
Analytics requiring secret credentials in the frontend
```
