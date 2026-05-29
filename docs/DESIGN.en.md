# Stack-and-Flow Design System — Visual Design Reference

This document defines the visual identity of the Stack-and-Flow Design System. It is inspired by the **Agent Teams** landing style — a high-precision dark interface that combines technical minimalism with the energy of a professional tool. It serves as the design reference for tokens, components, and visual decisions.

---

## 1. Atmosphere and Visual Philosophy

Stack-and-Flow should feel like the inside of a precision instrument. The background is not merely dark — it is a **deep blue-black** (`#060C13`) that behaves like a void with a perceptible cold tint, allowing content to emerge with clarity and a coherent visual temperature.

The visual signature is the **combination of opaque surfaces and blurred transparency** — some cards are solid and raised, others are translucent with `backdrop-filter: blur()`, creating layered depth without dramatic shadows. The crimson red accent (`#db143c` in light, `#ff0036` in dark) does not dominate — it punctuates. It appears in button gradients, subtle glows, and active states.

The defining differentiator is the **subtle background grid** — translucent 40×40px lines that give the canvas a drafting-sheet texture without interfering with content. Combined with the navbar `backdrop-filter`, it creates the feeling of working inside a native tool instead of browsing a marketing site.

**Key characteristics:**
- Deep blue-black (`#060C13`) as the base background — Palette A, H215 S50, perceptible cold tint without losing darkness
- Subtle background grid (low-opacity `rgba` lines) over the main canvas
- Floating navbar with `backdrop-filter: blur(16px)` and `background: rgba(6,12,19,0.75)` — glass effect with a cold tint
- Crimson red as a punctuation accent, never as a general fill
- Primary buttons with a multi-layer neon glow — red gradient + outer halo
- Secondary buttons with a semi-transparent border and contained glow
- Opaque cards vs. translucent cards — both coexist in the same system
- Space Grotesk Variable in all contexts — weight 500 as baseline, 700 in headings

---

## 2. Color Palette

### Accent — Crimson Red

The brand color. Two values depending on the mode:

| Context | Token | Value |
|---------|-------|-------|
| Light mode | `--color-brand-primary` | `#db143c` |
| Dark mode | `--color-brand-primary` | `#ff0036` |

**Full scale (light):**
| Token | Value | Usage |
|-------|-------|-----|
| `primary` | `#db143c` | Brand, buttons, active states |
| `primary-dark` | `#c41136` | Hover pressed |
| `primary-darker` | `#b60f32` | Active/pressed |
| `primary-darkest` | `#8c0b26` | Extra emphasis, accents |
| `primary-light` | `#e63358` | Hover lifted |
| `primary-lighter` | `#ea4566` | Hover elevated |
| `primary-lightest` | `#f07a92` | Tints, highlighted text |

**Full scale (dark — more vibrant):**
| Token | Value | Usage |
|-------|-------|-----|
| `primary` | `#ff0036` | Brand, buttons, active states |
| `primary-dark` | `#e60030` | Hover pressed |
| `primary-darker` | `#cc002b` | Active/pressed |
| `primary-darkest` | `#990020` | Extra emphasis, accents |
| `primary-light` | `#ff335e` | Hover lifted |
| `primary-lighter` | `#ff4d72` | Hover elevated |
| `primary-lightest` | `#ff809b` | Tints, highlighted text |

> **Why two values**: in dark mode the red needs more vibrancy to maintain contrast and stand out against the blue-slate background. `#ff0036` has more presence than `#db143c` and keeps an AA ratio (4.96:1) over the `#060C13` canvas.

---

### Backgrounds and Surfaces

> **Palette A — Blue-slate**: H215 S50, perceptible cold tint. Verified accessible with `#FF0036` on canvas (4.96:1) and surface (4.71:1).

| Token | Dark | Light | Usage |
|-------|------|-------|-----|
| `background` | `#060C13` | Docusaurus default (white) | Main canvas |
| `background-surface` | `#0B131E` | — | Solid cards, code blocks |
| `background-surface-raised` | `#0F1824` | — | Table headers, subtle emphasis |
| `navbar-bg` | `rgba(6,12,19,0.75)` | `rgba(255,255,255,0.7)` | Navbar with backdrop blur |
| `sidebar-mobile-bg` | `rgba(6,12,19,1.0)` | `#ffffff` | Mobile sidebar |
| `dropdown-bg` | `#0B131E` | `#ffffff` | Dropdown menus |

### Emphasis scale (borders and separators)

| Token | Dark | Usage |
|-------|------|-----|
| `surface-raised` | `#0F1824` | Table headers, subtle backgrounds |
| `border` | `#172230` | Standard borders, separators |
| `border-strong` | `#202C3C` | Borders for interactive components |

### Text

| Role | Dark | Light | Approx. contrast |
|-----|------|-------|-----------------|
| Primary (headings) | `#ffffff` | `#000000` | 21:1 ✅ |
| Secondary (body) | `#cccccc` | system | ~7:1 over `#060C13` ✅ |
| Tertiary (labels, nav) | `#888888` | system | ~5:1 over `#060C13` ✅ |
| Active sidebar | `#adadad` | — | ~6:1 over `#060C13` ✅ |
| Disabled / muted | `#6a6b6c` | — | ~4.5:1 — disabled, WCAG exempt ✅ |

### Functional / semantic colors

| Role | Token | Dark | Light |
|-----|-------|------|-------|
| Error / Danger | `--color-error` | `#ff0036` | `#db143c` |
| Success | `--color-success` | `#22c55e` | `#16a34a` |
| Warning | `--color-warning` | `#fbbf24` | `#d97706` |
| Info | `--color-info` | `#55b3ff` | `#0077cc` |

### Functional transparencies (tints)

Used in overlays, glows, and interactive states:

| Role | Value |
|-----|-------|
| Red glow base | `rgba(255, 0, 54, 0.15)` |
| Red glow active | `rgba(255, 0, 54, 0.30)` |
| Red menu active bg | `rgba(255, 0, 54, 0.10)` |
| Red menu hover bg | `rgba(255, 255, 255, 0.05)` |
| Red tinted surface | `rgba(255, 0, 54, 0.06)` |
| Warm amber glow | `rgba(255, 185, 0, 0.12)` |
| White overlay subtle | `rgba(255, 255, 255, 0.05)` |
| White overlay medium | `rgba(255, 255, 255, 0.07)` |
| White border faint | `rgba(255, 255, 255, 0.06)` |
| Black overlay heavy | `rgba(0, 0, 0, 0.60)` |

---

## 3. Typography

### Family

**Space Grotesk Variable** — a geometric humanist family with all weights in a single variable font file. It reduces CLS (Cumulative Layout Shift) by avoiding font swaps.

```css
@import '@fontsource-variable/space-grotesk';

font-family: 'Space Grotesk Variable', 'Space Grotesk', system-ui, -apple-system, sans-serif;
```

Space Grotesk replaces Inter in every context. It is used for headings, body text, buttons, captions, UI code, and navigation.

**Monospace:** system font (`ui-monospace`, `SFMono-Regular`, `Menlo`) for technical code blocks.

### Weights

| Weight | Usage |
|------|-----|
| `400` | Secondary text, light captions, fine print |
| `500` | Body baseline — the system's working weight |
| `600` | Buttons, badges, emphasis labels, bold captions |
| `700` | Headings — all `h1`–`h6` |

> **Principle**: weight 500 as the baseline (not 400) adds extra heft that improves readability on dark backgrounds. Weight 400 is reserved for contexts that need stronger visual hierarchy contrast.

### Hierarchy

| Role | Size | Weight | Line Height | Letter Spacing | Notes |
|-----|--------|------|-------------|----------------|-------|
| Display Hero | 56–64px | 700 | 1.10 | 0px | Landing headings |
| Section Heading | 36–48px | 700 | 1.15 | 0px | Main sections |
| Card Heading | 22–24px | 700 | 1.20 | 0px | Card titles |
| Sub-heading | 18–20px | 600 | 1.40 | 0.1px | Subtitles, features |
| Body Large | 18px | 500 | 1.60 | 0.2px | Prominent paragraphs |
| Body | 16px | 500 | 1.60 | 0.2px | Primary body text |
| Body Small | 14px | 500 | 1.50 | 0.1px | UI labels, nav links sidebar |
| Button | 16px | 600 | 1.15 | 0.01em | `letter-spacing: 0.01em` |
| Nav Link | 16px | 600 | 1.40 | 0.01em | Main navbar links |
| Caption | 14px | 500 | 1.40 | 0.2px | Metadata, labels |
| Badge / Tag | 10–12px | 600–700 | 1.40 | 0.02em | Micro-labels, "New" badges |
| Code (UI) | 93% | 500 | 1.60 | 0.3px | Inline code, snippets |
| Announcement | 13–14px | 500 | — | 0.01em | Announcement banners |

### Principles

- **Positive tracking in dark mode**: +0.01em–+0.2px in body text compensates for white bloom on black
- **700 only in headings**: headings consistently use bold (700) — never body text
- **No `font-style: italic`** for emphasis — use weight or color instead
- **Space Grotesk everywhere**: do not mix it with other families except system monospace for code

---

## 4. Transparency and Surface System

Unlike a shadow-based elevation system, Stack-and-Flow uses an **opacity and blur system** that distinguishes layers by their transparency level.

### Surface levels

| Level | Type | Treatment | Usage |
|-------|------|-------------|-----|
| **Base** | Opaque | `background: #060C13` + subtle grid | Page canvas |
| **Raised** | Opaque | `background: #0B131E` + `border: 1px solid #172230` | Solid cards, code blocks, dropdowns |
| **Frosted** | Translucent | `background: rgba(6,12,19,0.75)` + `backdrop-filter: blur(16px)` | Navbar, floating overlays |
| **Frosted Light** | Translucent | `background: rgba(255,255,255,0.7)` + `backdrop-filter: blur(16px)` | Navbar in light mode |
| **Tinted** | Tinted translucent | `background: rgba(255,0,54,0.06–0.15)` | Secondary buttons, hover states, active menus |
| **Overlay** | Dark translucent | `background: rgba(0,0,0,0.6)` + `backdrop-filter: blur(4px)` | Modal backgrounds, sidebar backdrop |

### Cards: opaque vs. frosted

**Opaque card** — use for structured content, tables, and code snippets:
```css
background: #0B131E;
border: 1px solid #172230;
border-radius: 8px;
```

**Frosted card** — use for elements that float above content (navbar, tooltips, popovers):
```css
background: rgba(6, 12, 19, 0.75);
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.06);
border-radius: 8px;
```

**Tinted card** — use for active states or accent-emphasis elements:
```css
background: rgba(255, 0, 54, 0.08);
border: 1px solid rgba(255, 0, 54, 0.2);
border-radius: 8px;
```

### Blur rule

Only elements that literally float above others (navbar, mobile sidebar, modals, tooltips) use `backdrop-filter`. Content cards do not — they are opaque. This distinction is intentional: blur means “I am floating,” opaque means “I am content.”

---

## 5. Components

### Buttons

**Primary — Neon Gradient:**
```css
background: linear-gradient(135deg, #ff1a4b 0%, #cc0030 100%);
border: none;
border-radius: 9999px; /* pill */
color: #ffffff;
font-weight: 500;
letter-spacing: 0.01em;
box-shadow:
  0 0 0 1.5px rgba(255, 60, 90, 0.5),
  0 0 16px 4px rgba(255, 0, 54, 0.45),
  0 0 40px 6px rgba(255, 0, 54, 0.18),
  inset 0 1px 0 rgba(255, 255, 255, 0.15);
```
Hover: stronger gradient + amplified outer glow.

**Secondary — Ghost with contained glow:**
```css
background: rgba(255, 0, 54, 0.06);
border: 1.5px solid rgba(255, 0, 54, 0.5);
border-radius: 9999px;
color: #ffffff;
box-shadow:
  0 0 8px 2px rgba(255, 0, 54, 0.15),
  0 0 24px 4px rgba(255, 0, 54, 0.07),
  inset 0 0 10px rgba(255, 0, 54, 0.04);
```
Light mode: `color: #cc0030`, opaque border.

**Transition:** `box-shadow 0.25s ease, background 0.25s ease` — never an instant color change.

**Shape:** all buttons are pill-shaped (`border-radius: 9999px`) — no rectangular buttons in the main UI.

### Navbar

```css
background: rgba(6, 12, 19, 0.75);
backdrop-filter: blur(16px);
border-bottom: 1px solid #172230;
```

- Links: `color: #9c9c9d` → `#ffffff` on hover, optional `text-decoration: underline`
- CTA button at the end: primary pill button
- Sticky at the top, smooth transition on scroll
- Mobile: hamburger → sidebar with fade + slide (`translateX(-16px)` → `0`)

### Cards and containers

Three coexisting variants:

1. **Opaque** (`#0B131E` + `#172230` border) — content, docs, features
2. **Frosted** (rgba + blur) — floating elements
3. **Tinted red** (`rgba(255,0,54,0.06–0.10)` + semi-transparent red border) — active states, accent highlights

Standard border-radius: `8px`. Large cards: `12px`.

### Badges / Tags

```css
background: rgba(22, 163, 74, 1); /* success */
/* or */
background: rgba(255, 0, 54, 1);  /* brand */
color: #ffffff; /* dark: use #000 for green */
border-radius: 3px;
padding: 1px 6px;
font-size: 10px;
font-weight: 700;
letter-spacing: 0.02em;
```

“New” badge: green (`#16a34a` light, `#22c55e` dark with `color: #000`).

### Inputs and forms

```css
background: #0B131E;
border: 1px solid #202C3C;
border-radius: 8px;
color: #f9f9f9;
```
Focus: brighter border + `box-shadow: 0 0 0 3px rgba(255,0,54,0.12)`.
Placeholder: `#6a6b6c`.

### Code blocks

```css
background: #0B131E;
border: 1px solid #172230;
border-radius: 8px;
font-size: 93%; /* --ifm-code-font-size */
```
Highlighted line: `rgba(219,20,60,0.10)` (light) / `rgba(255,0,54,0.15)` (dark).

### GitHub Stars badge glow

Reusable pattern for any badge with a numeric metric:
- Left section: `rgba(255,255,255,0.05)` + icon
- Divider: `1px solid #262626`
- Right section: `rgba(255,185,0,0.07)` + number in `#fbbf24`
- Hover: golden border `rgba(255,185,0,0.55)` + `box-shadow: 0 0 0 3px rgba(255,185,0,0.12)`

### Announcement bar

```css
border-bottom: 1px solid rgba(255, 0, 54, 0.35);
font-size: 0.85rem;
font-weight: 500;
letter-spacing: 0.01em;
```
Links: `#ff4d6d` → `#ff8099` on hover, with `border-bottom: 1px solid rgba` for a subtle underline.

### Gradient Borders

Some components use borders with variable intensity — not a flat border but a **gradient border** with a highlight flare. The effect simulates directional lighting across the edge of the component.

**Technique (pseudo-element):**
```css
/* The element needs position: relative, a solid background, and border: 1px solid transparent */
.gradient-border {
  position: relative;
  border: 1.5px solid transparent;
  background-clip: padding-box;
}
.gradient-border::before {
  content: '';
  position: absolute;
  inset: -1.5px;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.18) 0%,
    rgba(255, 0, 54, 0.55) 40%,
    rgba(255, 0, 54, 0.15) 100%
  );
  z-index: -1;
}
```

**Secondary variant (ghost button with accent glow):**
```css
.gradient-border::before {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 0, 54, 0.45) 45%,
    rgba(255, 0, 54, 0.08) 100%
  );
}
```

**Usage rule:** only on interactive elements that need border emphasis — secondary buttons, focused inputs, active cards. Never on structural borders (separators, tables).

### Footer

Three columns of links over the base background (`#060C13`). No cards, no borders — the content floats directly on the canvas.

```css
footer {
  background: #060C13;
  border-top: 1px solid #172230;
  padding: 48px 0 24px;
}
```

**Structure:**
- Columns: Documentation / Community / More (or whatever the product defines)
- Column titles: 14px Space Grotesk 600, `#ffffff`
- Links: 14px Space Grotesk 500, `#888888` → `#cccccc` on hover
- Copyright: 12px Space Grotesk 400, `#6a6b6c`, centered
- Column gap: `32px–48px`
- No `backdrop-filter`, no cards, no shadows — opaque and clean

---

## 6. Background Decoration

The main canvas uses a **double-line grid** as a technical texture:

**Dark:**
```css
background:
  linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px) 0 0 / 40px 40px,
  linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px) 0 0 / 40px 40px,
  #060C13;
```

**Light:**
```css
background:
  linear-gradient(rgba(0, 0, 0, 0.035) 1px, transparent 1px) 0 0 / 40px 40px,
  linear-gradient(90deg, rgba(0, 0, 0, 0.035) 1px, transparent 1px) 0 0 / 40px 40px,
  var(--background);
```

**Rule:** the grid appears on the docs and landing canvas. Not inside modals, dropdowns, or cards.

### Decorative glows

| Name | Value | Usage |
|--------|-------|-----|
| Base glow | `0 4px 20px rgba(219,20,60,0.15)` | Light: hover for branded elements |
| Active glow | `0 8px 30px rgba(219,20,60,0.30)` | Light: active states |
| Base glow dark | `0 4px 20px rgba(255,0,54,0.15)` | Dark: hover for branded elements |
| Active glow dark | `0 8px 30px rgba(255,0,54,0.30)` | Dark: active states |
| Amber stars glow | `0 0 0 3px rgba(255,185,0,0.12)` | GitHub stars badge hover |

### Entry animations

```css
.fade-in-section {
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 560ms cubic-bezier(.2,.8,.2,1),
    transform 560ms cubic-bezier(.2,.8,.2,1);
  will-change: opacity, transform;
}
/* When entering the viewport: */
.fade-in-visible {
  opacity: 1;
  transform: translateY(0);
}
```

Curve `cubic-bezier(.2,.8,.2,1)` — a soft ease-out with a slight initial overshoot.

---

## 6b. Background Primitives

Stack-and-Flow provides two animated background primitives as independent components. **They are not one component with a `theme` prop** — they are separate engines with different responsibilities.

### CanvasEngine

A 2D particle physics engine. It manages particle position, velocity, acceleration, and pulsing through `requestAnimationFrame`.

**What changes per theme (declarative configuration):**
```ts
type CanvasTheme = {
  orbs: {
    count: { mobile: number; desktop: number }
    color: string          // e.g. '255, 0, 54'
    minRadius: number
    maxRadius: number
  }
  sparks: {
    count: { mobile: number; desktop: number }
    color: string
  }
  foci: Array<{
    baseX: number          // relative position 0–1
    baseY: number
    color: string
    speed: number
    range: number
  }>
  ambient: {
    color: string
    opacity: number
  }
  fps: { mobile: number; desktop: number }
}
```

**What does NOT change** (internal engine logic): particle physics, horizontal wrap, resize handler, frame throttling.

**Included themes:**
- `bokeh` — diffuse red orbs + halo sparks, dynamic foci. Inspired by photographic lens bokeh.

**Usage:**
```tsx
<CanvasEngine theme="bokeh" className="absolute inset-0" aria-hidden />
```

**Scalability:** a new theme = a `themes/aurora.ts` file with configuration. If the new effect needs different physics (for example particles following the cursor), it is a new engine — not another prop.

---

### SvgAnimation

Component for animated SVGs with declarative interpolation (opacity, transform, path morph). It is a completely different engine from `CanvasEngine` — they do not share code.

```tsx
<SvgAnimation src={LogoSvg} animation="fade-pulse" />
```

**Available animations:**
- `fade-pulse` — soft cyclical opacity (0.4 → 1.0 → 0.4)
- `float` — smooth translateY (-6px → 0 → -6px)
- `spin-slow` — full rotation in 8s

---

### BackgroundSlot

Layout wrapper that positions any background primitive. Products use it as a container — the design system does not dictate what goes inside.

```tsx
// Canvas only
<BackgroundSlot>
  <CanvasEngine theme="bokeh" />
</BackgroundSlot>

// SVG only
<BackgroundSlot>
  <SvgAnimation src={LogoSvg} animation="fade-pulse" />
</BackgroundSlot>

// Free composition
<BackgroundSlot>
  <CanvasEngine theme="bokeh" />
  <SvgAnimation src={LogoSvg} animation="fade-pulse" />
</BackgroundSlot>
```

**CSS:**
```css
.background-slot {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}
```

---

### Hero — composition pattern (not a component)

Hero is NOT a design-system component — each product defines its own visual narrative. The design system provides the primitives used to build it.

**Recommended pattern:**
```tsx
<section className="relative overflow-hidden">
  {/* Layer 0 — animated background */}
  <BackgroundSlot>
    <CanvasEngine theme="bokeh" />
  </BackgroundSlot>

  {/* Layer 1 — content */}
  <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 py-20 md:py-32">
    <h1>…</h1>
    <p>…</p>
    <div className="flex gap-4">
      <Button variant="primary" rounded>Get Started</Button>
      <Button variant="secondary" rounded>View on GitHub</Button>
    </div>
  </div>
</section>
```

**Rule:** the background grid (`section 6`) and `CanvasEngine` coexist — the grid is CSS, the canvas sits above it with optional `mix-blend-mode: screen` so glows can interact with the grid.

---

## 7. Layout and Spacing

### Base unit
**8px** — all measurements are multiples of 8 or 4.

### Spacing scale
`1 · 2 · 3 · 4 · 8 · 10 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 120`

### Container
- Max-width: `1200px`, centered with `margin: 0 auto`
- Padding horizontal: `24px` (mobile) → `40px` (tablet) → `64px` (desktop)

### Sections
- Vertical padding between sections: `80px–120px`
- Internal card padding: `16px–32px`
- Gap between related elements: `8px–16px`

### Column grid
- Hero: one centered column
- Features: 2–3 columns on desktop, 1 column on mobile
- Docs: fixed sidebar + content + optional TOC

### Border-radius scale

| Value | Usage |
|-------|-----|
| `3px` | Badges micro, "New" labels |
| `6px` | Dropdown items, menu links |
| `8px` | Input fields, standard cards, secondary buttons, code blocks |
| `9999px` | Pill buttons (CTA, nav CTA) — maximum circular shape |
| `12px` | Large cards, pagination nav links |

---

## 8. Accessibility

### Minimum guaranteed contrast

All text values on their respective backgrounds meet at least WCAG AA (4.5:1). Primary text values meet AAA (7:1+).

| Combination | Contrast | Level |
|------------|-----------|-------|
| `#ffffff` over `#060C13` | ~21:1 | AAA ✅ |
| `#cccccc` over `#060C13` | ~7.5:1 | AAA ✅ |
| `#888888` over `#060C13` | ~5.1:1 | AA ✅ |
| `#adadad` over `#060C13` | ~6.1:1 | AA ✅ |
| `#ff0036` over `#060C13` | ~4.96:1 | AA ✅ |
| `#ff0036` over `#0B131E` | ~4.71:1 | AA ✅ |
| `#ff0036` over `#0F1824` | ~4.51:1 | AA ✅ |
| `#ff335e` over `#0F1824` | ~5.00:1 | AA ✅ (use for links/icons on raised surfaces) |
| `#db143c` over `#ffffff` | ~4.7:1 | AA ✅ |
| `#cc0030` over `#ffffff` | ~5.4:1 | AA ✅ |
| `#22c55e` over `#060C13` | ~6.8:1 | AA ✅ |
| `#000000` over `#22c55e` | ~6.8:1 | AA ✅ (badge dark) |

> ⚠️ **Never use** `#ff0036` as text color on `#ffffff` in light mode — insufficient contrast. Always use `#cc0030` or darker in light mode.
> ⚠️ `#6a6b6c` (disabled/muted) does not meet AA on dark backgrounds — that is acceptable: WCAG explicitly exempts `disabled` states from the contrast requirement.

### Touch targets
- Pill buttons: default minimum height `44px`
- Action scale `xs | sm | md | lg`: `xs` is the dense compact variant for `Button`, `IconButton`, and CTA `Link` (`button` / `outlined`), with lower height and padding; use `sm` or above when you need to preserve the `44px` target
- `Link` `regular` remains typographic and inline; CTA `sm` and above keep the minimum `44px` area
- Nav links: minimum `44px` height including padding
- Menu items: minimum `padding: 7px 12px` with 14px font

### Focus visible
- All interactive elements use `focus-visible` with `box-shadow: 0 0 0 3px rgba(255,0,54,0.4)` in dark mode and `box-shadow: 0 0 0 3px rgba(219,20,60,0.35)` in light mode
- Never `outline: none` without a visible alternative

### Motion
- Transitions: maximum `560ms`. Respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  .fade-in-section {
    transition: none;
    opacity: 1;
    transform: none;
  }
}
```

---

## 9. Do's and Don'ts

### Do ✅
- Use `#060C13` as the base dark background — deep blue-slate with a cold H215 S50 tint
- Apply the background grid (opacity 0.025–0.035) on the main canvas with `#060C13` as the base color
- Distinguish `backdrop-filter: blur` (floating elements) from `background: #0B131E` (content)
- Use the more vibrant red in dark mode (`#ff0036`) and the calmer one in light mode (`#db143c`)
- For links/icons on `surface-raised` (`#0F1824`) use `#ff335e` — it keeps an exact 5:1 ratio
- Build primary buttons with a gradient + multi-layer glow — the neon treatment is part of the signature
- Keep secondary text at `#cccccc` (dark) for ~7.5:1 contrast
- Use `border-radius: 9999px` exclusively on primary CTA buttons
- Apply `transition: box-shadow 0.25s ease, background 0.25s ease` to all interactive elements
- Use `font-weight: 700` only on headings (`h1`–`h6`), never body text
- Add `will-change: opacity, transform` to entrance animations to avoid jank

### Don't ❌
- Do not use pure black `#000000` as the dark background — the approved palette is blue-slate `#060C13`
- Do not apply `backdrop-filter: blur` to content cards — only to floating elements
- Do not use weights below 500 for body text in dark mode — 400 feels too thin
- Do not create decorative shadows without purpose — depth comes from surface contrast, not from box-shadows
- Do not mix pill buttons with rectangular buttons in the same section
- Do not omit the `border: 1px solid` on dark cards — without it, the cards blend into the background
- Do not place the background grid inside cards, modals, or dropdowns — only on the root canvas
- Do not apply arbitrary colors outside the defined palette — every new color needs contrast justification
- Do not animate layout-forcing properties (`width`, `height`, `top`, `left`) — only `opacity`, `transform`, `box-shadow`

---

## 10. Prompt Guide for AI Agents

### Quick color reference

```
Dark background:            #060C13
Dark surface:               #0B131E
Dark surface-raised:        #0F1824
Dark border:                #172230
Dark border-strong:         #202C3C
Brand red (dark):           #ff0036
Brand red-light (dark):     #ff335e  ← use on surface-raised
Brand red (light):          #db143c
Primary text (dark):        #ffffff
Secondary text (dark):      #cccccc
Tertiary text (dark):       #888888
Success (dark):             #22c55e
Warning (dark):             #fbbf24
Navbar bg (dark):           rgba(6, 12, 19, 0.75) + blur(16px)
```

### Example prompts

**Hero section:**
> "Create a hero section with `#060C13` background, a 40px line grid using `rgba(255,255,255,0.025)`, a 64px Space Grotesk 700 heading in `#ffffff`, 18px weight-500 description text in `#cccccc`, and two pill buttons: primary with `#ff1a4b → #cc0030` gradient and multi-layer neon glow, secondary with `rgba(255,0,54,0.5)` border and `rgba(255,0,54,0.06)` background"

**Feature card:**
> "Design a feature card with `#0B131E` background, `1px solid #172230` border, `border-radius: 8px`, a 22px Space Grotesk 700 heading, 16px weight-500 body text in `#cccccc`, and an icon in `#ff0036` in the top-left corner"

**Navbar:**
> "Build a sticky navbar with `background: rgba(6,12,19,0.75)`, `backdrop-filter: blur(16px)`, `border-bottom: 1px solid #172230`, links in `#888888` → `#ffffff` on hover, and a pill CTA button with a red gradient on the right"

**Active sidebar state:**
> "Apply active state with `background: rgba(255,0,54,0.10)`, `color: #ff0036`, `font-weight: 500`, `border-radius: 8px` — no extra border"

**Badge "New":**
> "Badge with `background: #22c55e` (dark) / `#16a34a` (light), `color: #000` (dark) / `#fff` (light), `border-radius: 3px`, `padding: 1px 6px`, 10px Space Grotesk 700, `letter-spacing: 0.02em`"

### Review checklist for agents

1. Is the background `#060C13` (blue-slate) — not pure black `#000000`, not dark gray?
2. Do cards have `1px solid #172230` borders — without them they blend into the background?
3. Is `backdrop-filter: blur` used only on floating elements (navbar, modals)?
4. Is the secondary text `#cccccc` — not `#999999` or lower contrast?
5. Do primary buttons use gradient + glow instead of a flat color?
6. Are buttons pill-shaped (`border-radius: 9999px`) — not rectangular?
7. Is the red in light mode `#db143c` or darker — never `#ff0036`?
8. Is Space Grotesk Variable loaded as a variable font — not as multiple static weights?
9. Do entrance animations use `cubic-bezier(.2,.8,.2,1)` with `will-change`?
10. Is `prefers-reduced-motion` present for scroll animations?
