import { cn } from '@/lib/utils';
import { type IconProps, iconVariants } from './types';

type IconElementProps = Omit<IconProps, 'color' | 'colorDark' | 'decorative' | 'tone'> & {
  className: string;
  focusable: false;
  role?: 'img';
  'aria-hidden'?: true;
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

export type UseIconReturn = {
  iconProps: IconElementProps;
};

const normalizeTextTokenClass = (tokenClass?: string) => tokenClass?.replace('text-color-', 'text-');

export const useIcon = ({
  name,
  tone = 'brand',
  color,
  colorDark,
  size = 24,
  className,
  decorative = false,
  title,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: IconProps): UseIconReturn => {
  const resolvedAriaLabel = ariaLabel?.trim() || undefined;
  const resolvedLabelledBy = ariaLabelledBy?.trim() || undefined;
  const resolvedTitle = title?.trim() || undefined;
  const hasAccessibleName = Boolean(resolvedAriaLabel || resolvedLabelledBy || resolvedTitle);
  const isDecorative = decorative || !hasAccessibleName;
  const normalizedColor = normalizeTextTokenClass(color);
  const normalizedColorDark = normalizeTextTokenClass(colorDark);

  return {
    iconProps: {
      ...props,
      name,
      size,
      title: resolvedTitle,
      className: cn(iconVariants({ tone }), normalizedColor, normalizedColorDark, className),
      focusable: false,
      role: isDecorative ? undefined : 'img',
      'aria-hidden': isDecorative ? true : undefined,
      'aria-label': isDecorative ? undefined : resolvedAriaLabel || (resolvedLabelledBy ? undefined : resolvedTitle),
      'aria-labelledby': isDecorative ? undefined : resolvedLabelledBy
    }
  };
};
