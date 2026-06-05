import type { DialogContentProps } from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, FC, FocusEvent, KeyboardEvent, MouseEvent, ReactElement, ReactNode } from 'react';

export const drawerOverlayVariants = cva(
  [
    'fixed inset-0 z-modal',
    'data-[state=closed]:animate-out data-[state=open]:animate-in',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
  ],
  {
    variants: {
      backdrop: {
        opacity: 'bg-overlay-dark',
        blur: 'bg-overlay-dark backdrop-blur-overlay',
        transparent: 'bg-transparent'
      }
    },
    defaultVariants: {
      backdrop: 'opacity'
    }
  }
);

export const drawerPanelVariants = cva(
  [
    'fixed z-modal flex w-full flex-col border shadow-modal outline-none dark:shadow-modal-dark',
    'bg-surface-light text-text-light dark:bg-surface-dark dark:text-text-dark',
    'border-border-light dark:border-border-dark',
    'data-[state=closed]:animate-out data-[state=open]:animate-in',
    'transition-[opacity,transform] duration-250 ease-out motion-reduce:!animate-none motion-reduce:!transition-none'
  ],
  {
    variants: {
      placement: {
        start: [
          'inset-x-0 bottom-0 max-h-drawer-md rounded-t-lg border-t',
          'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
          'md:inset-x-auto md:inset-y-0 md:bottom-auto md:h-dvh md:max-h-none md:rounded-none md:border-t-0',
          'ltr:md:left-0 ltr:md:border-r rtl:md:right-0 rtl:md:border-l',
          'md:data-[state=closed]:slide-out-to-start md:data-[state=open]:slide-in-from-start',
          'md:data-[state=closed]:slide-out-to-bottom-0 md:data-[state=open]:slide-in-from-bottom-0'
        ],
        end: [
          'inset-x-0 bottom-0 max-h-drawer-md rounded-t-lg border-t',
          'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
          'md:inset-x-auto md:inset-y-0 md:bottom-auto md:h-dvh md:max-h-none md:rounded-none md:border-t-0',
          'ltr:md:right-0 ltr:md:border-l rtl:md:left-0 rtl:md:border-r',
          'md:data-[state=closed]:slide-out-to-end md:data-[state=open]:slide-in-from-end',
          'md:data-[state=closed]:slide-out-to-bottom-0 md:data-[state=open]:slide-in-from-bottom-0'
        ],
        top: 'inset-x-0 top-0 rounded-b-lg border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 rounded-t-lg border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom'
      },
      size: {
        xs: '',
        sm: '',
        md: '',
        lg: '',
        xl: '',
        full: ''
      }
    },
    compoundVariants: [
      { placement: ['start', 'end'], size: 'xs', class: 'max-h-drawer-xs md:max-h-none md:max-w-modal-xs' },
      { placement: ['start', 'end'], size: 'sm', class: 'max-h-drawer-sm md:max-h-none md:max-w-modal-sm' },
      { placement: ['start', 'end'], size: 'md', class: 'max-h-drawer-md md:max-h-none md:max-w-modal-md' },
      { placement: ['start', 'end'], size: 'lg', class: 'max-h-drawer-lg md:max-h-none md:max-w-modal-lg' },
      { placement: ['start', 'end'], size: 'xl', class: 'max-h-drawer-xl md:max-h-none md:max-w-modal-xl' },
      { placement: ['start', 'end'], size: 'full', class: 'h-dvh max-h-drawer-full md:max-h-dvh md:max-w-full' },
      { placement: ['top', 'bottom'], size: 'xs', class: 'max-h-drawer-xs' },
      { placement: ['top', 'bottom'], size: 'sm', class: 'max-h-drawer-sm' },
      { placement: ['top', 'bottom'], size: 'md', class: 'max-h-drawer-md' },
      { placement: ['top', 'bottom'], size: 'lg', class: 'max-h-drawer-lg' },
      { placement: ['top', 'bottom'], size: 'xl', class: 'max-h-drawer-xl' },
      { placement: ['top', 'bottom'], size: 'full', class: 'max-h-drawer-full' }
    ],
    defaultVariants: {
      placement: 'end',
      size: 'md'
    }
  }
);

export const drawerHeaderVariants = cva('shrink-0 border-b border-border-light p-6 pb-4 dark:border-border-dark');
export const drawerTitleVariants = cva('fs-h5 font-semibold text-text-light dark:text-text-dark');
export const drawerDescriptionVariants = cva('mt-2 text-sm text-text-secondary-light dark:text-text-secondary-dark');
export const drawerBodyVariants = cva(
  'flex-1 overflow-y-auto p-6 py-4 text-text-secondary-light dark:text-text-secondary-dark'
);
export const drawerFooterVariants = cva(
  'flex shrink-0 items-center justify-end gap-2 border-t border-border-light p-6 pt-4 pb-drawer-safe dark:border-border-dark'
);
export const drawerCloseVariants = cva(
  [
    'inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md px-3 py-2 text-sm font-semibold',
    'text-text-light dark:text-text-dark',
    'hover:bg-black-tint-low dark:hover:bg-white-tint-faint',
    'focus-visible:outline-none focus-visible:shadow-glow-focus-light dark:focus-visible:shadow-glow-focus-dark',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40',
    'transition-[background,box-shadow,color] duration-150 ease-out'
  ].join(' ')
);

type DrawerPanelVariantProps = VariantProps<typeof drawerPanelVariants>;
type DrawerOverlayVariantProps = VariantProps<typeof drawerOverlayVariants>;

export type DrawerPlacement = NonNullable<DrawerPanelVariantProps['placement']>;
export type DrawerSize = NonNullable<DrawerPanelVariantProps['size']>;
export type DrawerBackdrop = NonNullable<DrawerOverlayVariantProps['backdrop']>;

export type DrawerProps = {
  /** @control object */
  children: ReactNode;
  /** @control boolean */
  open?: boolean;
  /**
   * @control boolean
   * @default false
   */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type DrawerTriggerProps = Omit<ComponentProps<'button'>, 'children'> & {
  /** @control object */
  children: ReactNode;
  /**
   * @control boolean
   * @default false
   */
  asChild?: boolean;
  /**
   * @control boolean
   * @default false
   */
  disabled?: boolean;
};

export type DrawerContentProps = Omit<DialogContentProps, 'children' | 'dir'> & {
  /** @control object */
  children: ReactNode;
  /**
   * @control select
   * @default end
   */
  placement?: DrawerPlacement;
  /**
   * @control select
   * @default md
   */
  size?: DrawerSize;
  /**
   * @control select
   * @default opacity
   */
  backdrop?: DrawerBackdrop;
  /**
   * @control boolean
   * @default true
   */
  dismissible?: boolean;
  /**
   * @control boolean
   * @default true
   */
  closeOnEscape?: boolean;
};

type DrawerSlotProps = ComponentProps<'div'> & {
  /** @control object */
  children: ReactNode;
};

export type DrawerHeaderProps = DrawerSlotProps;
export type DrawerBodyProps = DrawerSlotProps;
export type DrawerFooterProps = DrawerSlotProps;

export type DrawerTitleProps = ComponentProps<'h2'> & {
  /** @control object */
  children: ReactNode;
};

export type DrawerDescriptionProps = ComponentProps<'p'> & {
  /** @control object */
  children: ReactNode;
};

export type DrawerCloseProps = Omit<ComponentProps<'button'>, 'children'> & {
  /** @control object */
  children?: ReactNode;
  /**
   * @control boolean
   * @default false
   */
  asChild?: boolean;
};

export type DrawerCompoundComponent = FC<DrawerProps> & {
  // biome-ignore lint/style/useNamingConvention: compound API requires PascalCase slot names
  Trigger: FC<DrawerTriggerProps>;
  // biome-ignore lint/style/useNamingConvention: compound API requires PascalCase slot names
  Content: FC<DrawerContentProps>;
  // biome-ignore lint/style/useNamingConvention: compound API requires PascalCase slot names
  Header: FC<DrawerHeaderProps>;
  // biome-ignore lint/style/useNamingConvention: compound API requires PascalCase slot names
  Title: FC<DrawerTitleProps>;
  // biome-ignore lint/style/useNamingConvention: compound API requires PascalCase slot names
  Description: FC<DrawerDescriptionProps>;
  // biome-ignore lint/style/useNamingConvention: compound API requires PascalCase slot names
  Body: FC<DrawerBodyProps>;
  // biome-ignore lint/style/useNamingConvention: compound API requires PascalCase slot names
  Footer: FC<DrawerFooterProps>;
  // biome-ignore lint/style/useNamingConvention: compound API requires PascalCase slot names
  Close: FC<DrawerCloseProps>;
};

export type DrawerTriggerElement = ReactElement<{
  [key: string]: unknown;
  'aria-controls'?: string;
  'aria-disabled'?: boolean;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: 'dialog';
  'data-disabled'?: 'true';
  className?: string;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  role?: string;
  tabIndex?: number;
  type?: 'button';
}>;
