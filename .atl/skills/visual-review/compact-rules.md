## Stack-and-Flow Visual Rules (compact)

### Forbidden Patterns
- NEVER use `transition: all` — enumerate specific properties: `box-shadow 0.25s ease, background 0.25s ease`
- NEVER use `outline` for focus rings — use `box-shadow: 0 0 0 3px rgba(255, 0, 54, 0.40)` (dark) / `rgba(219, 20, 60, 0.35)` (light)
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
- Button Primary glow is **always-on** (4 layers at rest); amplified on hover; focus ring added as outermost layer
- Button Secondary glow is **always-on** (3 layers, no tight ring — it has a real border); amplified on hover
- Cards, badges, nav elements: glow appears **only on hover/focus** — no glow at rest
- Gradient `::before` overlays on cards: `opacity: 0` at rest, `opacity: 1` on hover — transition `opacity` only
- All content children inside a card with `::before` overlay need `position: relative; z-index: 1`
- Ghost/outlined buttons need a background tint on hover: `rgba(255, 0, 54, 0.08)` — border-only hover is visually unstable
- Hover direction is always tonally **upward** — lighter, more elevated; never darker or more muted
- `outline: none` is only valid when paired with a visible `box-shadow` focus ring — never naked

### State-Specific Values
- Button Primary base gradient: `linear-gradient(135deg, #ff1a4b 0%, #cc0030 100%)`
- Button Primary hover gradient: `linear-gradient(135deg, #ff3366 0%, #e0003a 100%)`
- Button Primary active: `linear-gradient(135deg, #cc0030 0%, #990020 100%)` + `transform: scale(0.98)`
- Secondary button border: `1.5px solid rgba(255, 0, 54, 0.55)` — semitransparent, never flat `#ff0036`
- Input focus ring: `box-shadow: 0 0 0 3px rgba(255, 0, 54, 0.12)` — softer than button (12%, not 40%)
- Card hover lift: `transform: translateY(-6px)` — must respect `@media (prefers-reduced-motion: reduce)`
- Dropdown item hover: background change + color change simultaneously — two signals, never one alone
- Inline CTA "Learn more →": hover animates `gap: 0.2rem → 0.55rem` — the arrow slides right

### Timing Reference
- Buttons: 250ms ease | Cards: 300ms ease | Dropdowns: 150ms ease | Links: 200ms ease | Scroll fade-in: 560ms cubic-bezier(0.2, 0.8, 0.2, 1)

### Minimum Touch Targets
- All interactive elements: minimum `44×44px` — buttons `min-height: 44px; padding: 10px 20px`, dropdown items `padding: 7px 12px` with 14px font
