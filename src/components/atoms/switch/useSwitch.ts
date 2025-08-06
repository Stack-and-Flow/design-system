import type { SwitchProps } from './types';
// import { switchVariants } from './types';
export const useSwitch = ({
  label,
  className = '',
  size = 'md',
  color = 'primary',
  labelPlacement = 'right',
  withIcon = false,
  thumbIcon = false,
  variant = 'default',
  rounded = true,
  checked = false,
  disabled = false
}: SwitchProps) => {
  // DEFINIR LOS ESTILOS EN EL CVA
  // const switchClass = switchVariants({ size, color, labelPlacement, variant, rounded });

  return {
    label,
    className,
    size,
    color,
    variant,
    rounded,
    labelPlacement,
    withIcon,
    thumbIcon,
    checked,
    disabled
    // switchClass,
  };
};
