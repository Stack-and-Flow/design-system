import type dynamicIconImports from 'lucide-react/dynamicIconImports';
import _ from './safelist';

export type DynamicIconName = keyof typeof dynamicIconImports;

// ── Shared design tokens ──────────────────────────────────────────────────────

/** Border-radius scale shared across all components */
export type ThemeRounded = 'xs' | 'sm' | 'md' | 'lg' | 'full' | 'none';

/** Pixel sizes for icons — multiples of 2 from 10 to 40 */
export type IconSizes = 10 | 12 | 14 | 16 | 18 | 20 | 22 | 24 | 26 | 28 | 30 | 32 | 34 | 36 | 38 | 40;

export type TextThemeColors =
  // Brand
  | 'text-color-brand-light'
  | 'text-color-brand-dark'
  | 'text-color-primary'
  // Text
  | 'text-color-text-light'
  | 'text-color-text-dark'
  | 'text-color-text-secondary-light'
  | 'text-color-text-secondary-dark'
  | 'text-color-text-tertiary-light'
  | 'text-color-text-tertiary-dark'
  | 'text-color-text-muted-light'
  | 'text-color-text-muted-dark'
  | 'text-color-text-disabled-light'
  | 'text-color-text-disabled-dark'
  // Red scale
  | 'text-color-red-100'
  | 'text-color-red-200'
  | 'text-color-red-300'
  | 'text-color-red-400'
  | 'text-color-red-500'
  | 'text-color-red-600'
  | 'text-color-red-700'
  | 'text-color-red-800'
  | 'text-color-red-900'
  // Semantic
  | 'text-color-success'
  | 'text-color-success-light'
  | 'text-color-warning'
  | 'text-color-warning-light'
  | 'text-color-error'
  | 'text-color-error-light'
  | 'text-color-info'
  | 'text-color-info-light'
  // Extended palette
  | 'text-color-yellow'
  | 'text-color-yellow-light'
  | 'text-color-yellow-dark'
  | 'text-color-green'
  | 'text-color-green-light'
  | 'text-color-green-dark'
  | 'text-color-teal'
  | 'text-color-teal-light'
  | 'text-color-teal-dark'
  | 'text-color-blue'
  | 'text-color-blue-light'
  | 'text-color-blue-dark'
  | 'text-color-indigo'
  | 'text-color-indigo-light'
  | 'text-color-indigo-dark'
  | 'text-color-purple'
  | 'text-color-purple-light'
  | 'text-color-purple-dark'
  | 'text-color-pink'
  | 'text-color-pink-light'
  | 'text-color-pink-dark'
  | 'text-color-orange'
  | 'text-color-orange-light'
  | 'text-color-orange-dark'
  | 'text-color-amber'
  | 'text-white'
  | 'text-black';

/** Dark-mode variant of every TextThemeColor — derived, never hand-maintained */
export type TextDarkThemeColors = `dark:${TextThemeColors}`;

export type BgThemeColors =
  // Brand
  | 'bg-color-brand-light'
  | 'bg-color-brand-dark'
  | 'bg-color-primary'
  // Surfaces
  | 'bg-color-background-light'
  | 'bg-color-background-dark'
  | 'bg-color-surface-light'
  | 'bg-color-surface-dark'
  | 'bg-color-surface-raised-light'
  | 'bg-color-surface-raised-dark'
  // Red scale
  | 'bg-color-red-100'
  | 'bg-color-red-200'
  | 'bg-color-red-300'
  | 'bg-color-red-400'
  | 'bg-color-red-500'
  | 'bg-color-red-600'
  | 'bg-color-red-700'
  | 'bg-color-red-800'
  | 'bg-color-red-900'
  // Semantic
  | 'bg-color-success'
  | 'bg-color-success-light'
  | 'bg-color-warning'
  | 'bg-color-warning-light'
  | 'bg-color-error'
  | 'bg-color-error-light'
  | 'bg-color-info'
  | 'bg-color-info-light'
  // Extended palette
  | 'bg-color-yellow'
  | 'bg-color-yellow-light'
  | 'bg-color-yellow-dark'
  | 'bg-color-green'
  | 'bg-color-green-light'
  | 'bg-color-green-dark'
  | 'bg-color-teal'
  | 'bg-color-teal-light'
  | 'bg-color-teal-dark'
  | 'bg-color-blue'
  | 'bg-color-blue-light'
  | 'bg-color-blue-dark'
  | 'bg-color-indigo'
  | 'bg-color-indigo-light'
  | 'bg-color-indigo-dark'
  | 'bg-color-purple'
  | 'bg-color-purple-light'
  | 'bg-color-purple-dark'
  | 'bg-color-pink'
  | 'bg-color-pink-light'
  | 'bg-color-pink-dark'
  | 'bg-color-orange'
  | 'bg-color-orange-light'
  | 'bg-color-orange-dark'
  | 'bg-color-amber'
  | 'bg-white'
  | 'bg-black'
  | 'bg-transparent';
