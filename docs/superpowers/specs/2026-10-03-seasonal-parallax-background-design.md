# Seasonal Parallax Background — Design Spec

Date: 2026-10-03

## Goal

Add a subtle seasonal background system with parallax depth across the entire portfolio.

The effect should make the site feel alive without competing with the content, reducing readability, or hurting performance.

## Scope

The feature includes:

- Automatic season selection by calendar month
- Manual season override through the URL for testing
- Seasonal visual effects for spring, summer, autumn, and winter
- Scroll-based parallax across all devices
- Light mouse-based parallax on desktop
- Reduced particle density on mobile
- Respect for `prefers-reduced-motion`
- No additional animation libraries

## Season Selection

Default season is determined by month:

- Winter: December, January, February
- Spring: March, April, May
- Summer: June, July, August
- Autumn: September, October, November

For testing, the season can be overridden with:

- `?season=winter`
- `?season=spring`
- `?season=summer`
- `?season=autumn`

Invalid values are ignored and the calendar season is used.

## Architecture

New structure:

```text
src/
  components/
    seasonal/
      SeasonalBackground.jsx
      SpringEffect.jsx
      SummerEffect.jsx
      AutumnEffect.jsx
      WinterEffect.jsx
  hooks/
    useParallax.js
  utils/
    getSeason.js
```

`App.jsx` renders one global background component:

```jsx
<SeasonalBackground />
```

The seasonal system stays isolated from the page content.

## SeasonalBackground

Responsibilities:

- Resolve the active season
- Initialize parallax tracking
- Render the correct seasonal effect
- Provide shared background/parallax layers
- Stay non-interactive with `pointer-events: none`

The component is fixed to the viewport and spans the full screen.

Content remains above it and does not move with the parallax system.

## Parallax

Parallax uses CSS custom properties updated through `requestAnimationFrame`.

Example variables:

```css
--parallax-scroll
--parallax-x
--parallax-y
```

The hook must avoid React state updates during continuous scrolling or pointer movement.

Different visual layers use different movement multipliers:

- Far background/glow: low movement
- Mid particles: medium movement
- Near particles: slightly stronger movement

Text, buttons, cards, and layout containers never receive parallax transforms.

### Desktop

Desktop uses:

- Scroll-based vertical parallax
- Very light pointer-based X/Y movement

### Mobile

Mobile uses:

- Scroll-based parallax only
- Reduced particle counts
- Lower movement amplitude

No device orientation or gyroscope access is required.

## Seasonal Effects

### Spring

- Stylized petals
- White/lavender/pale pink tones
- Gentle diagonal drift
- Slow rotation and side-to-side motion
- Approximately 18–24 particles on desktop
- Reduced count on mobile

### Summer

- 3–5 soft moving light blobs
- A few subtle light streaks
- Warm accent mixed into the existing purple/cyan palette
- Very slow floating movement
- Mild response to scroll and pointer position
- Calmest season visually

### Autumn

- Stylized minimal leaves
- Amber, muted red-brown, and subtle purple tones
- Falling motion with rotation
- Horizontal drift
- Approximately 16–22 leaves on desktop
- Reduced count on mobile

### Winter

- Small snow particles in three depth groups
- Mostly circular/simple snow particles rather than emoji snowflakes
- Different fall speeds per depth layer
- Approximately 28–36 particles on desktop
- Reduced count on mobile

## Visual Intensity

Target intensity: medium.

Rules:

- Low opacity
- No dense particle clouds
- No large foreground objects crossing text
- Seasonal elements stay visually behind the interface
- Effects fade in over roughly 600–900 ms after load

## Performance

Implementation should:

- Use CSS transforms for movement
- Use `requestAnimationFrame` for scroll/pointer updates
- Avoid React rerenders during animation
- Keep particle counts intentionally low
- Avoid canvas unless profiling later proves it necessary
- Avoid third-party animation libraries

## Accessibility

When `prefers-reduced-motion: reduce` is active:

- Pointer parallax is disabled
- Scroll parallax is disabled or nearly eliminated
- Seasonal animation is stopped or simplified to a minimal static background

The feature must not interfere with keyboard navigation, clicking, scrolling, or text selection.

## Existing Design Integration

The existing dark background, grid, purple glow, and cyan accents remain unchanged.

Seasonal effects are layered into the existing visual system rather than replacing it.

## Testing

Manual checks:

- Default calendar season is correct
- Every `?season=` override works
- Invalid override falls back to calendar season
- No horizontal overflow
- No interaction blocking
- Desktop pointer parallax is subtle
- Mobile has reduced density
- `prefers-reduced-motion` behaves correctly
- No visible FPS drops during scroll
- Existing navigation, language switcher, reveal animations, and cards remain unaffected

Build checks:

```bash
npm run lint
npm run build
```

## Out of Scope

Not included in the first implementation:

- Geographic hemisphere detection
- Weather API integration
- Gyroscope/device orientation parallax
- User-facing season selector
- Canvas/WebGL rendering
- Sound effects
- Seasonal changes to page content or typography
