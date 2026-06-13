## Stack-and-Flow Visual Rules (compact)

### Forbidden Patterns
- NEVER use `transition: all` — enumerate specific properties: `box-shadow 0.25s ease, background 0.25s ease`
- NEVER rely on component-local focus shadow/glow — use the shared `focus-ring` utility (`outline: 2px solid var(--color-primary)`, offset `2px`)
- NEVER use `border-image` for gradient borders — it ignores `border-radius`; use `::before` with `inset: -1.5px` and `border-radius: inherit`
- NEVER put `backdrop-filter: blur()` on content cards — only on floating elements (navbar, modals, sticky bars, mobile sidebar)
- NEVER combine `backdrop-filter: blur` and a gradient `background` on the same element — pick one
- NEVER animate gradient `background` directly — place gradient on `::before`, animate its `opacity` to `1` on hover
- NEVER animate layout-forcing properties: `width`, `height`, `top`, `left`, `margin`, `padding` — these trigger reflow
- NEVER use a single `box-shadow` layer for glow on Button Primary — requires exactly 4 layers
- NEVER change colors for disabled state — use `opacity: 0.4` + `cursor: not-allowed` + `pointer-events: none`
- NEVER use `#ff0036` as text color in light mode — it fails WCAG AA on white (~3.9:1); minimum is `#cc0030` (5.4:1)
- NEVER use `#000000` as dark background — use `#060C13` (azul-slate, H215 S50)
- NEVER place the grid background inside cards, modals, or dropdowns — canvas only

### Required Patterns
- Button Primary glow is **always-on** (4 layers at rest); amplified on hover; focus-visible still comes from `focus-ring`
- Button Secondary glow is **always-on** (3 layers, no tight ring — it has a real border); amplified on hover
- Cards, badges, nav elements: decorative glow appears only on hover/active when specified; keyboard focus still uses `focus-ring`
- Gradient `::before` overlays on cards: `opacity: 0` at rest, `opacity: 1` on hover — transition `opacity` only
- All content children inside a card with `::before` overlay need `position: relative; z-index: 1`
- Ghost/outlined buttons need a background tint on hover: `rgba(255, 0, 54, 0.08)` — border-only hover is visually unstable
- Hover direction is always tonally **upward** — lighter, more elevated; never darker or more muted
- `outline: none` is only valid when paired with `focus-visible:focus-ring` or an equivalent wrapper/peer/group selector — never naked

### State-Specific Values
- Button Primary base gradient: `linear-gradient(135deg, #ff1a4b 0%, #cc0030 100%)`
- Button Primary hover gradient: `linear-gradient(135deg, #ff3366 0%, #e0003a 100%)`
- Button Primary active: `linear-gradient(135deg, #cc0030 0%, #990020 100%)` + `transform: scale(0.98)`
- Secondary button border: `1.5px solid rgba(255, 0, 54, 0.55)` — semitransparent, never flat `#ff0036`
- Field focus ring: wrapper uses `focus-ring` when it contains a `:focus-visible` input/control
- Card hover lift: `transform: translateY(-6px)` — must respect `@media (prefers-reduced-motion: reduce)`
- Dropdown item hover: background change + color change simultaneously — two signals, never one alone
- Inline CTA "Learn more →": hover animates `gap: 0.2rem → 0.55rem` — the arrow slides right

### Timing Reference
- Buttons: 250ms ease | Cards: 300ms ease | Dropdowns: 150ms ease | Links: 200ms ease | Scroll fade-in: 560ms cubic-bezier(0.2, 0.8, 0.2, 1)

### Control height and touch targets
- Comparable action controls use the shared visual `control` scale (`24/32/40/48px`) when applicable.
- Labeled form fields such as `Input`/`Select` use the semantic `form-field` scale (`48/56/64px`) when label/floating-label layout affects alignment.
- `touch-target-min` (`44px`) is required for touch-first surfaces or hit-area wrappers, not every visual height.
- Documented compact/dense variants may stay visually smaller when they remain native-button/control based, keyboard accessible, focus-visible, and ARIA accessible.
