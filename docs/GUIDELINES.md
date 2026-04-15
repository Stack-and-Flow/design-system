# Guías Técnicas

Bienvenido al código fuente del Design System Stack-and-Flow. Seguimos estrictamente **Atomic Design** combinado con el patrón **Container/Presentational**. Respetar estas guías es **OBLIGATORIO** para cualquier PR.

> 🇬🇧 [English version](./GUIDELINES.en.md)

---

## Arquitectura: Atomic Design

La UI se divide en tres niveles de complejidad:

- **Atoms**: Los bloques básicos de construcción (ej: `Button`, `Badge`, `Input`). No dependen de otros componentes del sistema, salvo funciones utilitarias.
- **Molecules**: Grupos de átomos combinados para formar una unidad funcional (ej: `Modal` generalmente usa botones, tipografía, etc.).
- **Organisms**: Componentes de UI complejos que forman secciones diferenciadas de una interfaz (ej: un `Header` compuesto por logo, molécula de búsqueda y átomos de navegación).

---

## Patrón: Container & Presentational

Cada componente DEBE separarse en lógica (Container) y renderizado (Presentational). Lo logramos mediante custom hooks y archivos `.tsx`.

### Estructura de 5 archivos

Cada componente DEBE vivir dentro de un directorio en kebab-case (`src/components/atoms/button/`) y contener EXACTAMENTE estos cinco archivos:

| Archivo | Propósito | Regla |
| ------- | --------- | ----- |
| `Button.tsx` | Componente Presentacional | SOLO JSX y lógica de renderizado. Consume el hook. |
| `useButton.ts` | Hook Container | Contiene TODA la lógica, estado y generación de clases `cva`. |
| `types.ts` | Tipos y Variantes | Define las props del componente usando `type` y exporta variantes `cva`. |
| `index.ts` | API Pública | Re-exporta el componente y los tipos. |
| `Button.stories.tsx` | Documentación | Contiene la definición de Storybook, `args` y `parameters.docs`. |

### 1. Tipos y Variantes (`types.ts`)
Todas las variantes `cva` van aquí, nunca en el hook ni en el componente.
Usa comentarios JSDoc para generar automáticamente los controles de Storybook.

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  ['flex items-center justify-center font-secondary-bold'],
  {
    variants: {
      variant: {
        primary: 'bg-secondary text-text-dark',
        ghost: 'bg-transparent text-text-light'
      }
    },
    defaultVariants: {
      variant: 'primary'
    }
  }
);

export type ButtonProps = {
  /**
   * @control select
   * @default primary
   */
  variant?: VariantProps<typeof buttonVariants>['variant'];
  className?: string;
  disabled?: boolean;
};
```

### 2. Hook Container (`useButton.ts`)
El hook retorna todo lo que el elemento necesita: clases CSS, manejadores de eventos, props mapeadas y atributos `aria`.

```typescript
import { buttonVariants, type ButtonProps } from './types';

export const useButton = ({
  variant = 'primary',
  className,
  disabled = false,
  ...props
}: ButtonProps) => {
  // Logic here (refs, state, effects)
  const buttonClass = buttonVariants({ variant, className });

  return {
    buttonClass,
    disabled,
    ...props
  };
};
```

### 3. Componente Presentacional (`Button.tsx`)
Solo desestructura lo que necesita del hook y lo renderiza.

```tsx
import type { FC, ComponentProps } from 'react';
import type { ButtonProps } from './types';
import { useButton } from './useButton';

const Button: FC<ButtonProps & ComponentProps<'button'>> = ({ ...props }) => {
  const { buttonClass, disabled, children } = useButton(props);

  return (
    <button className={buttonClass} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
```

### 4. API Pública (`index.ts`)
```typescript
import Button from './Button';
export * from './types';
export default Button;
```

---

## Reglas de TypeScript

- **`type` sobre `interface`**: USA SIEMPRE `export type ComponentProps = {}`. NO uses `interface`.
- **Sin `any`**: El uso explícito de `any` está estrictamente prohibido. Si no conoces el tipo, usa `unknown` o reduce el tipo correctamente.
- **Props explícitas**: Nunca tipifiques props implícitamente. Todo DEBE estar definido explícitamente en `types.ts`.
- **Definición de componente**: Usa `FC<ComponentProps>` y `export default Component`.

---

## Reglas de Storybook

- **Solo en inglés**: Todas las stories deben escribirse en inglés.
- **Controles obligatorios**: Usa comentarios JSDoc (`/** @control text */`) en `types.ts` para activar los controles.
- **Descripción obligatoria**: Cada story de componente DEBE incluir una descripción en docs:
  ```typescript
  parameters: {
    docs: {
      description: {
        component: 'A versatile button component used to trigger actions.'
      }
    }
  }
  ```
- **Args**: Define `args` por defecto para la story base.

---

## Tokens del Sistema y Estilos

Usamos Tailwind v4 con configuraciones `@theme` definidas en `src/styles/theme.css`.

- **OBLIGATORIO**: DEBES usar las propiedades CSS personalizadas del design system (tokens) mediante clases de Tailwind.
- **SIN HARDCODING**: Nunca escribas colores en duro (ej: `#FF0000`), espaciados (`16px`, `1rem`) ni fuentes en estilos inline o clases Tailwind arbitrarias (ej: `text-[#fce9ea]`).
- Usa las clases predefinidas: `text-text-dark`, `bg-secondary`, `gap-sm`, `fs-h1`, etc.

---

## Accesibilidad (a11y)

La accesibilidad es una funcionalidad principal, no un agregado posterior.

- **Atributos ARIA**: Los elementos interactivos DEBEN tener los atributos ARIA apropiados (`aria-expanded`, `aria-pressed`, `aria-hidden`, etc.).
- **`aria-label` dinámico**: No escribas `aria-label` en duro. Exponlo como prop para que los consumidores puedan personalizarlo para traducciones o contexto.
- **Roles**: Define `role` explícitamente cuando la semántica lo requiera (ej: `role="status"` en Badge, `role="switch"` en botones con toggle).
- **Navegación por teclado**: Asegúrate de que los elementos sean enfocables y muestren el foco visualmente (`focus-visible`). Nuestros estilos globales gestionan los anillos de foco de forma nativa.

---

## Convenciones de Nomenclatura

- **Directorios**: `kebab-case` (ej: `src/components/atoms/date-picker/`).
- **Componentes y archivos**: `PascalCase` (ej: `DatePicker.tsx`, `DatePicker.stories.tsx`).
- **Hooks**: `camelCase` con prefijo `use` (ej: `useDatePicker.ts`).
- **Tipos**: `PascalCase` (ej: `DatePickerProps`).
- **Variantes CVA**: `camelCase` con sufijo `Variants` (ej: `datePickerVariants`).

---

## Testing

Cada componente del design system DEBE tener un archivo de test correspondiente que siga estas convenciones.

### Estrategia

Seguimos la separación Container/Presentational también en los tests:

| Capa | Herramienta | Qué testear |
|------|-------------|-------------|
| `useComponentName.ts` (Hook) | `renderHook` | Lógica pura: valores por defecto, props computadas, manejadores de eventos, forma del retorno |
| `ComponentName.tsx` (Componente) | `render` + `screen` + `userEvent` | Comportamiento observable: accesibilidad, estado deshabilitado, loading, manejo de clicks |

**Nunca testees detalles de implementación**: NO hagas assertions sobre cadenas de clases CSS, valores internos de refs, ni qué string de variante se aplica al DOM. Testea lo que un usuario real (o un lector de pantalla) observaría.

### Ubicación y Nomenclatura del Archivo

Coloca el archivo de test junto al componente — no en un directorio `__tests__` separado:

```
src/components/atoms/button/
  Button.tsx
  useButton.ts
  types.ts
  index.ts
  Button.stories.tsx
  Button.test.tsx   ← aquí
```

### Cobertura Mínima Requerida

Cada archivo de test de componente DEBE cubrir:

1. **Estado por defecto** — el componente renderiza sin props requeridas
2. **Prop `disabled`** — el elemento está deshabilitado cuando `disabled={true}`
3. **Prop `isLoading`** — el elemento está deshabilitado cuando `isLoading={true}` (aunque `disabled={false}`)
4. **Manejador `onClick`** — se llama cuando es interactivo y no está cargando; NO se llama cuando está cargando
5. **`aria-label`** — el nombre accesible se aplica correctamente
6. **Valores por defecto del hook** — `disabled: false` e `isLoading: false` son retornados por defecto

### Mocks Requeridos

Siempre mockea estos dos paquetes — importan animaciones CSS o módulos dinámicos que rompen jsdom:

```typescript
vi.mock('lucide-react/dynamic', () => ({
  DynamicIcon: () => null
}));

vi.mock('spinners-react', () => ({
  SpinnerCircular: () => null
}));
```

También mockea cualquier archivo CSS importado directamente desde el componente:

```typescript
vi.mock('@/components/utils/styles/index.css', () => ({}));
```

### Ejemplos de Referencia

**Test de hook** — usa `renderHook`:
```typescript
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useButton } from './useButton';

describe('useButton — logic', () => {
  it('returns disabled: false by default', () => {
    const { result } = renderHook(() => useButton({}));
    expect(result.current.disabled).toBe(false);
  });

  it('returns the correct variant when variant: ghost is passed', () => {
    const { result } = renderHook(() => useButton({ variant: 'ghost' }));
    expect(result.current.variant).toBe('ghost');
  });
});
```

**Test de componente** — usa `render` + `screen` + `userEvent`:
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Button from './Button';

describe('Button — component behavior', () => {
  it('is disabled when isLoading is true', () => {
    render(<Button text="Loading" isLoading disabled={false} />);
    expect(screen.getByRole('button', { name: 'Loading' })).toBeDisabled();
  });

  it('does NOT call onClick when isLoading is true', async () => {
    const handleClick = vi.fn();
    render(<Button text="Saving" isLoading onClick={handleClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Saving' }));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### Ejecutar Tests

```bash
pnpm run test            # ejecución única
pnpm run test:watch      # modo watch
pnpm run test:coverage   # con reporte de cobertura
```

---

## Anti-Patrones Estrictos (Lo que NO está Permitido)

Las siguientes prácticas resultan en rechazo del PR:

1. **NO** combinar lógica Presentacional y Container en el mismo archivo `.tsx`.
2. **NO** poner `cva` dentro del archivo `.tsx` o `useHook.ts` (pertenece a `types.ts`).
3. **NO** usar `export interface` en TypeScript.
4. **NO** valores arbitrarios en Tailwind (`p-[14px]`, `text-[#000]`).
5. **NO** código en español (variables, comentarios y stories deben estar en inglés).
6. **NO** tipos `any`.
7. **NO** omitir accesibilidad (`aria-*` o foco por teclado ausente).
8. **NO** exportar múltiples componentes desde un único archivo. Un componente = un directorio.
