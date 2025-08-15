export type DividerProps = {
  /** Props for the Divider component */

  /**
   * @control select
   * @default horizontal
   */
  orientation?: 'vertical' | 'horizontal';

  /**
   * @control select
   * @default lg
   */
  sizeWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * @control select
   * @default md
   */
  sizeHeight?: 'sm' | 'md' | 'lg';

  /**
   * @control select
   * @default primary
   */
  colorsX?: 'primary' | 'secondary' | 'info' | 'success' | 'primaryDegrade' | 'secondaryDegrade';

  /**
   * @control select
   * @default secondary
   */
  colorsY?: 'primary' | 'secondary' | 'info' | 'success' | 'primaryDegrade' | 'secondaryDegrade';

  /**
   * @control boolean
   * @default false
   */ shadow?: boolean;

  /**
   * @control select
   * @default undefined
   */
  animated?: 'fadeIn' | 'pulse' | 'ping' | 'bounce' | 'default';
};
