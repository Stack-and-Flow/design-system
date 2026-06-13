# Stack-and-Flow — Especificación visual de componentes

> Referencia para agentes de IA que escriben o revisan código de componentes. Cubre todos los estados interactivos, el sistema de glow, las reglas de transición, la técnica de bordes con degradado y los requisitos de accesibilidad. Se basa en los tokens de Stack-and-Flow y en el contrato visual actual del proyecto.

---

## 1. Principios de composición

Estas reglas se aplican a todo el sistema y no admiten excepciones. Todos los componentes deben cumplirlas.

**Regla 1 — `backdrop-filter: blur` solo en elementos flotantes.**
Solo los elementos que realmente flotan sobre el contenido de la página (navbar, barra lateral móvil, fondos de modal, barras sticky o un `CardContainer` explícitamente flotante con `backdropBlur` activado) usan `backdrop-filter`. Las cards de contenido son opacas: usan `background: #0B131E`. El `blur` comunica "estoy flotando"; una superficie opaca comunica "soy contenido". Nunca apliques `backdrop-filter` a cards de features, release cards, pipeline cards ni a ninguna card que viva en el flujo normal del documento. `CardContainer` usa `backdropBlur="none"` por defecto; `backdropBlur="sm" | "md" | "lg"` queda reservado para tratamientos flotantes o glass por encima de otros contenidos.

**Regla 2 — Nunca animes el fondo con degradado directamente. Usa la opacidad de `::before` en su lugar.**
El navegador no puede interpolar un `linear-gradient`. En su lugar, coloca el degradado de hover en un pseudo-elemento `::before` con `opacity: 0` y anima solo `opacity` hasta `1` al hacer hover. Eso se ejecuta en el compositor de la GPU y produce una transición suave. El `background` del elemento principal permanece estático o usa solo transiciones simples de `background-color`.

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

**Regla 3 — El glow decorativo es semántico; el indicador de focus es accesibilidad.**
Trata el glow o la elevación decorativos como parte del contrato del componente, no como un simple interruptor visual. Un componente puede incluir glow decorativo en reposo, en hover o no incluirlo en absoluto según la semántica de su variante. Cuando la API lo permita, expón `emphasis="default" | "flat"` para que los contextos más sobrios puedan suprimir el glow decorativo sin alterar la jerarquía, el comportamiento ni la semántica.

El indicador `focus-visible` es otra cosa: es una señal de accesibilidad nativa y nunca debe desactivarse mediante `emphasis`, modos sobrios ni toggles de sombra decorativa. Todos los componentes focusables deben consumir la utilidad compartida `focus-ring` con `focus-visible:focus-ring`, `peer-focus-visible:focus-ring`, `group-focus-visible:focus-ring` o un selector equivalente cuando el foco vive en un hijo.

**Regla 4 — `backdrop-filter` y un degradado en el mismo elemento están prohibidos.**
Un elemento con efecto esmerilado (`backdrop-filter: blur`) no debe llevar además una capa decorativa de fondo con degradado. Ambos recursos compiten visualmente (el blur ya aporta profundidad) y pueden generar artefactos de composición en la GPU. Elige una sola opción: superficie esmerilada O superficie con degradado.

**Regla 5 — No uses nunca `transition: all`.**
Enumera siempre exactamente las propiedades que se animan. `transition: all` anima todas las propiedades CSS, incluidas las que fuerzan layout (`width`, `height`, `top`, `left`, `padding`), lo que dispara reflow y genera tirones visuales. Las propiedades permitidas para animar son: `opacity`, `transform`, `box-shadow`, `background-color`, `border-color`, `color`, `gap`.

```css
/* ✅ Correct */
transition:
  box-shadow 0.25s ease,
  background 0.25s ease;
/* ❌ Wrong */
transition: all 0.25s ease;
```

**Regla 6 — El hover debe aclarar el tono tanto en primary como en secondary.**
En `:hover`, el degradado del botón primary se aclara (`#ff1a4b → #ff3366` al inicio, `#cc0030 → #e0003a` al final) y la intensidad del glow aumenta. El tinte de fondo del botón secondary sube de `rgba(255,0,54,0.06)` a `rgba(255,0,54,0.12)` y también aumenta la opacidad del borde. El hover siempre debe hacer que los elementos se perciban más elevados, nunca más oscuros ni más apagados.

**Regla 7 — El anillo de focus usa la utilidad nativa `focus-ring`.**
El focus visible no depende de glows decorativos ni de sombras por variante. Usa la utilidad compartida `focus-ring`, que aplica el contrato nativo:

```css
:focus-visible {
  outline-style: solid;
  outline-color: var(--color-primary);
  outline-width: 2px;
  outline-offset: 2px;
}
```

Nunca uses `outline: none` sin reponer este indicador visible con `focus-visible:focus-ring` o con una variante equivalente para wrappers, peers, groups o `:has(:focus-visible)`.

**Regla 8 — El estado disabled usa opacidad; nunca cambio de color.**
Aplicar `opacity: 0.4` a todo el componente comunica el estado disabled. Nunca cambies el color del texto, el color del borde ni el fondo a una variante "gris": eso crea una señal semántica falsa y rompe el sistema visual. Acompáñalo siempre con `cursor: not-allowed` y `pointer-events: none`.

**Regla 9 — Los bordes con degradado usan un pseudo-elemento `::before`, nunca `border-image`.**
`border-image` no funciona con `border-radius`: el degradado se recorta como un rectángulo y rompe la forma de píldora. La técnica correcta usa un `::before` posicionado de forma absoluta con `inset: -1.5px` y `z-index: -1`, usando el degradado como `background` y `border-radius: inherit`.

**Regla 10 — La altura visual del control y el objetivo táctil no son lo mismo.**
La escala visual compartida para controles de acción comparables es `xs | sm | md | lg` = `24px | 32px | 40px | 48px`, expuesta vía `--spacing-control-*` y utilidades Tailwind `h-control-*` / `w-control-*`. `Button`, `IconButton` y `Link` CTA (`button` / `outlined`) deben consumir esa escala para no divergir entre sí. `Link` `regular` sigue siendo una variante tipográfica inline.

`Input` y `Select` son controles de formulario: su altura considera label, floating label, adornments y alineación entre campos, por lo que usan la escala semántica `form-field` (`--spacing-form-field-sm|md|lg` = `48px | 56px | 64px`) en vez de la escala visual de acciones. Si más campos comparten esa lógica, deben alinearse con `Input`/`Select`, no con `Button`.

`--spacing-touch-target-min` (`44px`) es una guía de target táctil para superficies touch-first, CTA primarios en mobile o wrappers de hit area. No es una altura visual universal para todo control web. Los componentes compactos o densos pueden quedar por debajo de `44px` cuando eso está documentado, siguen usando controles nativos y mantienen foco/teclado accesibles. `Checkbox` y `Switch` son ejemplos donde el hit area puede crecer sin cambiar la forma visible; `TextArea`, `Chip` y `Badge` son excepciones intencionales con una semántica distinta.

**Escala de tamaño de acción: `xs | sm | md | lg`.**
En `Button`, `IconButton` y las variantes de Link usadas como acciones (`button` / `outlined`), `xs` es el tamaño compacto y denso. `sm`, `md` y `lg` siguen la misma escala visual semántica compartida, mientras que el target táctil se evalúa aparte según contexto.

**Regla 11 — No animes propiedades que fuerzan layout.**
No animes `width`, `height`, `top`, `left`, `margin` ni `padding`. Estas propiedades fuerzan reflow en cada frame. Para animaciones de posición usa `transform: translateY/translateX`. Para animaciones de tamaño usa `transform: scale`.

**Regla 12 — Las cards que funcionan como enlaces interactivos usan `position: relative; z-index: 1` en sus hijos de contenido.**
Cuando una card tiene un overlay de degradado `::before` en hover, todos sus hijos de contenido necesitan `position: relative; z-index: 1` para quedar por encima del overlay. Si se omite, el texto y los iconos quedan tapados por la capa de degradado durante el hover.

---

## 2. Referencia de comportamiento por estado

| Estado | Qué cambia | Qué nunca cambia |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **hover** | `box-shadow` se intensifica; el degradado se aclara (primary); aumenta el tinte de fondo (secondary); sube la opacidad de `border-color`; `transform: translateY(-6px)` en cards | Radio de borde; peso tipográfico; color del texto (se mantiene en `#ffffff` en primary y secondary); dimensiones del componente |
| **focus** | `focus-ring` aplica `outline: 2px solid var(--color-primary)` con `outline-offset: 2px` | Degradado; glow/sombra decorativa; tinte de fondo; `border-color`; dimensiones |
| **active** | El degradado se oscurece (`#ff1a4b → #cc002b` en primary); la escala se comprime ligeramente (`transform: scale(0.98)`); el glow se contrae | Radio de borde; color del texto; peso tipográfico |
| **disabled** | `opacity: 0.4`; `cursor: not-allowed`; `pointer-events: none` | Todos los colores se mantienen idénticos al estado base, sin sustitución por grises |

---

## 3. Componentes

### 3.1 Button — Primary

**Base (oscuro):**

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
height: var(--spacing-control-md); /* 40px visual height; use touch-target-min only when the surface is touch-first */
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

**Hover (oscuro):**

```css
background: linear-gradient(135deg, #ff3366 0%, #e0003a 100%);
box-shadow:
  0 0 0 1.5px rgba(255, 80, 110, 0.7),
  0 0 22px 4px rgba(255, 0, 54, 0.65),
  0 0 55px 8px rgba(255, 0, 54, 0.28),
  inset 0 1px 0 rgba(255, 255, 255, 0.2);
```

**Hover de la variante hero (glow más intenso; se usa en hero / sticky bar):**

```css
background: linear-gradient(135deg, #ff3366 0%, #e0003a 100%);
box-shadow:
  0 0 0 1.5px rgba(255, 80, 110, 0.8),
  0 0 26px 4px rgba(255, 0, 54, 0.75),
  0 0 70px 8px rgba(255, 0, 54, 0.35),
  inset 0 1px 0 rgba(255, 255, 255, 0.22);
```

**Focus (oscuro):**

```css
outline-style: solid;
outline-color: var(--color-primary);
outline-width: 2px;
outline-offset: 2px;
/* Existing decorative box-shadow remains unchanged. */
```

**Active (oscuro):**

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

**Modo claro:**
No hay diferencias para el botón principal: el texto blanco sobre un degradado rojo pasa el contraste en ambos modos. Los valores de gradiente y el brillo siguen siendo los mismos.

---

### 3.2 Button — Secondary

**Base (oscuro):**

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
height: var(--spacing-control-md); /* 40px visual height; use touch-target-min only when the surface is touch-first */
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

**Base para hero / sticky bar (glow ligeramente más fuerte):**

```css
background: rgba(255, 0, 54, 0.06);
border: 1.5px solid rgba(255, 0, 54, 0.55);
box-shadow:
  0 0 10px 2px rgba(255, 0, 54, 0.18),
  0 0 30px 6px rgba(255, 0, 54, 0.08),
  inset 0 0 12px rgba(255, 0, 54, 0.05);
```

**Hover (oscuro):**

```css
background: rgba(255, 0, 54, 0.12);
border-color: rgba(255, 60, 90, 0.85);
box-shadow:
  0 0 16px 4px rgba(255, 0, 54, 0.35),
  0 0 45px 10px rgba(255, 0, 54, 0.15),
  inset 0 0 16px rgba(255, 0, 54, 0.08);
```

**Focus (oscuro):**

```css
outline-style: solid;
outline-color: var(--color-primary);
outline-width: 2px;
outline-offset: 2px;
/* Existing decorative box-shadow remains unchanged. */
```

**Active (oscuro):**

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

**Modo claro:**

```css
color: #cc0030;
border-color: rgba(219, 20, 60, 0.5);
/* background remains rgba(255,0,54,0.06) */
```

**Hover en modo claro:**

```css
color: #8c0b26;
border-color: rgba(219, 20, 60, 0.8);
```

---

### 3.3 Button — Ghost / Outlined

La variante ghost/outlined se implementa como un botón secondary sin glow interno. Se usa cuando el elemento vive dentro de una card o una sección con fondo de color:

```css
background: transparent;
border: 1.5px solid rgba(255, 0, 54, 0.45);
border-radius: 9999px;
color: #ffffff;
font-weight: 600;
letter-spacing: 0.01em;
padding: 10px 20px;
height: var(--spacing-control-md); /* CTA visual height */
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
outline-style: solid;
outline-color: var(--color-primary);
outline-width: 2px;
outline-offset: 2px;
```

**Nota sobre la variante inline `releaseLink`**: sigue el mismo patrón, pero con un padding más pequeño (`0.4rem 1rem`) y se usa dentro de cards:

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

**Marcador de posición:**

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
outline-style: solid;
outline-color: var(--color-primary);
outline-width: 2px;
outline-offset: 2px;
```

**Disabled:**

```css
opacity: 0.4;
cursor: not-allowed;
pointer-events: none;
```

**Modo claro:**

```css
background: #ffffff;
border-color: rgba(0, 0, 0, 0.18);
color: #0a0a0a;
```

**Focus en modo claro:**

```css
border-color: rgba(219, 20, 60, 0.5);
outline-style: solid;
outline-color: var(--color-primary);
outline-width: 2px;
outline-offset: 2px;
```

---

### 3.5 Input — Error / Warning / Success / Info States

Estos estados cambian solo `border-color` y `box-shadow`. El fondo, el padding y la tipografía permanecen idénticos al estado por defecto.

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

**Texto del mensaje de error:**

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

**Modo claro:**

```css
background: #ffffff;
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
```

**Posicionamiento:** el panel aparece debajo del trigger con un pequeño espacio. `position: absolute; top: calc(100% + 4px); left: 0`.

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

**Hover (oscuro):**

```css
background: rgba(255, 255, 255, 0.07);
color: #ffffff;
```

**Hover (claro):**

```css
background: rgba(0, 0, 0, 0.05);
color: #000000;
```

**Active/seleccionado (oscuro):**

```css
color: #ff0036; /* --color-brand-dark */
background: rgba(255, 0, 54, 0.08);
```

**Active/seleccionado (claro):**

```css
color: #db143c; /* --color-brand-light */
background: rgba(219, 20, 60, 0.06);
```

---

### 3.8 Badge / Tag

**Marca / "Nuevo" — oscuro:**

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

**"Nuevo" — claro:**

```css
background: #16a34a;
color: #ffffff;
```

**Badge de marca tipo píldora (por ejemplo, etiqueta de versión o de release):**

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

**Badge tipo píldora beta/de advertencia:**

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

Se usa para cards de features, elementos de listas de releases, cards tecnológicas, pasos de pipeline, bloques de código y cualquier otro contenido estructurado.

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

**Overlay de degradado en `::before` (siempre presente; se activa en hover):**

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

**Base en modo claro:**

```css
background: rgba(0, 0, 0, 0.02);
border-color: rgba(0, 0, 0, 0.08);
```

**Hover en modo claro:**

```css
border-color: #db143c; /* var(--color-brand-light) */
box-shadow: 0 8px 40px rgba(255, 0, 54, 0.1);
/* No transform: translateY in light mode — optional, not consistently applied */
```

**Los elementos de contenido dentro de la card deben tener:**

```css
position: relative;
z-index: 1;
```

---

### 3.10 Card — Frosted

Se usa solo para superficies tipo glass de `CardContainer` que flotan explícitamente. Las cards normales en el flujo del documento se mantienen opacas.

```css
background: rgba(6, 12, 19, 0.38); /* --color-card-backdrop-dark */
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 0, 54, 0.5); /* --color-red-tint-border */
border-radius: 8px; /* or 12px for larger panels */
```

**Modo claro:**

```css
background: rgba(255, 255, 255, 0.32); /* --color-card-backdrop-light */
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 0, 54, 0.5); /* --color-red-tint-border */
```

**Niveles de `backdropBlur` en `CardContainer`:**

```css
backdropBlur="sm"; /* --blur-card-sm: blur(10px) */
backdropBlur="md"; /* --blur-card-md: blur(20px) */
backdropBlur="lg"; /* --blur-card-lg: blur(36px) */
```

Úsalos solo cuando la card esté flotando visualmente por encima de otro contenido. Deja `backdropBlur="none"` para cards de contenido normal.

**Barra CTA fija (flota debajo de la navbar tras hacer scroll):**

```css
background: rgba(27, 27, 29, 0.6);
backdrop-filter: blur(18px) saturate(1.4);
-webkit-backdrop-filter: blur(18px) saturate(1.4);
border-bottom: 1px solid rgba(255, 255, 255, 0.06);
box-shadow: 0 4px 24px rgba(0, 0, 0, 0.35);
```

**CRÍTICO:** NO combines `backdrop-filter` con un `background` con degradado. Elige una sola opción.

---

### 3.11 Card — Tinted (Active)

Se usa para elementos activos de la barra lateral, elementos activos del menú y variantes de features destacadas:

```css
background: rgba(255, 0, 54, 0.08); /* --color-red-tint-low */
border: 1px solid rgba(255, 0, 54, 0.2);
border-radius: 8px;
```

**Enlace activo de la barra lateral:**

```css
background: rgba(255, 0, 54, 0.1); /* --color-red-tint-mid */
color: #ff0036; /* --color-brand-dark */
font-weight: 600;
border-radius: 8px;
/* No additional border on sidebar links */
```

**Hover sobre la card tintada:**

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

**Modo claro:**

```css
background: rgba(255, 255, 255, 0.7); /* --color-navbar-light */
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
```

**Imagen del logotipo:** `width: 32px; height: 32px`: el tamaño explícito impide CLS.

**Enlaces de navegación:**

```css
font-size: 0.85rem;
font-weight: 600;
color: #e0e0e0; /* dark */
transition: color 0.2s ease;
text-decoration: none;
```

**Hover de los enlaces de navegación:** `color: #ffffff;`

**Enlaces de navegación en modo claro:** `color: #333333;` → `color: #000000;` en hover.

**Panel de la barra lateral móvil:**

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

**Barra lateral móvil: mostrar estado:**

```css
opacity: 1;
transform: translateX(0);
z-index: 1000;
height: 100dvh;
```

**Fondo de la barra lateral móvil:**

```css
background: rgba(0, 0, 0, 0.6);
backdrop-filter: blur(4px);
-webkit-backdrop-filter: blur(4px);
opacity: 0;
transition: opacity 0.25s ease;
```

---

### 3.13 Link — Inline

Enlaces dentro del cuerpo del texto (announcement bar, notas de release, CTA inline):

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

**Link inline en modo claro:** sigue el mismo patrón, pero usa `#db143c` → `#c41136` en hover.

**Link inline CTA (`featureCta` — "Más información →"):**

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

**Hover del inline CTA:** `gap: 0.55rem;` — la flecha se desplaza hacia la derecha.

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

**Hover (oscuro):**

```css
background: rgba(255, 255, 255, 0.05); /* --color-white-tint-faint */
color: #ffffff;
```

**Active (oscuro):**

```css
background: rgba(255, 0, 54, 0.1); /* --color-red-tint-mid */
color: #ff0036;
font-weight: 600;
```

**Enlace de navegación de la barra lateral móvil:**

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

No existe un componente Modal en el código de referencia. Usa los tokens ya definidos para superficie y overlay:

**Fondo:**

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

**Estado abierto:**

```css
opacity: 1;
transform: translate(-50%, -50%) scale(1);
```

**Panel en modo claro:**

```css
background: #ffffff;
border-color: rgba(0, 0, 0, 0.1);
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
```

---

### 3.16 Announcement Bar / Version Banner

**Announcement Bar** (barra global de Docusaurus, a ancho completo sobre la navbar):

```css
border-bottom: 1px solid rgba(255, 0, 54, 0.35);
font-size: 0.85rem;
font-weight: 500;
letter-spacing: 0.01em;
/* Hidden on mobile: display: none at max-width: 768px */
```

**Link dentro de la barra:**

```css
color: #ff4d6d;
font-weight: 700;
text-decoration: none;
border-bottom: 1px solid rgba(255, 77, 109, 0.4);
transition:
  color 0.2s ease,
  border-color 0.2s ease;
```

**Hover del link:**

```css
color: #ff8099;
border-bottom-color: rgba(255, 128, 153, 0.7);
```

**Version Banner** (componente personalizado: franja oscura entre la barra y la página):

```css
background-color: #0d0d0d;
color: #ffffff;
text-align: center;
padding: 8px 16px;
font-size: 14px; /* 0.875rem */
line-height: 1.5;
/* Hidden on mobile: display: none at max-width: 768px */
```

**Enlaces del version banner:** siguen el mismo patrón `#ff4d6d` / `#db143c` en modo claro que los links inline.

---

## 4. Sistema de resplandor

### Patrón de 4 capas (Button Primary — ejemplo canónico)

El glow del botón primary tiene cuatro capas, cada una con un propósito distinto:

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

### Amplificación en hover:

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

### Temporización y énfasis del glow decorativo

| Elemento | Comportamiento decorativo predeterminado del glow | `emphasis="flat"` |
| ----------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Button Primary | **Siempre activo**: glow de 4 capas en reposo, amplificado en hover | Elimina el glow decorativo y mantiene el anillo de focus |
| Button Secondary / Outlined | **Siempre activo**: glow suave y contenido en reposo, amplificado en hover | Elimina el glow decorativo y mantiene el anillo de focus |
| IconButton Primary / Secondary / Outlined | Sigue la misma semántica visual que los botones de la misma familia de variantes | Elimina el glow decorativo y mantiene el anillo de focus |
| CTA Link `button` / `outlined` | Glow decorativo según el contrato de su variante | Elimina el glow decorativo y mantiene el anillo de focus |
| Chip | No tiene API de glow decorativo; el color o la variante cargan la semántica de estado | N/A — el glow de focus/selección de accesibilidad sigue siendo independiente |
| Switch `emphasis="default"` | Glow decorativo según el contrato de énfasis | `emphasis="flat"` elimina el glow decorativo y mantiene el anillo de focus |
| Feature Card | **Solo en hover**: sin glow en reposo; `box-shadow` aparece en hover | N/A salvo que se añada una API específica del componente |
| Nav Badge (estrellas de GitHub) | **Solo en hover**: el anillo ámbar aparece únicamente al pasar el cursor | N/A salvo que se añada una API específica del componente |
| Icono del logo (con glow) | **Siempre activo** — `filter: drop-shadow(0 0 20px rgba(255,0,54,0.4))` | Decisión específica del componente |
| Links inline CTA | **Sin glow**: solo transición de color | Sin efecto |

### Glow del botón Secondary (3 capas, contenido):

```css
box-shadow:
  /* L1: near glow */
  0 0 8px 2px rgba(255, 0, 54, 0.15),
  /* L2: mid dispersal */
  0 0 24px 4px rgba(255, 0, 54, 0.07),
  /* L3: inset tint (no top highlight) */
  inset 0 0 10px rgba(255, 0, 54, 0.04);
```

No hay una capa de anillo ceñido: secondary no necesita simular un borde porque ya tiene un `border: 1.5px solid` real.

---

## 5. Técnica del borde degradado

### Por qué `border-image` falla con `border-radius`

`border-image` reemplaza la representación `border` e ignora `border-radius`. Un botón tipo pastilla (`border-radius: 9999px`) con `border-image` se representa como un rectángulo con clips de borde degradados en las esquinas. No existe una solución alternativa para esto en CSS: `border-image` es fundamentalmente incompatible con `border-radius`.

### Técnica con pseudo-elemento `::before`

El borde con degradado se crea colocando un pseudo-elemento detrás del componente y haciéndolo crecer 1.5px en cada dirección mediante `inset: -1.5px`. El elemento padre usa `border: 1.5px solid transparent` y `background-clip: padding-box` para evitar que el fondo del propio padre se vea a través del área del borde.

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

### Ventaja de composición en GPU

El degradado de `::before` es una capa estática ya pintada. En hover solo se anima `opacity` sobre `::before` (o se sustituye el fondo por una versión con mayor opacidad). Como los cambios de `opacity` los resuelve el compositor de la GPU y no el hilo principal, se evita trabajo de layout y repintado. Animar `background` directamente sobre un degradado obligaría a repintar cada frame.

### Valores exactos del degradado: botón Secondary (resaltado ghost):

```css
/* Tight directional gradient — white flash from top-left, red dominance mid, fades to transparent */
background: linear-gradient(
  135deg,
  rgba(255, 255, 255, 0.12) 0%,
  rgba(255, 0, 54, 0.45) 45%,
  rgba(255, 0, 54, 0.08) 100%
);
```

### Cuándo usar un borde con degradado

- Botones secondary o ghost que necesitan peso visual sin relleno sólido
- Campos de input en estado de focus (transición de la opacidad de `::before` de 0 a 1)
- Cards activas con borde acentuado
- Nunca en separadores estructurales, bordes de tablas ni contenedores de layout.

---

## 6. Reglas de transición

| Tipo de interacción | Duración | Easing | Propiedades |
| ------------------------------------------ | --------------------- | -------------------------------- | ------------------------------------------ |
| Hover de Button (primary/secondary) | 250ms | `ease` | `box-shadow`, `background` |
| Hover de Button (secondary — incluye borde) | 250ms | `ease` | `box-shadow`, `background`, `border-color` |
| Hover de Card | 300ms | `ease` | `border-color`, `box-shadow`, `transform` |
| Revelado del degradado `::before` en Card | 300ms | `ease` implícito | `opacity` |
| Hover de Dropdown / item de menú | 150ms | `ease` | `background`, `color` |
| Hover de link inline | 200ms | `ease` | `color`, `border-color` |
| Hover de locale switcher / nav badge | 200ms | `ease` | `border-color`, `box-shadow` |
| Partes del badge de estrellas de GitHub | 200ms | `ease` | `background`, `color` |
| Entrada de modal / barra lateral | 250ms | `ease` | `opacity`, `transform` |
| Entrada de barra sticky | 350ms | `ease` | `opacity`, `transform` |
| Scroll fade-in (`IntersectionObserver`) | 560ms | `cubic-bezier(0.2, 0.8, 0.2, 1)` | `opacity`, `transform` |
| Expansión hover de pipeline | 400–450ms | `cubic-bezier(0.4, 0, 0.2, 1)` | `flex`, `max-width` |
| Fade-in del panel derecho de pipeline | 200ms (retraso de 450ms) | `ease` | `opacity` |
| Color de enlaces de navegación | 200ms | `ease` | `color` |

**Regla:** NO uses nunca `transition: all`. Enumera siempre las propiedades exactas.

**Propiedades animables permitidas:** `opacity`, `transform`, `box-shadow`, `background-color`, `border-color`, `color`, `gap`, `flex`, `max-width` (para patrones de expansión), `filter` (para brillos de iconos).

**No animes nunca:** `width`, `height`, `top`, `right`, `bottom`, `left`, `margin`, `padding`; todas ellas fuerzan reflow.

---

## 7. Lista de verificación de accesibilidad

### Botones

- [ ] Altura visual alineada con la escala `control` (`h-control-xs|sm|md|lg`) según el size prop
- [ ] Anillo de enfoque: utilidad compartida `focus-ring` con `outline: 2px solid var(--color-primary)` y `outline-offset: 2px`
- [ ] El foco visible no depende de `box-shadow`, glow decorativo ni variante visual
- [ ] Anillo de enfoque nunca oculto: no `outline: none` sin reponer `focus-visible:focus-ring` o equivalente
- [ ] Deshabilitado: `opacity: 0.4`, `cursor: not-allowed`, `pointer-events: none` — sin cambio de color
- [ ] Primary: texto `#ffffff` blanco sobre degradado rojo; el contraste pasa en ambos modos
- [ ] Secondary en oscuro: `color: #ffffff` sobre `rgba(255,0,54,0.06)` — el contexto de fondo ya es oscuro y el borde comunica la señal visual
- [ ] Secondary en claro: `color: #cc0030` — nunca `#ff0036` en modo claro (contraste insuficiente sobre blanco)
- [ ] El objetivo táctil se evalúa por contexto: usa `touch-target-min` (`44px`) en superficies touch-first o wrappers de hit area; las variantes compactas/densas documentadas pueden mantener una altura visual menor si siguen siendo accesibles.
- [ ] `role="button"` si se implementa como elemento no `<button>`

### Entradas

- [ ] Altura visual alineada con la escala `form-field` (`h-form-field-sm|md|lg`) y consistente entre campos como `Input` y `Select`; no forzar `h-control-*` cuando el label/floating label forma parte del patrón
- [ ] Texto del marcador de posición `#6a6b6c` — WCAG exime el marcador de posición del contraste (informativo, no funcional)
- [ ] Estado Error: cambio de borde + sombra, color NOT del texto de entrada
- [ ] Estado Info: cambio de borde + sombra con `--color-info-light` en claro y `--color-info` en oscuro; no tratarlo como helper neutral
- [ ] Mensaje de error: `color: #ff0036` en oscuro / `#db143c` en claro; verifica el contraste sobre la superficie
- [ ] Etiquetas siempre visibles; nunca inputs que dependan solo del placeholder
- [ ] Anillo de enfoque: el wrapper del campo usa la misma utilidad `focus-ring` cuando contiene un hijo `:focus-visible`
- [ ] Deshabilitado: `opacity: 0.4`, `cursor: not-allowed`, `pointer-events: none`

### Tarjetas/enlaces interactivos

- [ ] Cards con `href` envueltas en `<a>` o `<Link>`: `text-decoration: none; color: inherit` en el contenedor, mientras que el texto real del CTA conserva el color
- [ ] `aria-label` en tarjetas sin etiqueta visible explícita que describa el destino
- [ ] Anillo de focus en el contenedor `<a>`: `focus-visible:focus-ring`, independiente de cualquier glow decorativo
- [ ] `transform: translateY(-6px)` en hover: respeta `@media (prefers-reduced-motion: reduce)` y pasa a `transform: none; transition: none`
- [ ] `FeatureCard` usa `aria-label={title}` en el elemento `<article>` ✅

### Dropdown / elementos de navegación

- [ ] Cada elemento usa como mínimo `padding: 7px 12px`; en superficies touch-first o mobile, envuélvelo en un contenedor o item con `min-h-touch-target-min` si hace falta ampliar el hit area
- [ ] Elemento activo: `color: #ff0036` — contraste 4.96:1 en la superficie `#0B131E` ✅
- [ ] Pasar el cursor: cambio de fondo + cambio de color: dos señales simultáneas (no hover-only)
- [ ] Navegación con teclado: el menú desplegable debe poder recorrerse con las teclas Tabulador/Flecha

### Anuncios/banners

- [ ] `font-size` mínimo `0.85rem` (13.6px) para barras de anuncios
- [ ] Color del link `#ff4d6d`: comprueba el contraste sobre el fondo de la barra
- [ ] Oculto en móvil (`display: none` en `max-width: 768px`): asegúrate de que el contenido siga siendo accesible de otra forma

### Movimiento

- [ ] `@media (prefers-reduced-motion: reduce)` desactiva todos los scroll fade-ins, los `transform` de cards y las animaciones de pipeline
- [ ] Los glows ambientales del fondo (`glowPulse`, `spotBreath`) pasan a `animation: none` con reduced-motion
- [ ] Duración máxima de transición: 560ms (scroll fade-in); las transiciones interactivas no superan 300ms

---

## 8. Antipatrones

### ❌ Usando `transition: all`

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

Animar `all` fuerza reflow si cambia cualquier propiedad dimensional y provoca tirones visuales. Además, anima `color`, `opacity` y `transform` al mismo tiempo incluso cuando no corresponde.

---

### ❌ Animar el fondo degradado directamente

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

Nota: los botones SON la excepción. Su transición de degradado en `background` está permitida y funciona porque el navegador anima entre un estado base estático y un estado de hover también estático (pinta ambos y hace un fundido cruzado). Aun así, se declara explícitamente como `transition: box-shadow 0.25s ease, background 0.25s ease`.

---

### ❌ `backdrop-filter` en tarjetas de contenido

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

Aplicar blur a las cards de contenido confunde la jerarquía visual: comunica "estoy flotando" cuando en realidad la card es contenido asentado. Además, tiene un coste importante de GPU en páginas largas con muchas cards.

---

### ❌ Brillo de una sola capa

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

Los glows de una sola capa no tienen anillo ceñido, halo cercano, dispersión amplia ni resaltado interno. El resultado se parece más a una sombra borrosa que a un glow tipo neón.

---

### ❌ Borde plano en el botón secundario

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

Un borde plano `#ff0036` con opacidad total es duro y rompe la suavidad del sistema. El enfoque correcto utiliza un borde semitransparente con un 55 % de opacidad combinado con un brillo complementario.

---

### ❌ Glows o sombras locales como único indicador de focus

```css
/* ❌ Wrong — component-local shadow focus drifts and can disappear with decorative glow */
.button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 0, 54, 0.4);
}

/* ✅ Correct — one shared native focus contract */
.button:focus-visible {
  outline-style: solid;
  outline-color: var(--color-primary);
  outline-width: 2px;
  outline-offset: 2px;
}
```

El indicador de focus no debe depender de glows decorativos, sombras por variante ni reglas locales difíciles de auditar. En componentes usa la utilidad compartida `focus-ring` (`focus-visible:focus-ring`, `peer-focus-visible:focus-ring`, `group-focus-visible:focus-ring` o equivalente para wrappers).

---

### ❌ Cambio de color para estado deshabilitado

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

Pasar el componente a gris no comunica por qué está deshabilitado y rompe la coherencia visual. La opacidad al 0,4 preserva la identidad del componente y, a la vez, deja clara su indisponibilidad.

---

### ❌ Colocar el cursor como único indicador de estado

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
  outline-style: solid;
  outline-color: var(--color-primary);
  outline-width: 2px;
  outline-offset: 2px;
  color: #ffffff;
}
.navLink:active {
  background: rgba(255, 255, 255, 0.08);
}
```

Los indicadores que existen solo en hover son inaccesibles para quienes navegan con teclado. La pseudo-clase `:focus-visible` muestra el anillo solo en navegación por teclado (no cuando el focus llega desde un clic de ratón), que es el comportamiento moderno correcto.

---

### ❌ `border-image` para bordes degradados

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

`border-image` con `slice: 1` literalmente recorta el degradado en segmentos rectangulares, ignorando por completo `border-radius`. Esta ha sido una limitación de CSS desde que se introdujo `border-image`.

---

### ❌ Mezclando `backdrop-filter` y degradado en el mismo elemento

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

`backdrop-filter: blur` ya crea profundidad visual al mostrar una versión difuminada de lo que hay detrás. Añadir un degradado por encima introduce señales de profundidad contradictorias y reduce la legibilidad. Reserva los degradados para elementos opacos.

---

### ❌ Usando `#000000` como fondo oscuro

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

El fondo oscuro canónico es `#060C13` (azul pizarra, H215 S50: un matiz frío perceptible). El negro puro `#000000` se ve apagado y no guarda relación con el resto del sistema de color. El rojo cálido de la marca gana más presencia y resonancia sobre ese fondo oscuro con matiz frío.

---

### ❌ Usar `#ff0036` como color de texto en modo claro

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

`#ff0036` alcanza solo ~3,9:1 sobre blanco puro, por debajo de WCAG AA (4,5:1). Usa siempre `#cc0030` o `#db143c` como mínimo en contextos claros.

---

### ❌ Colocar el fondo de la cuadrícula dentro de tarjetas o menús desplegables

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

La cuadrícula es una textura del lienzo de página, no una textura de superficie. Si se aplica a cards o dropdowns, introduce demasiado ruido visual y reduce la legibilidad del contenido.
