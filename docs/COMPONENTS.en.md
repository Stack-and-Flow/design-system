# Stack-and-Flow — Component Visual Specification

> Reference for AI agents writing or reviewing component code. Covers every interactive state, glow system, transition rules, gradient border technique, and accessibility requirements. Derived from Stack-and-Flow tokens and the current project visual contract.

---

## 1. Compositional Principles

These rules are system-wide and non-negotiable. Every component must comply with all of them.

**Rule 1 — `backdrop-filter: blur` only on floating elements.**
Only elements that literally float above page content (navbar, mobile sidebar, modal backdrops, sticky bars, or an explicitly floating `CardContainer` with `backdropBlur` enabled) use `backdrop-filter`. Content cards are opaque — they use `background: #0B131E`. `blur` signals "I am floating"; opaque signals "I am content". Never apply `backdrop-filter` to feature cards, release cards, pipeline cards, or any card that lives in normal document flow. `CardContainer` defaults to `backdropBlur="none"`; `backdropBlur="sm" | "md" | "lg"` is only for floating/glass treatments above other content.

**Rule 2 — Never animate gradient background directly. Use `::before` opacity instead.**
A `linear-gradient` cannot be transitioned by the browser. Instead, place the hover gradient on a `::before` pseudo-element with `opacity: 0`, then transition only `opacity` to `1` on hover. This runs on the GPU compositor and produces a smooth fade. The background property on the element itself remains static or uses only simple `background-color` transitions.

```css
/* ✅ Correct pattern */
.card {
  background: rgba(255, 255, 255, 0.025);
  position: relative;
  overflow: hidden;
}
.card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 0, 54, 0.07) 0%,
    transparent 55%
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}
.card:hover::before {
  opacity: 1;
}
```

**Rule 3 — Decorative glow is semantic; focus glow is accessibility.**
Treat decorative glow/elevation as part of the component contract, not as a raw visual toggle. A component may ship with decorative glow at rest, on hover, or not at all depending on its variant semantics. Where the component API supports it, expose `emphasis="default" | "flat"` so quiet contexts can suppress decorative glow without changing hierarchy, behavior, or semantics.

Focus-visible rings/glows are different: they are accessibility affordances and must never be disabled by `emphasis`, quiet modes, or decorative shadow toggles. Never remove `shadow-glow-focus-*`, focus rings, or selected-state accessibility glow through decorative API controls.

**Rule 4 — `backdrop-filter` and gradient on the same element are forbidden.**
A frosted element (`backdrop-filter: blur`) must not also carry a decorative gradient background layer. They conflict visually (the blur already creates depth) and can cause GPU compositing artifacts. Choose one: frosted surface OR gradient surface.

**Rule 5 — Never use `transition: all`.**
Always enumerate exactly the properties being animated. `transition: all` animates every CSS property including layout-forcing ones (`width`, `height`, `top`, `left`, `padding`), which triggers reflow and causes jank. Permitted properties to animate: `opacity`, `transform`, `box-shadow`, `background-color`, `border-color`, `color`, `gap`.

```css
/* ✅ Correct */
transition:
  box-shadow 0.25s ease,
  background 0.25s ease;
/* ❌ Wrong */
transition: all 0.25s ease;
```

**Rule 6 — Hover direction is tonally upward for both primary and secondary.**
On `:hover`, primary button gradient shifts lighter (`#ff1a4b → #ff3366` start, `#cc0030 → #e0003a` end) and glow intensity increases. Secondary button background tint increases from `rgba(255,0,54,0.06)` to `rgba(255,0,54,0.12)` and border opacity increases. Hover always makes elements feel more elevated — never darker or more muted.

**Rule 7 — Focus ring uses `box-shadow`, never `outline`.**
`outline` does not respect `border-radius` — it draws a rectangle around a pill button. `box-shadow` follows the shape. Use:

- Dark: `box-shadow: 0 0 0 3px rgba(255, 0, 54, 0.40)`
- Light: `box-shadow: 0 0 0 3px rgba(219, 20, 60, 0.35)`

Never use `outline: none` without an alternative visible focus indicator.

**Rule 8 — Disabled state uses opacity, never color change.**
`opacity: 0.4` on the entire component signals disabled. Never change text color, border color, or background to a "grey" variant — this creates a fake semantic signal and breaks the visual system. Always pair with `cursor: not-allowed` and `pointer-events: none`.

**Rule 9 — Gradient borders use `::before` pseudo-element, never `border-image`.**
`border-image` does not work with `border-radius` — the gradient clips to a rectangle, destroying the pill shape. The correct technique uses `::before` absolutely positioned with `inset: -1.5px` and `z-index: -1`, with the gradient as its `background` and `border-radius: inherit`.

**Rule 10 — Visual control height and touch target are not the same thing.**
The shared visual scale for comparable action controls is `xs | sm | md | lg` = `24px | 32px | 40px | 48px`, exposed through `--spacing-control-*` and Tailwind utilities `h-control-*` / `w-control-*`. `Button`, `IconButton`, and CTA `Link` (`button` / `outlined`) should consume that scale so their visual heights do not drift. `Link` `regular` remains inline typographic navigation.

`Input` and `Select` are form controls: their height accounts for label, floating label, adornments, and alignment between fields, so they use the semantic `form-field` scale (`--spacing-form-field-sm|md|lg` = `48px | 56px | 64px`) instead of the visual action scale. If more fields share that logic, align them with `Input`/`Select`, not `Button`.

`--spacing-touch-target-min` (`44px`) is touch-target guidance for touch-first surfaces, primary mobile CTAs, or hit-area wrappers. It is not a universal visual height for every web control. Compact or dense components may stay below `44px` when that is documented, they still use native controls, and keyboard/focus behavior remains accessible. `Checkbox` and `Switch` are examples where the hit area can grow without changing the visible shape; `TextArea`, `Chip`, and `Badge` are intentional exceptions with different semantics.

**Action size scale — `xs | sm | md | lg`.**
For `Button`, `IconButton`, and Link variants used as actions (`button` / `outlined`), `xs` is the compact dense size. `sm`, `md`, and `lg` follow the same shared semantic visual scale, while touch target is evaluated separately by context.

**Rule 11 — Never animate layout-forcing properties.**
Do not animate `width`, `height`, `top`, `left`, `margin`, `padding`. These trigger layout reflow on every frame. For position animations use `transform: translateY/translateX`. For size animations use `transform: scale`.

**Rule 12 — Cards that are interactive links use `position: relative; z-index: 1` on content children.**
When a card has a `::before` hover gradient overlay, all content children need `position: relative; z-index: 1` to appear above the overlay. Forgetting this causes text and icons to be covered by the gradient layer on hover.

---

## 2. State Behavior Reference

| State        | What changes                                                                                                                                                                 | What never changes                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **hover**    | `box-shadow` intensifies; gradient shifts lighter (primary); background tint increases (secondary); `border-color` opacity increases; `transform: translateY(-6px)` on cards | Border radius; font weight; text color (stays `#ffffff` on primary/secondary); component dimensions |
| **focus**    | `box-shadow` adds 3px ring: `0 0 0 3px rgba(255,0,54,0.40)` dark / `0 0 0 3px rgba(219,20,60,0.35)` light, merged with existing shadow                                       | Gradient; background tint; `border-color`; dimensions                                               |
| **active**   | Gradient shifts darker (`#ff1a4b → #cc002b` primary); scale compresses slightly (`transform: scale(0.98)`); glow contracts                                                   | Border radius; text color; font weight                                                              |
| **disabled** | `opacity: 0.4`; `cursor: not-allowed`; `pointer-events: none`                                                                                                                | All colors stay identical to base state — no grey substitution                                      |

---

## 3. Components

### 3.1 Button — Primary

**Base (dark):**

```css
background: linear-gradient(135deg, #ff1a4b 0%, #cc0030 100%);
border: none;
border-radius: 9999px;
color: #ffffff;
font-family: "Space Grotesk Variable", system-ui, sans-serif;
font-weight: 600;
font-size: 1rem; /* body size; button--lg adds more padding */
letter-spacing: 0.01em;
line-height: 1.6;
padding: 10px 20px; /* minimum; button--lg typically 0.65rem 1.75rem */
height: var(--spacing-control-md); /* default visual control height; use touch-target-min only for touch-first hit areas */
cursor: pointer;
box-shadow:
  0 0 0 1.5px rgba(255, 60, 90, 0.5),
  0 0 16px 4px rgba(255, 0, 54, 0.45),
  0 0 40px 6px rgba(255, 0, 54, 0.18),
  inset 0 1px 0 rgba(255, 255, 255, 0.15);
transition:
  box-shadow 0.25s ease,
  background 0.25s ease;
```

**Hover (dark):**

```css
background: linear-gradient(135deg, #ff3366 0%, #e0003a 100%);
box-shadow:
  0 0 0 1.5px rgba(255, 80, 110, 0.7),
  0 0 22px 4px rgba(255, 0, 54, 0.65),
  0 0 55px 8px rgba(255, 0, 54, 0.28),
  inset 0 1px 0 rgba(255, 255, 255, 0.2);
```

**Hero variant hover (stronger glow — used in hero / sticky bar):**

```css
background: linear-gradient(135deg, #ff3366 0%, #e0003a 100%);
box-shadow:
  0 0 0 1.5px rgba(255, 80, 110, 0.8),
  0 0 26px 4px rgba(255, 0, 54, 0.75),
  0 0 70px 8px rgba(255, 0, 54, 0.35),
  inset 0 1px 0 rgba(255, 255, 255, 0.22);
```

**Focus (dark):**

```css
/* Merged with base box-shadow — add the focus ring as the outermost layer */
box-shadow:
  0 0 0 3px rgba(255, 0, 54, 0.4),
  0 0 0 1.5px rgba(255, 60, 90, 0.5),
  0 0 16px 4px rgba(255, 0, 54, 0.45),
  0 0 40px 6px rgba(255, 0, 54, 0.18),
  inset 0 1px 0 rgba(255, 255, 255, 0.15);
outline: none;
```

**Active (dark):**

```css
transform: scale(0.98);
background: linear-gradient(135deg, #cc0030 0%, #990020 100%);
```

**Disabled:**

```css
opacity: 0.4;
cursor: not-allowed;
pointer-events: none;
/* gradient, glow, and colors remain identical to base — no grey substitution */
```

**Light mode:**
No differences for primary button — white text over red gradient passes contrast in both modes. The gradient values and glow remain the same.

---

### 3.2 Button — Secondary

**Base (dark):**

```css
background: rgba(255, 0, 54, 0.06);
border: 1.5px solid rgba(255, 0, 54, 0.55);
border-radius: 9999px;
color: #ffffff;
font-weight: 600;
font-size: 1rem;
letter-spacing: 0.01em;
line-height: 1.6;
padding: 10px 20px;
height: var(--spacing-control-md); /* default visual control height; use touch-target-min only for touch-first hit areas */
cursor: pointer;
box-shadow:
  0 0 8px 2px rgba(255, 0, 54, 0.15),
  0 0 24px 4px rgba(255, 0, 54, 0.07),
  inset 0 0 10px rgba(255, 0, 54, 0.04);
transition:
  box-shadow 0.25s ease,
  background 0.25s ease,
  border-color 0.25s ease;
```

**Hero / sticky bar base (slightly stronger glow):**

```css
background: rgba(255, 0, 54, 0.06);
border: 1.5px solid rgba(255, 0, 54, 0.55);
box-shadow:
  0 0 10px 2px rgba(255, 0, 54, 0.18),
  0 0 30px 6px rgba(255, 0, 54, 0.08),
  inset 0 0 12px rgba(255, 0, 54, 0.05);
```

**Hover (dark):**

```css
background: rgba(255, 0, 54, 0.12);
border-color: rgba(255, 60, 90, 0.85);
box-shadow:
  0 0 16px 4px rgba(255, 0, 54, 0.35),
  0 0 45px 10px rgba(255, 0, 54, 0.15),
  inset 0 0 16px rgba(255, 0, 54, 0.08);
```

**Focus (dark):**

```css
box-shadow:
  0 0 0 3px rgba(255, 0, 54, 0.4),
  0 0 8px 2px rgba(255, 0, 54, 0.15),
  0 0 24px 4px rgba(255, 0, 54, 0.07),
  inset 0 0 10px rgba(255, 0, 54, 0.04);
outline: none;
```

**Active (dark):**

```css
transform: scale(0.98);
background: rgba(255, 0, 54, 0.16);
```

**Disabled:**

```css
opacity: 0.4;
cursor: not-allowed;
pointer-events: none;
```

**Light mode:**

```css
color: #cc0030;
border-color: rgba(219, 20, 60, 0.5);
/* background remains rgba(255,0,54,0.06) */
```

**Light mode hover:**

```css
color: #8c0b26;
border-color: rgba(219, 20, 60, 0.8);
```

---

### 3.3 Button — Ghost / Outlined

Ghost/outlined is implemented as a secondary button without the inset glow. Used in context where the element is inside a card or section with colored background:

```css
background: transparent;
border: 1.5px solid rgba(255, 0, 54, 0.45);
border-radius: 9999px;
color: #ffffff;
font-weight: 600;
letter-spacing: 0.01em;
padding: 10px 20px;
height: var(--spacing-control-md); /* default visual control height; use touch-target-min only for touch-first hit areas */
transition:
  background 0.2s ease,
  border-color 0.2s ease,
  box-shadow 0.2s ease;
```

**Hover:**

```css
background: rgba(255, 0, 54, 0.08);
border-color: rgba(255, 0, 54, 0.7);
box-shadow: 0 0 8px 2px rgba(255, 0, 54, 0.15);
```

**Focus:**

```css
box-shadow: 0 0 0 3px rgba(255, 0, 54, 0.4);
outline: none;
```

**Note on `releaseLink` inline variant** — same pattern but smaller padding (`0.4rem 1rem`) and used inside cards:

```css
display: inline-flex;
align-items: center;
gap: 0.4rem;
font-size: 0.875rem;
font-weight: 600;
color: #ffffff;
background: rgba(255, 0, 54, 0.06);
border: 1.5px solid rgba(255, 0, 54, 0.55);
padding: 0.4rem 1rem;
border-radius: 9999px;
box-shadow:
  0 0 10px 2px rgba(255, 0, 54, 0.18),
  0 0 30px 6px rgba(255, 0, 54, 0.08);
transition:
  background 0.25s,
  border-color 0.25s,
  box-shadow 0.25s;
```

---

### 3.4 Input — Default

```css
background: #0b131e;
border: 1px solid #202c3c;
border-radius: 8px;
color: #f9f9f9;
font-family: "Space Grotesk Variable", system-ui, sans-serif;
font-size: 1rem;
font-weight: 500;
padding: 10px 14px;
height: var(--spacing-form-field-md); /* form-field md height; Input/Select align by field layout */
width: 100%;
transition:
  border-color 0.2s ease,
  box-shadow 0.2s ease;
```

**Placeholder:**

```css
color: #6a6b6c;
```

**Hover:**

```css
border-color: #172230; /* slightly brighter than rest */
```

**Focus:**

```css
border-color: rgba(255, 0, 54, 0.5);
box-shadow: 0 0 0 3px rgba(255, 0, 54, 0.12);
outline: none;
```

**Disabled:**

```css
opacity: 0.4;
cursor: not-allowed;
pointer-events: none;
```

**Light mode:**

```css
background: #ffffff;
border-color: rgba(0, 0, 0, 0.18);
color: #0a0a0a;
```

**Light mode focus:**

```css
border-color: rgba(219, 20, 60, 0.5);
box-shadow: 0 0 0 3px rgba(219, 20, 60, 0.15);
```

---

### 3.5 Input — Error / Warning / Success / Info States

States change only the `border-color` and `box-shadow`. Background, padding, and font remain identical to default.

**Error:**

```css
border-color: rgba(255, 0, 54, 0.7);
box-shadow: 0 0 0 3px rgba(255, 0, 54, 0.15);
```

**Warning:**

```css
border-color: rgba(251, 191, 36, 0.7); /* --color-warning: #fbbf24 */
box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.12);
```

**Success:**

```css
border-color: rgba(34, 197, 94, 0.7); /* --color-success: #22c55e */
box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
```

**Info:**

```css
border-color: rgba(29, 78, 216, 0.7); /* --color-info-light: #1d4ed8 */
box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.15);
/* dark: border-color: rgba(59, 130, 246, 1); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12); */
```

**Error message text:**

```css
color: #ff0036; /* dark */
/* light: color: #db143c */
font-size: 0.875rem;
font-weight: 500;
margin-top: 4px;
```

---

### 3.6 Dropdown Panel

```css
background: #0b131e; /* same as --color-surface-dark */
border: 1px solid #1a1a1a; /* close to --ifm-color-emphasis-200 */
border-radius: 8px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6); /* --shadow-dropdown */
padding: 4px;
min-width: 150px;
z-index: 100; /* --z-dropdown */
```

**Light mode:**

```css
background: #ffffff;
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
```

**Positioning:** the panel appears below the trigger with a small gap. `position: absolute; top: calc(100% + 4px); left: 0`.

---

### 3.7 Dropdown Item

```css
border-radius: 6px; /* --radius-sm */
font-size: 0.875rem;
font-weight: 500;
padding: 7px 12px;
color: #cccccc; /* --color-text-secondary-dark */
transition:
  background 0.15s ease,
  color 0.15s ease;
cursor: pointer;
text-decoration: none;
display: block;
```

**Hover (dark):**

```css
background: rgba(255, 255, 255, 0.07);
color: #ffffff;
```

**Hover (light):**

```css
background: rgba(0, 0, 0, 0.05);
color: #000000;
```

**Active/selected (dark):**

```css
color: #ff0036; /* --color-brand-dark */
background: rgba(255, 0, 54, 0.08);
```

**Active/selected (light):**

```css
color: #db143c; /* --color-brand-light */
background: rgba(219, 20, 60, 0.06);
```

---

### 3.8 Badge / Tag

**Brand / "New" — dark:**

```css
background: #22c55e; /* success */
color: #000000; /* dark text over green for contrast */
border-radius: 3px; /* --radius-xs */
padding: 1px 6px;
font-size: 10px;
font-weight: 700;
letter-spacing: 0.02em;
line-height: 1.4;
display: inline-block;
vertical-align: middle;
```

**"New" — light:**

```css
background: #16a34a;
color: #ffffff;
```

**Brand pill badge (e.g. version tag, release tag):**

```css
display: inline-flex;
align-items: center;
gap: 0.4rem;
background: color-mix(in srgb, var(--color-primary) 15%, transparent);
/* Fallback: rgba(255, 0, 54, 0.15) dark / rgba(219, 20, 60, 0.15) light */
border: 1px solid color-mix(in srgb, var(--color-primary) 40%, transparent);
/* Fallback: rgba(255, 0, 54, 0.40) dark / rgba(219, 20, 60, 0.40) light */
color: var(--color-primary);
padding: 0.25rem 0.75rem;
border-radius: 9999px;
font-size: 0.8rem;
font-weight: 600;
letter-spacing: 0.02em;
```

**Beta/warning pill badge:**

```css
background: color-mix(in srgb, #f59e0b 15%, transparent);
/* Fallback: rgba(245, 158, 11, 0.15) */
border: 1px solid color-mix(in srgb, #f59e0b 45%, transparent);
color: #f59e0b;
padding: 0.25rem 0.65rem;
border-radius: 9999px;
font-size: 0.75rem;
font-weight: 700;
letter-spacing: 0.04em;
text-transform: uppercase;
```

---

### 3.9 Card — Opaque

Used for feature cards, release list items, tech cards, pipeline steps, code blocks, and any structured content.

```css
background: rgba(255, 255, 255, 0.025); /* visually ~#0B131E in dark context */
border: 1px solid rgba(255, 255, 255, 0.07);
border-radius: 16px; /* cards use lg radius; small cards use 8px */
padding: 1.75rem;
position: relative;
overflow: hidden;
transition:
  border-color 0.3s ease,
  box-shadow 0.3s ease,
  transform 0.3s ease;
```

**`::before` gradient overlay (always present, triggers on hover):**

```css
.card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 0, 54, 0.07) 0%,
    transparent 55%
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}
.card:hover::before {
  opacity: 1;
}
```

**Hover:**

```css
border-color: rgba(255, 0, 54, 0.45);
box-shadow:
  0 0 0 1px rgba(255, 0, 54, 0.12),
  0 8px 40px rgba(255, 0, 54, 0.12),
  0 20px 60px rgba(0, 0, 0, 0.25);
transform: translateY(-6px);
```

**Light mode base:**

```css
background: rgba(0, 0, 0, 0.02);
border-color: rgba(0, 0, 0, 0.08);
```

**Light mode hover:**

```css
border-color: #db143c; /* var(--color-brand-light) */
box-shadow: 0 8px 40px rgba(255, 0, 54, 0.1);
/* No transform: translateY in light mode — optional, not consistently applied */
```

**Content children inside card must have:**

```css
position: relative;
z-index: 1;
```

---

### 3.10 Card — Frosted

Used only for explicitly floating CardContainer glass surfaces. Normal document-flow cards stay opaque.

```css
background: rgba(6, 12, 19, 0.38); /* --color-card-backdrop-dark */
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 0, 54, 0.5); /* --color-red-tint-border */
border-radius: 8px; /* or 12px for larger panels */
```

**Light mode:**

```css
background: rgba(255, 255, 255, 0.32); /* --color-card-backdrop-light */
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 0, 54, 0.5); /* --color-red-tint-border */
```

**CardContainer backdropBlur levels:**

```css
backdropBlur="sm"; /* --blur-card-sm: blur(10px) */
backdropBlur="md"; /* --blur-card-md: blur(20px) */
backdropBlur="lg"; /* --blur-card-lg: blur(36px) */
```

Use these only when the card is visually floating above other content. Leave `backdropBlur="none"` for normal content cards.

**Sticky CTA bar specific (floats below navbar after scroll):**

```css
background: rgba(27, 27, 29, 0.6);
backdrop-filter: blur(18px) saturate(1.4);
-webkit-backdrop-filter: blur(18px) saturate(1.4);
border-bottom: 1px solid rgba(255, 255, 255, 0.06);
box-shadow: 0 4px 24px rgba(0, 0, 0, 0.35);
```

**CRITICAL:** Do NOT combine `backdrop-filter` with a gradient `background`. Choose one.

---

### 3.11 Card — Tinted (Active)

Used for active sidebar items, active menu items, highlighted feature variants:

```css
background: rgba(255, 0, 54, 0.08); /* --color-red-tint-low */
border: 1px solid rgba(255, 0, 54, 0.2);
border-radius: 8px;
```

**Active sidebar link specifically:**

```css
background: rgba(255, 0, 54, 0.1); /* --color-red-tint-mid */
color: #ff0036; /* --color-brand-dark */
font-weight: 600;
border-radius: 8px;
/* No additional border on sidebar links */
```

**Hover on tinted card:**

```css
border-color: rgba(255, 0, 54, 0.38);
background: rgba(
  255,
  0,
  54,
  0.04
); /* lighter than base — card goes more transparent */
box-shadow: 0 4px 30px rgba(255, 0, 54, 0.1);
```

---

### 3.12 Navbar

```css
/* Dark */
background: rgba(6, 12, 19, 0.75); /* --color-navbar-dark */
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
border-bottom: 1px solid #172230; /* --color-border-dark */
position: sticky;
top: 0;
z-index: 300; /* --z-navbar */
```

**Light mode:**

```css
background: rgba(255, 255, 255, 0.7); /* --color-navbar-light */
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
```

**Logo image:** `width: 32px; height: 32px` — explicit size prevents CLS.

**Nav links:**

```css
font-size: 0.85rem;
font-weight: 600;
color: #e0e0e0; /* dark */
transition: color 0.2s ease;
text-decoration: none;
```

**Nav link hover:** `color: #ffffff;`

**Light mode nav links:** `color: #333333;` → `color: #000000;` hover.

**Mobile sidebar panel:**

```css
background: rgba(27, 27, 29, 1);
border-right: 1px solid #1a1a1a;
box-shadow: 4px 0 40px rgba(0, 0, 0, 0.8);
opacity: 0;
transform: translateX(-16px);
transition:
  opacity 0.25s ease,
  transform 0.25s ease;
```

**Mobile sidebar — show state:**

```css
opacity: 1;
transform: translateX(0);
z-index: 1000;
height: 100dvh;
```

**Mobile sidebar backdrop:**

```css
background: rgba(0, 0, 0, 0.6);
backdrop-filter: blur(4px);
-webkit-backdrop-filter: blur(4px);
opacity: 0;
transition: opacity 0.25s ease;
```

---

### 3.13 Link — Inline

Links within body text (announcement bar, release notes, inline CTAs):

```css
color: #ff4d6d; /* slightly lighter than brand for inline legibility */
font-weight: 700;
text-decoration: none;
border-bottom: 1px solid rgba(255, 77, 109, 0.4);
transition:
  color 0.2s ease,
  border-color 0.2s ease;
```

**Hover:**

```css
color: #ff8099;
border-bottom-color: rgba(255, 128, 153, 0.7);
```

**Light mode inline link:** same pattern but use `#db143c` → `#c41136` hover.

**Inline CTA link (featureCta — "Learn more →"):**

```css
color: var(--color-primary); /* #ff0036 dark / #db143c light */
font-weight: 600;
font-size: 0.85rem;
display: inline-flex;
align-items: center;
gap: 0.3rem;
transition: gap 0.2s ease;
text-decoration: none;
```

**Inline CTA hover:** `gap: 0.55rem;` — the arrow slides right.

---

### 3.14 Link — Nav

```css
border-radius: 8px;
padding: 0.45rem 1rem;
font-size: 0.95rem;
font-weight: 500;
color: #cccccc; /* --color-text-secondary-dark */
transition:
  background 0.15s ease,
  color 0.15s ease;
text-decoration: none;
display: block;
```

**Hover (dark):**

```css
background: rgba(255, 255, 255, 0.05); /* --color-white-tint-faint */
color: #ffffff;
```

**Active (dark):**

```css
background: rgba(255, 0, 54, 0.1); /* --color-red-tint-mid */
color: #ff0036;
font-weight: 600;
```

**Mobile sidebar nav link:**

```css
padding: 0.6rem 1rem;
font-size: 0.95rem;
font-weight: 500;
border-radius: 8px;
transition:
  background 0.15s ease,
  color 0.15s ease;
```

---

### 3.15 Modal / Dialog

No existing Modal component in reference codebase. Use the established surface and overlay tokens:

**Backdrop:**

```css
position: fixed;
inset: 0;
background: rgba(0, 0, 0, 0.6); /* --color-overlay-dark */
backdrop-filter: blur(4px);
-webkit-backdrop-filter: blur(4px);
z-index: 400; /* --z-modal */
opacity: 0;
transition: opacity 0.25s ease;
```

**Panel:**

```css
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%) scale(0.96);
background: #0b131e; /* --color-surface-dark */
border: 1px solid #172230; /* --color-border-dark */
border-radius: 12px; /* --radius-lg */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
padding: 2rem;
width: min(90vw, 560px);
z-index: 401;
opacity: 0;
transition:
  opacity 0.25s ease,
  transform 0.25s ease;
```

**Open state:**

```css
opacity: 1;
transform: translate(-50%, -50%) scale(1);
```

**Light mode panel:**

```css
background: #ffffff;
border-color: rgba(0, 0, 0, 0.1);
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
```

---

### 3.16 Announcement Bar / Version Banner

**Announcement bar (Docusaurus global bar — full width above navbar):**

```css
border-bottom: 1px solid rgba(255, 0, 54, 0.35);
font-size: 0.85rem;
font-weight: 500;
letter-spacing: 0.01em;
/* Hidden on mobile: display: none at max-width: 768px */
```

**Link inside bar:**

```css
color: #ff4d6d;
font-weight: 700;
text-decoration: none;
border-bottom: 1px solid rgba(255, 77, 109, 0.4);
transition:
  color 0.2s ease,
  border-color 0.2s ease;
```

**Link hover:**

```css
color: #ff8099;
border-bottom-color: rgba(255, 128, 153, 0.7);
```

**Version Banner (custom component — dark strip between bar and page):**

```css
background-color: #0d0d0d;
color: #ffffff;
text-align: center;
padding: 8px 16px;
font-size: 14px; /* 0.875rem */
line-height: 1.5;
/* Hidden on mobile: display: none at max-width: 768px */
```

**Links in version banner:** Same `#ff4d6d` / `#db143c` light mode pattern as inline links.

---

## 4. Glow System

### 4-Layer Pattern (Button Primary — canonical example)

The primary button glow has four layers with distinct purposes:

```css
box-shadow:
  /* Layer 1 — tight ring: simulates a 1.5px border with tint.
     Acts as a border-replacement with color energy.
     Stays sharp, no spread beyond the button edge. */
  0 0 0 1.5px rgba(255, 60, 90, 0.5),
  /* Layer 2 — near glow (halo): immediate luminosity around the button.
     4px blur, 4px spread — fills the corona right outside the button.
     Makes the button feel like it's emitting light. */
  0 0 16px 4px rgba(255, 0, 54, 0.45),
  /* Layer 3 — far dispersal: broad bloom that fades into the background.
     40px blur, 6px spread — creates the "neon" feel.
     Low opacity so it doesn't overpower; adds depth to dark surfaces. */
  0 0 40px 6px rgba(255, 0, 54, 0.18),
  /* Layer 4 — inset top highlight: simulates light hitting the top edge.
     Adds the glass-like highlight that gives the button dimension.
     Purely decorative; creates a subtle 3D feel. */
  inset 0 1px 0 rgba(255, 255, 255, 0.15);
```

### Hover amplification:

```css
box-shadow:
  0 0 0 1.5px rgba(255, 80, 110, 0.7),
  /* tighter ring: more saturated */
  0 0 22px 4px rgba(255, 0, 54, 0.65),
  /* near glow: 22px vs 16px, 0.65 vs 0.45 */
  0 0 55px 8px rgba(255, 0, 54, 0.28),
  /* far dispersal: 55px vs 40px, 0.28 vs 0.18 */
  inset 0 1px 0 rgba(255, 255, 255, 0.2); /* inset: 0.20 vs 0.15 */
```

### Decorative glow timing and emphasis

| Element                                   | Default decorative glow behavior                                   | `emphasis="flat"`                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Button Primary                            | **Always-on** — 4-layer glow at rest, amplified on hover           | Removes decorative glow, keeps focus ring                                          |
| Button Secondary / Outlined               | **Always-on** — soft contained glow at rest, amplified on hover    | Removes decorative glow, keeps focus ring                                          |
| IconButton Primary / Secondary / Outlined | Matches button semantics for the same variant family               | Removes decorative glow, keeps focus ring                                          |
| CTA Link `button` / `outlined`            | Decorative glow by variant contract                                | Removes decorative glow, keeps focus ring                                          |
| Chip                                     | No decorative glow API; color/variant carries status semantics     | N/A — focus/selected accessibility glow remains independent                          |
| Switch `emphasis="default"`               | Decorative glow by emphasis contract                               | `emphasis="flat"` removes decorative glow, keeps focus ring                        |
| Feature Card                              | **Hover-only** — no glow at rest, box-shadow appears on hover      | N/A unless a component-specific API is added                                       |
| Nav Badge (GitHub stars)                  | **Hover-only** — amber ring appears only on hover                  | N/A unless a component-specific API is added                                       |
| Logo icon (glowing)                       | **Always-on** — `filter: drop-shadow(0 0 20px rgba(255,0,54,0.4))` | Component-specific decision                                                        |
| Inline CTA links                          | **No glow** — color transition only                                | No effect                                                                          |

### Secondary button glow (3-layer, contained):

```css
box-shadow:
  /* L1: near glow */
  0 0 8px 2px rgba(255, 0, 54, 0.15),
  /* L2: mid dispersal */
  0 0 24px 4px rgba(255, 0, 54, 0.07),
  /* L3: inset tint (no top highlight) */
  inset 0 0 10px rgba(255, 0, 54, 0.04);
```

No tight ring layer — secondary doesn't need a border simulation because it already has a real `border: 1.5px solid`.

---

## 5. Gradient Border Technique

### Why `border-image` fails with `border-radius`

`border-image` replaces the `border` rendering and ignores `border-radius`. A pill button (`border-radius: 9999px`) with `border-image` renders as a rectangle with gradient edge clips at the corners. There is no workaround for this in CSS — `border-image` is fundamentally incompatible with `border-radius`.

### The `::before` pseudo-element technique

The gradient border is created by positioning a pseudo-element behind the component that extends 1.5px in every direction using `inset: -1.5px`. The parent has `border: 1.5px solid transparent` and `background-clip: padding-box` to prevent the parent's background from showing through the border area.

```css
.gradient-border-component {
  position: relative;
  border: 1.5px solid transparent;
  background-clip: padding-box;
  border-radius: 9999px; /* or any radius */
  background: rgba(255, 0, 54, 0.06); /* the actual fill */
}

.gradient-border-component::before {
  content: "";
  position: absolute;
  inset: -1.5px;
  border-radius: inherit; /* critical: inherits the pill shape */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.18) 0%,
    rgba(255, 0, 54, 0.55) 40%,
    rgba(255, 0, 54, 0.15) 100%
  );
  z-index: -1;
}
```

### GPU compositing benefit

The `::before` gradient is a static painted layer. On hover, we transition only `opacity` on the `::before` (or swap the background with a higher-opacity version). Since `opacity` changes are handled by the GPU compositor — not the main thread — this avoids layout and paint work. Animating `background` directly on a gradient would repaint every frame.

### Exact gradient values — Secondary button (ghost highlight):

```css
/* Tight directional gradient — white flash from top-left, red dominance mid, fades to transparent */
background: linear-gradient(
  135deg,
  rgba(255, 255, 255, 0.12) 0%,
  rgba(255, 0, 54, 0.45) 45%,
  rgba(255, 0, 54, 0.08) 100%
);
```

### When to use gradient border

- Secondary / ghost buttons that need visual weight without solid fill
- Input fields in focus state (transition `::before` opacity from 0 to 1)
- Active cards with accent border
- Never on structural separators, table borders, or layout containers

---

## 6. Transition Rules

| Interaction type                           | Duration              | Easing                           | Properties                                 |
| ------------------------------------------ | --------------------- | -------------------------------- | ------------------------------------------ |
| Button hover (primary/secondary)           | 250ms                 | `ease`                           | `box-shadow`, `background`                 |
| Button hover (secondary — includes border) | 250ms                 | `ease`                           | `box-shadow`, `background`, `border-color` |
| Card hover                                 | 300ms                 | `ease`                           | `border-color`, `box-shadow`, `transform`  |
| Card `::before` gradient reveal            | 300ms                 | implicit `ease`                  | `opacity`                                  |
| Dropdown / menu item hover                 | 150ms                 | `ease`                           | `background`, `color`                      |
| Inline link hover                          | 200ms                 | `ease`                           | `color`, `border-color`                    |
| Locale switcher / nav badge hover          | 200ms                 | `ease`                           | `border-color`, `box-shadow`               |
| GitHub stars badge parts                   | 200ms                 | `ease`                           | `background`, `color`                      |
| Modal / sidebar entrance                   | 250ms                 | `ease`                           | `opacity`, `transform`                     |
| Sticky bar entrance                        | 350ms                 | `ease`                           | `opacity`, `transform`                     |
| Scroll fade-in (IntersectionObserver)      | 560ms                 | `cubic-bezier(0.2, 0.8, 0.2, 1)` | `opacity`, `transform`                     |
| Pipeline hover expand                      | 400–450ms             | `cubic-bezier(0.4, 0, 0.2, 1)`   | `flex`, `max-width`                        |
| Pipeline right panel fade-in               | 200ms (delayed 450ms) | `ease`                           | `opacity`                                  |
| Nav link color                             | 200ms                 | `ease`                           | `color`                                    |

**Rule:** NEVER use `transition: all`. Always enumerate exact properties.

**Permitted animatable properties:** `opacity`, `transform`, `box-shadow`, `background-color`, `border-color`, `color`, `gap`, `flex`, `max-width` (for expand patterns), `filter` (for icon glows).

**NEVER animate:** `width`, `height`, `top`, `right`, `bottom`, `left`, `margin`, `padding` — these trigger layout reflow.

---

## 7. Accessibility Checklist

### Buttons

- [ ] Visual height aligns with the `control` scale (`h-control-xs|sm|md|lg`) for the size prop
- [ ] Focus ring: `box-shadow: 0 0 0 3px rgba(255, 0, 54, 0.40)` dark / `0 0 0 3px rgba(219, 20, 60, 0.35)` light
- [ ] Focus ring merged with existing `box-shadow` — never replaces it
- [ ] Focus ring never hidden: no `outline: none` without alternative
- [ ] Disabled: `opacity: 0.4`, `cursor: not-allowed`, `pointer-events: none` — no color change
- [ ] Primary: white `#ffffff` text over red gradient — contrast passes in both modes
- [ ] Secondary dark: `color: #ffffff` over `rgba(255,0,54,0.06)` — visually dark background context; border defines the affordance
- [ ] Secondary light: `color: #cc0030` — NEVER `#ff0036` in light mode (insufficient contrast over white)
- [ ] Touch target is evaluated by context: use `touch-target-min` (`44px`) on touch-first surfaces or hit-area wrappers; documented compact/dense variants may keep smaller visual height when keyboard/focus accessible
- [ ] `role="button"` if implemented as non-`<button>` element

### Inputs

- [ ] Visual height aligns with the `form-field` scale (`h-form-field-sm|md|lg`) and stays consistent between fields like `Input` and `Select`; do not force `h-control-*` when label/floating-label layout is part of the pattern
- [ ] Placeholder text `#6a6b6c` — WCAG exempts placeholder from contrast (informational, not functional)
- [ ] Error state: border + shadow change, NOT color of input text
- [ ] Info state: border + shadow change with `--color-info-light` in light mode and `--color-info` in dark mode; never treat it as neutral helper styling
- [ ] Error message: `color: #ff0036` dark / `#db143c` light — check contrast on surface background
- [ ] Labels always visible — never placeholder-only inputs
- [ ] Focus ring: `box-shadow: 0 0 0 3px rgba(255, 0, 54, 0.12)` (softer than button — 12% not 40%)
- [ ] Disabled: `opacity: 0.4`, `cursor: not-allowed`, `pointer-events: none`

### Interactive cards / links

- [ ] Cards with `href` wrapped in `<a>` or `<Link>`: `text-decoration: none; color: inherit` on wrapper, actual CTA text carries the color
- [ ] `aria-label` on cards without explicit visible label describing destination
- [ ] Focus ring on the `<a>` wrapper: `box-shadow: 0 0 0 3px rgba(255, 0, 54, 0.40)`, `outline: none`
- [ ] `transform: translateY(-6px)` on hover: respects `@media (prefers-reduced-motion: reduce)` — set `transform: none; transition: none`
- [ ] `FeatureCard` uses `aria-label={title}` on the `<article>` element ✅

### Dropdown / nav items

- [ ] Each item `padding: 7px 12px` minimum — 14px font achieves ~28px height; use `touch-target-min` wrappers when the menu is touch-first
- [ ] Active item: `color: #ff0036` — contrast 4.96:1 on `#0B131E` surface ✅
- [ ] Hover: background change + color change — two simultaneous signals (not hover-only)
- [ ] Keyboard navigation: dropdown must be traversable with Tab/Arrow keys

### Announcements / banners

- [ ] `font-size` minimum `0.85rem` (13.6px) for announcement bars
- [ ] Link color `#ff4d6d` — check contrast on bar background color
- [ ] Hidden on mobile (`display: none` at `max-width: 768px`) — ensure content is accessible another way

### Motion

- [ ] `@media (prefers-reduced-motion: reduce)` disables all scroll fade-ins, card transform, pipeline animations
- [ ] Ambient background glows (`glowPulse`, `spotBreath`) set `animation: none` under reduced-motion
- [ ] Maximum transition duration: 560ms (scroll fade-in) — interactive transitions max 300ms

---

## 8. Anti-Patterns

### ❌ Using `transition: all`

```css
/* ❌ Wrong — animates every property including layout-forcing ones */
.button {
  transition: all 0.25s ease;
}

/* ✅ Correct — enumerate only the properties that change */
.button {
  transition:
    box-shadow 0.25s ease,
    background 0.25s ease;
}
```

Animating `all` will trigger layout reflow if any dimensional property changes, causing jank. It also animates `color`, `opacity`, and `transform` simultaneously even when they shouldn't be.

---

### ❌ Animating gradient background directly

```css
/* ❌ Wrong — gradients cannot be interpolated; transition is ignored */
.button {
  background: linear-gradient(135deg, #ff1a4b 0%, #cc0030 100%);
  transition: background 0.25s ease;
}
.button:hover {
  background: linear-gradient(135deg, #ff3366 0%, #e0003a 100%);
}
```

```css
/* ✅ Correct — gradient on ::before, transition only opacity */
.card {
  background: rgba(255, 255, 255, 0.025);
  position: relative;
  overflow: hidden;
}
.card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 0, 54, 0.07) 0%,
    transparent 55%
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}
.card:hover::before {
  opacity: 1;
}
```

Note: buttons ARE the exception — their `background` gradient transition is permitted and works because the browser animates between a static base and static hover state (it paints both, and cross-fades). This still uses `transition: box-shadow 0.25s ease, background 0.25s ease` explicitly.

---

### ❌ `backdrop-filter` on content cards

```css
/* ❌ Wrong — content cards are opaque, not floating */
.featureCard {
  backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.025);
}

/* ✅ Correct — content cards are opaque */
.featureCard {
  background: rgba(255, 255, 255, 0.025); /* visually ~#0B131E */
  /* NO backdrop-filter */
}

/* ✅ Blur is only for floating surfaces */
.navbar {
  background: rgba(6, 12, 19, 0.75);
  backdrop-filter: blur(16px);
}

/* ✅ CardContainer backdropBlur is allowed only when the card is floating */
.floatingGlassCard {
  background: rgba(6, 12, 19, 0.38);
  border-color: rgba(255, 0, 54, 0.5);
  backdrop-filter: blur(20px); /* CardContainer backdropBlur="md" */
}
```

Blur on content cards creates a visual hierarchy confusion: it signals "floating" when the card is grounded content. It also has significant GPU cost on long pages with many cards.

---

### ❌ Single-layer glow

```css
/* ❌ Wrong — flat single shadow lacks depth and looks cheap */
.button--primary {
  box-shadow: 0 0 20px rgba(255, 0, 54, 0.5);
}

/* ✅ Correct — 4-layer glow system */
.button--primary {
  box-shadow:
    0 0 0 1.5px rgba(255, 60, 90, 0.5),
    0 0 16px 4px rgba(255, 0, 54, 0.45),
    0 0 40px 6px rgba(255, 0, 54, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}
```

Single-layer glows have no tight ring, no near halo, no far dispersal, and no inset highlight. The result looks like a blurry shadow, not a neon glow.

---

### ❌ Flat border on secondary button

```css
/* ❌ Wrong — flat opaque border loses the brand energy */
.button--secondary {
  border: 2px solid #ff0036;
}

/* ✅ Correct — semitransparent border + glow + tinted background */
.button--secondary {
  background: rgba(255, 0, 54, 0.06);
  border: 1.5px solid rgba(255, 0, 54, 0.55);
  box-shadow:
    0 0 8px 2px rgba(255, 0, 54, 0.15),
    0 0 24px 4px rgba(255, 0, 54, 0.07),
    inset 0 0 10px rgba(255, 0, 54, 0.04);
}
```

A flat `#ff0036` border at full opacity is harsh and breaks the softness of the system. The correct approach uses semitransparent border at 55% opacity paired with a complementary glow.

---

### ❌ `outline` for focus rings

```css
/* ❌ Wrong — outline doesn't follow border-radius */
.button:focus {
  outline: 3px solid rgba(255, 0, 54, 0.4);
}

/* ✅ Correct — box-shadow follows border-radius perfectly */
.button:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 3px rgba(255, 0, 54, 0.4),
    /* focus ring */ 0 0 0 1.5px rgba(255, 60, 90, 0.5),
    /* existing glow layer 1 */ 0 0 16px 4px rgba(255, 0, 54, 0.45),
    /* existing glow layer 2 */ 0 0 40px 6px rgba(255, 0, 54, 0.18),
    /* existing glow layer 3 */ inset 0 1px 0 rgba(255, 255, 255, 0.15); /* existing glow layer 4 */
}
```

On pill buttons, `outline` renders as a rectangle with optional gap, destroying the shape. `box-shadow: 0 0 0 3px` spreads as a solid ring that follows `border-radius: 9999px`.

---

### ❌ Color change for disabled state

```css
/* ❌ Wrong — grey substitution creates false semantic signals */
.button--primary:disabled {
  background: #444444;
  color: #888888;
  border-color: #333333;
}

/* ✅ Correct — opacity signals disabled; colors unchanged */
.button--primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}
```

Changing to grey doesn't communicate WHY it's disabled and breaks visual consistency. Opacity at 0.4 preserves the component's identity while clearly signaling unavailability.

---

### ❌ Hover as the only state indicator

```css
/* ❌ Wrong — hover-only, no focus/active state */
.navLink:hover {
  color: #ffffff;
}
/* No :focus-visible rule */

/* ✅ Correct — hover AND focus AND active */
.navLink:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}
.navLink:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 0, 54, 0.4);
  color: #ffffff;
}
.navLink:active {
  background: rgba(255, 255, 255, 0.08);
}
```

Hover-only indicators are inaccessible to keyboard users. The `:focus-visible` pseudo-class shows the ring only for keyboard navigation (not mouse click focus), which is the correct modern approach.

---

### ❌ `border-image` for gradient borders

```css
/* ❌ Wrong — border-image ignores border-radius */
.button--secondary {
  border: 1.5px solid transparent;
  border-image: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.18),
      rgba(255, 0, 54, 0.55)
    )
    1;
  border-radius: 9999px; /* THIS IS IGNORED */
}

/* ✅ Correct — ::before technique */
.button--secondary {
  position: relative;
  border: 1.5px solid transparent;
  background-clip: padding-box;
  border-radius: 9999px;
}
.button--secondary::before {
  content: "";
  position: absolute;
  inset: -1.5px;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 0, 54, 0.45) 45%,
    rgba(255, 0, 54, 0.08) 100%
  );
  z-index: -1;
}
```

`border-image` with `slice: 1` literally clips the gradient to rectangular segments, completely ignoring `border-radius`. This has been a CSS limitation since `border-image` was introduced.

---

### ❌ Mixing `backdrop-filter` and gradient on the same element

```css
/* ❌ Wrong — frosted + gradient is visually noisy and GPU-expensive */
.navbar {
  background: linear-gradient(
    135deg,
    rgba(255, 0, 54, 0.1),
    rgba(6, 12, 19, 0.9)
  );
  backdrop-filter: blur(16px);
}

/* ✅ Correct — frosted uses a simple translucent background */
.navbar {
  background: rgba(6, 12, 19, 0.75); /* simple tinted, no gradient */
  backdrop-filter: blur(16px);
}
```

`backdrop-filter: blur` already creates a visual depth effect by showing a blurred version of what's behind. Adding a gradient on top creates competing depth signals and reduces legibility. Reserve gradients for opaque elements.

---

### ❌ Using `#000000` as dark background

```css
/* ❌ Wrong — pure black has no chromatic identity */
.page {
  background: #000000;
}

/* ✅ Correct — deep blue-slate with a cold tint */
.page {
  background: #060c13; /* --color-background-dark: H215 S50 */
}
```

The canonical dark background is `#060C13` (blue-slate, H215 S50 — a perceptible cold tint). Pure black `#000000` looks lifeless and has no relationship with the rest of the color system. The warm red brand color has more presence and resonance against the cold-tinted dark.

---

### ❌ Using `#ff0036` as text color in light mode

```css
/* ❌ Wrong — #ff0036 over white fails WCAG AA */
[data-theme="light"] .button--secondary {
  color: #ff0036;
}

/* ✅ Correct — use #cc0030 or darker in light mode */
[data-theme="light"] .button--secondary {
  color: #cc0030; /* 5.4:1 on white ✅ */
}
/* For active states: */
[data-theme="light"] .button--secondary:hover {
  color: #8c0b26; /* even more contrast on hover */
}
```

`#ff0036` achieves only ~3.9:1 on pure white — below WCAG AA (4.5:1). Always use `#cc0030` or `#db143c` as the minimum red in light contexts.

---

### ❌ Placing the grid background inside cards or dropdowns

```css
/* ❌ Wrong — grid only belongs on root canvas */
.dropdown {
  background:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px) 0 0 / 40px
      40px,
    #0b131e;
}

/* ✅ Correct — grid only on page-level wrappers */
.page-wrapper {
  background:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px) 0 0 / 40px
      40px,
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px) 0
      0 / 40px 40px,
    #060c13;
}
.dropdown {
  background: #0b131e; /* solid surface — no grid */
}
```

The grid is a page canvas texture, not a surface texture. Applied to cards/dropdowns it creates excessive visual noise and reduces readability of content.
