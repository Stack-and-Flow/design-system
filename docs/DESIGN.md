# Stack-and-Flow Design System — Visual Design Reference

Este documento define la identidad visual del Design System Stack-and-Flow. Está inspirado en el estilo de la landing de **Agent Teams** — una interfaz oscura de alta precisión que combina minimalismo técnico con energía de herramienta profesional. Sirve como referencia de diseño para tokens, componentes y decisiones visuales.

---

## 1. Atmósfera y Filosofía Visual

Stack-and-Flow se siente como el interior de un instrumento de precisión. El fondo no es simplemente oscuro — es un negro puro (`#000000`) que actúa como void absoluto sobre el que todo el contenido emerge con claridad.

La firma visual es la **combinación de superficies opacas y transparencias con blur** — algunos cards son sólidos y elevados, otros son semitransparentes con `backdrop-filter: blur()`, creando capas de profundidad sin recurrir a sombras dramáticas. El acento rojo carmesí (`#db143c` en light, `#ff0036` en dark) no domina — puntúa. Aparece en gradientes de botón, glows sutiles y estados activos.

El elemento diferenciador es el **grid de fondo sutil** — líneas translúcidas de 40×40px que dan al canvas una textura de hoja técnica sin interferir con el contenido. Combinado con el `backdrop-filter` de la navbar, crea la ilusión de estar trabajando dentro de una herramienta nativa, no de navegar una web de marketing.

**Características clave:**
- Negro puro (`#000000`) como fondo base — sin tintes, sin tonos de gris medio
- Grid de fondo sutil (líneas `rgba` a baja opacidad) sobre el canvas principal
- Navbar flotante con `backdrop-filter: blur(16px)` y `background: rgba(27,27,29,0.6)` — efecto cristal
- Rojo carmesí como acento de punctuación, nunca como relleno general
- Botones primarios con glow neon multi-capa — gradiente rojo + halo exterior
- Botones secundarios con borde semitransparente y glow contenido
- Cards opacas vs. cards semitransparentes — coexisten en el mismo sistema
- Space Grotesk Variable en todos los contextos — peso 500 como base, 700 en headings

---

## 2. Paleta de Colores

### Acento — Crimson Red

El color de marca. Dos valores según el modo:

| Contexto | Token | Valor |
|---------|-------|-------|
| Light mode | `--color-brand-primary` | `#db143c` |
| Dark mode | `--color-brand-primary` | `#ff0036` |

**Escala completa (light):**
| Token | Valor | Uso |
|-------|-------|-----|
| `primary` | `#db143c` | Brand, buttons, active states |
| `primary-dark` | `#c41136` | Hover pressed |
| `primary-darker` | `#b60f32` | Active/pressed |
| `primary-darkest` | `#8c0b26` | Extra énfasis, accents |
| `primary-light` | `#e63358` | Hover lifted |
| `primary-lighter` | `#ea4566` | Hover elevated |
| `primary-lightest` | `#f07a92` | Tints, highlighted text |

**Escala completa (dark — más vibrante):**
| Token | Valor | Uso |
|-------|-------|-----|
| `primary` | `#ff0036` | Brand, buttons, active states |
| `primary-dark` | `#e60030` | Hover pressed |
| `primary-darker` | `#cc002b` | Active/pressed |
| `primary-darkest` | `#990020` | Extra énfasis, accents |
| `primary-light` | `#ff335e` | Hover lifted |
| `primary-lighter` | `#ff4d72` | Hover elevated |
| `primary-lightest` | `#ff809b` | Tints, highlighted text |

> **Por qué dos valores**: en dark mode el rojo necesita mayor vibración para mantener contraste y "salir" sobre el negro absoluto. `#ff0036` tiene más presencia que `#db143c` sobre `#000000`.

---

### Fondos y Superficies

| Token | Dark | Light | Uso |
|-------|------|-------|-----|
| `background` | `#000000` | Docusaurus default (white) | Canvas principal |
| `background-surface` | `#0a0a0a` | — | Cards sólidas, code blocks |
| `navbar-bg` | `rgba(27,27,29,0.6)` | `rgba(255,255,255,0.7)` | Navbar con backdrop-blur |
| `sidebar-mobile-bg` | `rgba(27,27,29,1.0)` | `#ffffff` | Sidebar mobile |
| `dropdown-bg` | `#0a0a0a` | `#ffffff` | Menus desplegables |

### Escala de énfasis (bordes y separadores)

| Token | Dark | Uso |
|-------|------|-----|
| `emphasis-100` | `#111111` | Headers de tabla, fondos sutiles |
| `emphasis-200` | `#1a1a1a` | Bordes estándar, separadores |
| `emphasis-300` | `#262626` | Bordes de componentes interactivos |

### Texto

| Rol | Dark | Light | Contraste aprox. |
|-----|------|-------|-----------------|
| Primario (headings) | `#ffffff` | `#000000` | 21:1 ✅ |
| Secundario (body) | `#cccccc` | sistema | ~7:1 ✅ |
| Terciario (labels, nav) | `#888888` | sistema | ~5:1 ✅ |
| Sidebar activo | `#adadad` | — | ~6:1 ✅ |
| Disabled / muted | `#6a6b6c` | — | ~4.5:1 ✅ |

### Colores funcionales / semánticos

| Rol | Token | Dark | Light |
|-----|-------|------|-------|
| Error / Danger | `--color-error` | `#ff0036` | `#db143c` |
| Success | `--color-success` | `#22c55e` | `#16a34a` |
| Warning | `--color-warning` | `#fbbf24` | `#d97706` |
| Info | `--color-info` | `#55b3ff` | `#0077cc` |

### Transparencias funcionales (tints)

Usadas en overlays, glows y estados interactivos:

| Rol | Valor |
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

## 3. Tipografía

### Familia

**Space Grotesk Variable** — humanista geométrica, todos los pesos en un único archivo de fuente variable. Reduce CLS (Cumulative Layout Shift) al eliminar el font swap.

```css
@import '@fontsource-variable/space-grotesk';

font-family: 'Space Grotesk Variable', 'Space Grotesk', system-ui, -apple-system, sans-serif;
```

Space Grotesk reemplaza a Inter en todos los contextos. Se usa para headings, body, botones, captions, código de UI y navegación.

**Monospace:** fuente del sistema (`ui-monospace`, `SFMono-Regular`, `Menlo`) para code blocks técnicos.

### Pesos

| Peso | Uso |
|------|-----|
| `400` | Texto secundario, captions ligeras, fine print |
| `500` | Baseline de body — el peso de trabajo del sistema |
| `600` | Botones, badges, labels con énfasis, bold captions |
| `700` | Headings — todos los `h1`–`h6` |

> **Principio**: el peso 500 como baseline (no 400) da un heft extra que mejora la legibilidad sobre fondos oscuros. El peso 400 se reserva para contextos donde se necesita contraste de jerarquía visual.

### Jerarquía

| Rol | Tamaño | Peso | Line Height | Letter Spacing | Notas |
|-----|--------|------|-------------|----------------|-------|
| Display Hero | 56–64px | 700 | 1.10 | 0px | Headings de landing |
| Section Heading | 36–48px | 700 | 1.15 | 0px | Secciones principales |
| Card Heading | 22–24px | 700 | 1.20 | 0px | Títulos de card |
| Sub-heading | 18–20px | 600 | 1.40 | 0.1px | Subtítulos, features |
| Body Large | 18px | 500 | 1.60 | 0.2px | Párrafos prominentes |
| Body | 16px | 500 | 1.60 | 0.2px | Texto principal |
| Body Small | 14px | 500 | 1.50 | 0.1px | UI labels, nav links sidebar |
| Button | 16px | 600 | 1.15 | 0.01em | `letter-spacing: 0.01em` |
| Nav Link | 16px | 600 | 1.40 | 0.01em | Links de navbar principal |
| Caption | 14px | 500 | 1.40 | 0.2px | Metadata, labels |
| Badge / Tag | 10–12px | 600–700 | 1.40 | 0.02em | Micro-labels, "New" badges |
| Code (UI) | 93% | 500 | 1.60 | 0.3px | Inline code, snippets |
| Announcement | 13–14px | 500 | — | 0.01em | Banners de anuncio |

### Principios

- **Tracking positivo en dark**: +0.01em–+0.2px en body text compensa la irradiación del blanco sobre negro
- **700 solo en headings**: los headings usan bold (700) de forma consistente — nunca en body
- **Sin `font-style: italic`** para énfasis — usar peso o color en su lugar
- **Space Grotesk everywhere**: no mezclar con otras familias salvo monospace del sistema para code

---

## 4. Sistema de Transparencia y Superficies

A diferencia de un sistema de elevación con sombras, Stack-and-Flow usa un **sistema de opacidad y blur** que distingue las capas por su nivel de transparencia.

### Niveles de superficie

| Nivel | Tipo | Tratamiento | Uso |
|-------|------|-------------|-----|
| **Base** | Opaco | `background: #000000` + grid sutil | Canvas de página |
| **Raised** | Opaco | `background: #0a0a0a` + `border: 1px solid #1a1a1a` | Cards sólidas, code blocks, dropdowns |
| **Frosted** | Semitransparente | `background: rgba(27,27,29,0.6)` + `backdrop-filter: blur(16px)` | Navbar, overlays flotantes |
| **Frosted Light** | Semitransparente | `background: rgba(255,255,255,0.7)` + `backdrop-filter: blur(16px)` | Navbar en light mode |
| **Tinted** | Semitransparente colored | `background: rgba(255,0,54,0.06–0.15)` | Botones secondary, hover states, menús activos |
| **Overlay** | Semitransparente oscuro | `background: rgba(0,0,0,0.6)` + `backdrop-filter: blur(4px)` | Fondos de modal, sidebar backdrop |

### Cards: opaco vs. frosted

**Card opaca** — usa para contenido estructural, tablas, code snippets:
```css
background: #0a0a0a;
border: 1px solid #1a1a1a;
border-radius: 8px;
```

**Card frosted** — usa para elementos que flotan sobre contenido (navbar, tooltips, popovers):
```css
background: rgba(27, 27, 29, 0.6);
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.06);
border-radius: 8px;
```

**Card tinted** — usa para estados activos o elementos con énfasis de acento:
```css
background: rgba(255, 0, 54, 0.08);
border: 1px solid rgba(255, 0, 54, 0.2);
border-radius: 8px;
```

### Regla de blur

Solo los elementos que literalmente flotan sobre otros (navbar, mobile sidebar, modals, tooltips) usan `backdrop-filter`. Los cards de contenido no lo usan — son opacos. Esta distinción es intencional: el blur implica "estoy flotando", el opaco implica "soy contenido".

---

## 5. Componentes

### Botones

**Primary — Neon Gradient:**
```css
background: linear-gradient(135deg, #ff1a4b 0%, #cc0030 100%);
border: none;
border-radius: 9999px; /* pill */
color: #ffffff;
font-weight: 600;
letter-spacing: 0.01em;
box-shadow:
  0 0 0 1.5px rgba(255, 60, 90, 0.5),
  0 0 16px 4px rgba(255, 0, 54, 0.45),
  0 0 40px 6px rgba(255, 0, 54, 0.18),
  inset 0 1px 0 rgba(255, 255, 255, 0.15);
```
Hover: gradiente más intenso + glow exterior ampliado.

**Secondary — Ghost con glow contenido:**
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
Light mode: `color: #cc0030`, borde opaco.

**Transición:** `box-shadow 0.25s ease, background 0.25s ease` — nunca cambio de color instantáneo.

**Forma:** todos los botones son pill (`border-radius: 9999px`) — sin botones rectangulares en la UI principal.

### Navbar

```css
background: rgba(27, 27, 29, 0.6);
backdrop-filter: blur(16px);
border-bottom: 1px solid #1a1a1a;
```

- Links: `color: #9c9c9d` → `#ffffff` en hover, `text-decoration: underline` opcional
- CTA button al final: botón primary pill
- Sticky en top, transición suave al hacer scroll
- Mobile: hamburger → sidebar con fade + slide (`translateX(-16px)` → `0`)

### Cards y contenedores

Tres variantes que coexisten:

1. **Opaco** (`#0a0a0a` + borde `#1a1a1a`) — contenido, docs, features
2. **Frosted** (rgba + blur) — elementos flotantes
3. **Tinted red** (`rgba(255,0,54,0.06–0.10)` + borde red semitransparente) — estados activos, highlights de acento

Border-radius estándar: `8px`. Cards grandes: `12px`.

### Badges / Tags

```css
background: rgba(22, 163, 74, 1); /* success */
/* o */
background: rgba(255, 0, 54, 1);  /* brand */
color: #ffffff; /* dark: color: #000 para green */
border-radius: 3px;
padding: 1px 6px;
font-size: 10px;
font-weight: 700;
letter-spacing: 0.02em;
```

"New" badge: verde (`#16a34a` light, `#22c55e` dark con `color: #000`).

### Inputs y formularios

```css
background: #0a0a0a;
border: 1px solid #262626;
border-radius: 8px;
color: #f9f9f9;
```
Focus: borde brightens + `box-shadow: 0 0 0 3px rgba(255,0,54,0.12)`.
Placeholder: `#6a6b6c`.

### Code blocks

```css
background: #0a0a0a;
border: 1px solid #1a1a1a;
border-radius: 8px;
font-size: 93%; /* --ifm-code-font-size */
```
Highlighted line: `rgba(219,20,60,0.10)` (light) / `rgba(255,0,54,0.15)` (dark).

### Glow del GitHub Stars badge

Patrón reutilizable para cualquier badge con métrica numérica:
- Sección izquierda: `rgba(255,255,255,0.05)` + icono
- Divider: `1px solid #262626`
- Sección derecha: `rgba(255,185,0,0.07)` + número en `#fbbf24`
- Hover: borde dorado `rgba(255,185,0,0.55)` + `box-shadow: 0 0 0 3px rgba(255,185,0,0.12)`

### Anuncio / Announcement bar

```css
border-bottom: 1px solid rgba(255, 0, 54, 0.35);
font-size: 0.85rem;
font-weight: 500;
letter-spacing: 0.01em;
```
Links: `#ff4d6d` → `#ff8099` hover, con `border-bottom: 1px solid rgba` para subrayado sutil.

---

## 6. Decoración de Fondo

El canvas principal usa un **grid de doble línea** como textura técnica:

**Dark:**
```css
background:
  linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px) 0 0 / 40px 40px,
  linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px) 0 0 / 40px 40px,
  #000000;
```

**Light:**
```css
background:
  linear-gradient(rgba(0, 0, 0, 0.035) 1px, transparent 1px) 0 0 / 40px 40px,
  linear-gradient(90deg, rgba(0, 0, 0, 0.035) 1px, transparent 1px) 0 0 / 40px 40px,
  var(--background);
```

**Regla**: el grid aparece en el canvas de docs y landing. No en modals, dropdowns, ni cards.

### Glows decorativos

| Nombre | Valor | Uso |
|--------|-------|-----|
| Base glow | `0 4px 20px rgba(219,20,60,0.15)` | Light: hover de elementos de marca |
| Active glow | `0 8px 30px rgba(219,20,60,0.30)` | Light: estados activos |
| Base glow dark | `0 4px 20px rgba(255,0,54,0.15)` | Dark: hover de elementos de marca |
| Active glow dark | `0 8px 30px rgba(255,0,54,0.30)` | Dark: estados activos |
| Amber stars glow | `0 0 0 3px rgba(255,185,0,0.12)` | GitHub stars badge hover |

### Animaciones de entrada

```css
.fade-in-section {
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 560ms cubic-bezier(.2,.8,.2,1),
    transform 560ms cubic-bezier(.2,.8,.2,1);
  will-change: opacity, transform;
}
/* Al entrar en viewport: */
.fade-in-visible {
  opacity: 1;
  transform: translateY(0);
}
```

Curva `cubic-bezier(.2,.8,.2,1)` — ease-out suave con ligero overshoot inicial.

---

## 7. Layout y Espaciado

### Unidad base
**8px** — todas las medidas son múltiplos de 8 o 4.

### Escala de espaciado
`1 · 2 · 3 · 4 · 8 · 10 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 120`

### Contenedor
- Max-width: `1200px`, centrado con `margin: 0 auto`
- Padding horizontal: `24px` (mobile) → `40px` (tablet) → `64px` (desktop)

### Secciones
- Padding vertical entre secciones: `80px–120px`
- Padding interno de cards: `16px–32px`
- Gap entre elementos relacionados: `8px–16px`

### Grid de columnas
- Hero: una columna centrada
- Features: 2–3 columnas en desktop, 1 columna en mobile
- Docs: sidebar fija + contenido + TOC opcional

### Escala de border-radius

| Valor | Uso |
|-------|-----|
| `3px` | Badges micro, "New" labels |
| `6px` | Dropdown items, menú links |
| `8px` | Input fields, cards estándar, botones secundarios, code blocks |
| `9999px` | Botones pill (CTA, nav CTA) — forma circular máxima |
| `12px` | Cards grandes, pagination nav links |

---

## 8. Accesibilidad

### Contraste mínimo garantizado

Todos los valores de texto sobre sus respectivos fondos cumplen WCAG AA (4.5:1) como mínimo. Los textos primarios cumplen AAA (7:1+).

| Combinación | Contraste | Nivel |
|------------|-----------|-------|
| `#ffffff` sobre `#000000` | 21:1 | AAA ✅ |
| `#cccccc` sobre `#000000` | ~7:1 | AAA ✅ |
| `#888888` sobre `#000000` | ~5.3:1 | AA ✅ |
| `#adadad` sobre `#000000` | ~6.3:1 | AA ✅ |
| `#ff0036` sobre `#000000` | ~4.6:1 | AA ✅ |
| `#db143c` sobre `#ffffff` | ~4.7:1 | AA ✅ |
| `#cc0030` sobre `#ffffff` | ~5.4:1 | AA ✅ |
| `#22c55e` sobre `#000000` | ~6.8:1 | AA ✅ |
| `#000000` sobre `#22c55e` | ~6.8:1 | AA ✅ (badge dark) |

> ⚠️ **Nunca usar** `#ff0036` como color de texto sobre `#ffffff` en light mode — contraste insuficiente. Siempre usar `#cc0030` o más oscuro en light.

### Targets táctiles
- Botones pill: altura mínima `44px`, padding `10px 20px`
- Nav links: área mínima `44px` de alto incluyendo padding
- Elementos de menú: `padding: 7px 12px` mínimo con font 14px

### Focus visible
- Todos los elementos interactivos tienen `focus-visible` con `box-shadow: 0 0 0 3px rgba(255,0,54,0.4)` en dark y `box-shadow: 0 0 0 3px rgba(219,20,60,0.35)` en light
- Nunca `outline: none` sin alternativa visible

### Motion
- Transiciones: máximo `560ms`. Respetar `prefers-reduced-motion`:
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

## 9. Do's y Don'ts

### Do ✅
- Usar `#000000` puro como fondo dark — sin tintes de color
- Aplicar el grid de fondo (opacidad 0.025–0.035) en el canvas principal
- Diferenciar `backdrop-filter: blur` (elementos flotantes) de `background: #0a0a0a` (contenido)
- Usar el rojo más vibrante en dark (`#ff0036`) y el más sobrio en light (`#db143c`)
- Construir botones primarios con gradiente + glow multi-capa — el neon es signature
- Mantener texto secundario en `#cccccc` (dark) para ~7:1 de contraste
- Usar `border-radius: 9999px` exclusivamente en botones CTA principales
- Aplicar `transition: box-shadow 0.25s ease, background 0.25s ease` en todos los elementos interactivos
- Usar `font-weight: 700` solo en headings (`h1`–`h6`), nunca en body
- Añadir `will-change: opacity, transform` a animaciones de entrada para evitar jank

### Don't ❌
- No usar el rojo como color de texto sobre blanco en light mode (`#ff0036` falla contraste)
- No aplicar `backdrop-filter: blur` a cards de contenido — solo a elementos flotantes
- No usar weights menores a 500 para body text en dark mode — el 400 se percibe demasiado fino sobre negro
- No crear sombras decorativas sin propósito — la profundidad viene del contraste de superficie, no de box-shadows
- No mezclar pill buttons con botones rectangulares en la misma sección
- No omitir el `border: 1px solid` en cards dark — sin borde, las cards se funden con el fondo
- No usar el grid de fondo dentro de cards, modals o dropdowns — solo en el canvas raíz
- No aplicar colores arbitrarios fuera de la paleta definida — cada nuevo color necesita justificación de contraste
- No animar propiedades que fuercen layout (`width`, `height`, `top`, `left`) — solo `opacity`, `transform`, `box-shadow`

---

## 10. Guía de Prompts para Agentes IA

### Referencia rápida de colores

```
Dark background:       #000000
Dark surface:          #0a0a0a
Dark border:           #1a1a1a (emphasis-200)
Dark border strong:    #262626 (emphasis-300)
Brand red (dark):      #ff0036
Brand red (light):     #db143c
Primary text (dark):   #ffffff
Secondary text (dark): #cccccc
Tertiary text (dark):  #888888
Success (dark):        #22c55e
Warning (dark):        #fbbf24
Navbar bg (dark):      rgba(27, 27, 29, 0.6) + blur(16px)
```

### Prompts de ejemplo

**Hero section:**
> "Crea una hero section con fondo `#000000`, grid de líneas `rgba(255,255,255,0.025)` cada 40px, heading 64px Space Grotesk 700 en `#ffffff`, descripción 18px peso 500 en `#cccccc`, y dos botones pill: primary con gradiente `#ff1a4b → #cc0030` y glow neon multi-capa, secondary con borde `rgba(255,0,54,0.5)` y fondo `rgba(255,0,54,0.06)`"

**Feature card:**
> "Diseña un feature card con fondo `#0a0a0a`, borde `1px solid #1a1a1a`, `border-radius: 8px`, heading 22px Space Grotesk 700, body text 16px peso 500 en `#cccccc`, y un icono en `#ff0036` en la esquina superior izquierda"

**Navbar:**
> "Construye una navbar sticky con `background: rgba(27,27,29,0.6)`, `backdrop-filter: blur(16px)`, `border-bottom: 1px solid #1a1a1a`, links en `#888888` → `#ffffff` on hover, y un botón CTA pill con gradiente rojo a la derecha"

**Estado activo en sidebar:**
> "Aplica estado activo con `background: rgba(255,0,54,0.10)`, `color: #ff0036`, `font-weight: 600`, `border-radius: 8px` — sin borde adicional"

**Badge "New":**
> "Badge con `background: #22c55e` (dark) / `#16a34a` (light), `color: #000` (dark) / `#fff` (light), `border-radius: 3px`, `padding: 1px 6px`, 10px Space Grotesk 700, `letter-spacing: 0.02em`"

### Checklist de revisión para agentes

1. ¿El fondo es `#000000` — no gris oscuro, no con tinte?
2. ¿Las cards tienen borde `1px solid #1a1a1a` — sin borde se funden con el fondo?
3. ¿El `backdrop-filter: blur` solo está en elementos flotantes (navbar, modals)?
4. ¿El texto secundario es `#cccccc` — no `#999999` ni menor contraste?
5. ¿Los botones primarios tienen gradiente + glow, no color flat?
6. ¿Los botones son pill (`border-radius: 9999px`) — no rectangulares?
7. ¿El rojo en light mode es `#db143c` o más oscuro — nunca `#ff0036`?
8. ¿Space Grotesk Variable está cargado como variable font — no como múltiples pesos estáticos?
9. ¿Las animaciones de entrada usan `cubic-bezier(.2,.8,.2,1)` con `will-change`?
10. ¿Hay `prefers-reduced-motion` para las animaciones de scroll?
