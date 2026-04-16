# Visual Review Skill — Stack-and-Flow

## Trigger

Load this skill when: reviewing component visual quality, auditing component states, writing new component variants, checking hover/focus/active states, checking accessibility of interactive elements, verifying glow correctness, validating transition rules, or checking gradient border technique.

## Purpose

This skill gives you the criteria to evaluate WHETHER a component LOOKS correct — not just whether it uses the right tokens, but whether the visual composition is coherent with the Stack-and-Flow system. Every rule here is derived from actual design decisions; none are arbitrary.

## Before You Review

Always read (in this order):

1. `docs/COMPONENTS.md` — state-by-state spec for every component
2. `docs/DESIGN.md` section 5 — component specs and section 4 — surface system
3. `src/styles/theme.css` — verify token values before flagging issues

> **Never flag a value as wrong without checking `theme.css` first.** The token may be exactly correct; the issue may be that a raw value is being used instead of a token.

---

## Review Protocol

For every interactive component, check ALL of the following sections.

### 1. State Completeness

- [ ] **Base state** — defined with correct background, border, glow/shadow, and text color
- [ ] **Hover state** — defined; transitions tonally upward (lighter, more elevated), never darker or more muted
- [ ] **Focus state** — defined with visible focus ring via `box-shadow`, NOT `outline`
- [ ] **Active/pressed state** — defined; gradient shifts darker + `transform: scale(0.98)`
- [ ] **Disabled state** — `opacity: 0.4` + `cursor: not-allowed` + `pointer-events: none` — no color/grey substitution

### 2. Glow Correctness

**Button Primary (always-on, 4-layer):**
- [ ] Layer 1 — tight ring: `0 0 0 1.5px rgba(255, 60, 90, 0.5)` — present at base
- [ ] Layer 2 — near glow: `0 0 16px 4px rgba(255, 0, 54, 0.45)` — present at base
- [ ] Layer 3 — far dispersal: `0 0 40px 6px rgba(255, 0, 54, 0.18)` — present at base
- [ ] Layer 4 — inset top highlight: `inset 0 1px 0 rgba(255, 255, 255, 0.15)` — present at base
- [ ] Hover amplifies all 4 layers: ring `→ 0.7 opacity`, near `→ 22px/0.65`, far `→ 55px/0.28`, inset `→ 0.20`
- [ ] Focus ring added as outermost layer: `0 0 0 3px rgba(255, 0, 54, 0.40)` — merged, not replacing existing layers

**Button Secondary (always-on, 3-layer, no tight ring):**
- [ ] Layer 1 — near glow: `0 0 8px 2px rgba(255, 0, 54, 0.15)`
- [ ] Layer 2 — mid dispersal: `0 0 24px 4px rgba(255, 0, 54, 0.07)`
- [ ] Layer 3 — inset tint: `inset 0 0 10px rgba(255, 0, 54, 0.04)`
- [ ] No tight ring — secondary has a real `border: 1.5px solid`
- [ ] Hover intensifies: `0 0 16px 4px/0.35`, `0 0 45px 10px/0.15`, `inset 0 0 16px/0.08`

**Cards, badges, nav (hover-only glow):**
- [ ] No `box-shadow` at rest (except buttons)
- [ ] Card hover glow: `0 0 0 1px rgba(255,0,54,0.12), 0 8px 40px rgba(255,0,54,0.12), 0 20px 60px rgba(0,0,0,0.25)`
- [ ] Logo icon: `filter: drop-shadow(0 0 20px rgba(255,0,54,0.4))` — always-on is correct for logo
- [ ] Inline CTA links: no glow — color transition only

### 3. Blur vs. Gradient Rule

- [ ] `backdrop-filter: blur()` is ONLY used on floating elements: navbar, mobile sidebar, modal backdrops, sticky bars
- [ ] Content cards (feature cards, release cards, pipeline cards, code blocks) use `background: #0B131E` or `rgba(255,255,255,0.025)` — NO `backdrop-filter`
- [ ] A single element never carries BOTH `backdrop-filter: blur` AND a decorative gradient `background` simultaneously
- [ ] Blur signals "floating"; opaque signals "content" — hierarchy must be visually coherent

### 4. Transition Correctness

- [ ] **Never `transition: all`** — always enumerate specific properties
- [ ] Button primary/secondary hover: `transition: box-shadow 0.25s ease, background 0.25s ease`
- [ ] Button secondary (includes border): add `border-color 0.25s ease`
- [ ] Cards: `transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease`
- [ ] Card `::before` gradient: `transition: opacity 0.3s` — only `opacity`, never `background`
- [ ] Dropdown items: `transition: background 0.15s ease, color 0.15s ease`
- [ ] Inline links: `transition: color 0.2s ease, border-color 0.2s ease`
- [ ] Modal/sidebar entrance: `transition: opacity 0.25s ease, transform 0.25s ease`
- [ ] Scroll fade-ins: `transition: opacity 560ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 560ms ...`
- [ ] **NEVER animate:** `width`, `height`, `top`, `right`, `bottom`, `left`, `margin`, `padding` — these force layout reflow

### 5. Gradient Border Check

- [ ] Gradient borders use the `::before` pseudo-element technique — NEVER `border-image`
- [ ] `border-image` is forbidden — it ignores `border-radius`, breaking pill/rounded shapes
- [ ] Parent has: `position: relative`, `border: 1.5px solid transparent`, `background-clip: padding-box`
- [ ] `::before` has: `position: absolute`, `inset: -1.5px`, `border-radius: inherit`, `z-index: -1`
- [ ] Gradient values (primary variant): `135deg, rgba(255,255,255,0.18) 0%, rgba(255,0,54,0.55) 40%, rgba(255,0,54,0.15) 100%`
- [ ] Gradient values (secondary ghost): `135deg, rgba(255,255,255,0.12) 0%, rgba(255,0,54,0.45) 45%, rgba(255,0,54,0.08) 100%`
- [ ] `border-radius: inherit` on `::before` is CRITICAL — without it the gradient clips to a rectangle
- [ ] Gradient borders only on: secondary/ghost buttons, inputs in focus state, active accent cards. NEVER on separators, tables, layout containers

### 6. Accessibility

**Buttons:**
- [ ] Minimum height `44px`; minimum padding `10px 20px`
- [ ] Focus ring: `box-shadow: 0 0 0 3px rgba(255, 0, 54, 0.40)` dark / `0 0 0 3px rgba(219, 20, 60, 0.35)` light
- [ ] Focus ring **merged** with existing `box-shadow` — adds as outermost layer, never replaces
- [ ] `outline: none` must ALWAYS be paired with a visible `box-shadow` focus ring — never naked
- [ ] Disabled: `opacity: 0.4` only — no grey substitution — colors stay identical to base
- [ ] Primary button: white `#ffffff` text over red gradient — always passes AA in both modes
- [ ] Secondary dark mode: `color: #ffffff` — passes because border defines affordance on dark bg
- [ ] Secondary light mode: `color: #cc0030` — NEVER `#ff0036` in light mode (only ~3.9:1 on white, fails AA)
- [ ] `role="button"` if implemented as non-`<button>` element

**Inputs:**
- [ ] Minimum height `44px`
- [ ] Focus ring softer than button: `box-shadow: 0 0 0 3px rgba(255, 0, 54, 0.12)` — 12%, not 40%
- [ ] Error state changes border + shadow only — NOT input text color
- [ ] Error message: `#ff0036` dark / `#db143c` light — check contrast on surface background
- [ ] Labels always visible — never placeholder-only inputs
- [ ] Placeholder `#6a6b6c` — WCAG exempts placeholder (informational, not functional)
- [ ] Disabled: `opacity: 0.4`, `cursor: not-allowed`, `pointer-events: none`

**Interactive Cards/Links:**
- [ ] Cards with `href`: wrapped in `<a>` or `<Link>` — `text-decoration: none; color: inherit` on wrapper
- [ ] `aria-label` on cards without explicit visible label
- [ ] Focus ring on `<a>` wrapper: `box-shadow: 0 0 0 3px rgba(255, 0, 54, 0.40)`, `outline: none`
- [ ] `transform: translateY(-6px)` on hover respects `@media (prefers-reduced-motion: reduce)`
- [ ] All content children inside card have `position: relative; z-index: 1` to appear above `::before` overlay

**Dropdowns/Nav:**
- [ ] Each item `padding: 7px 12px` minimum
- [ ] Active item `color: #ff0036` — contrast 4.96:1 on `#0B131E` ✅
- [ ] Hover has TWO simultaneous signals: background change + color change — never hover-only single signal
- [ ] Keyboard-traversable via Tab/Arrow keys

**Motion:**
- [ ] `@media (prefers-reduced-motion: reduce)` disables scroll fade-ins, card transforms, pipeline animations
- [ ] Ambient background glows (`glowPulse`, `spotBreath`) set `animation: none` under reduced-motion
- [ ] Maximum interactive transition duration: 300ms — scroll fade-ins may go up to 560ms

**Color Contrast:**
- [ ] Dark background is `#060C13` (azul-slate, H215 S50) — NEVER `#000000` (lifeless, chromatic mismatch)
- [ ] `#ff0036` on `#060C13` = 4.96:1 AA ✅ — `#ff0036` on `#ffffff` = ~3.9:1 ❌ FAIL
- [ ] In light mode: minimum red is `#cc0030` (5.4:1 on white ✅) or `#db143c` (4.7:1 on white ✅)
- [ ] Grid background only on page-level canvas — NEVER inside cards, modals, or dropdowns

---

## Severity Levels

When reporting issues, classify every finding with:

- **CRITICAL** — Accessibility failure: missing focus ring, insufficient contrast, no disabled state, interactive element below 44px, `outline: none` without alternative
- **MAJOR** — Compositional rule violation: blur+gradient on same element, wrong glow layer count, flat border where gradient required, `border-image` used, `transition: all` used, layout property animated
- **MINOR** — Inconsistency with spec: wrong duration (e.g. 300ms instead of 250ms for button), missing transition property (e.g. `border-color` absent on secondary), hover tint value off
- **SUGGESTION** — Enhancement opportunity: adding `will-change` to entrance animations, using token variable instead of raw value

---

## Reporting Format

For each issue found:

```
[SEVERITY] Component — State/Element
Problem: [What is wrong — specific property and value]
Expected: [What the spec says — exact value from COMPONENTS.md]
Found: [What is in the code — exact value]
Rule: [Which compositional rule or section this violates]
```

Example:
```
[CRITICAL] Button.Primary — :focus-visible
Problem: Uses `outline: 3px solid rgba(255,0,54,0.4)` — outline doesn't follow border-radius
Expected: box-shadow: 0 0 0 3px rgba(255, 0, 54, 0.40) merged with existing glow layers
Found: outline: 3px solid rgba(255,0,54,0.4); (no box-shadow on focus)
Rule: COMPONENTS.md Rule 7 — Focus ring uses box-shadow, never outline
```

---

## Compact Rules (for injection into sub-agents)

See `compact-rules.md` in this directory for the injectable condensed version.

The compact rules file is under 400 words and can be prepended to any sub-agent prompt to give it visual review context without loading the full skill.
