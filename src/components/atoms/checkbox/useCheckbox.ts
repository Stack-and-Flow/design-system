import { getSanitizedTextContent, sanitizeInlineHtml } from '@utils/sanitizeHtml';
import type { ChangeEvent, ComponentProps, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { CheckboxProps, CheckboxVisualState } from './types';
import {
  checkboxControl,
  checkboxDescription,
  checkboxError,
  checkboxHitArea,
  checkboxIndicator,
  checkboxInput,
  checkboxLabel,
  checkboxRoot
} from './types';

type UseCheckboxReturn = {
  checked: boolean;
  controlClassName: string;
  controlState: CheckboxVisualState;
  description?: ReactNode;
  descriptionClassName: string;
  descriptionId?: string;
  errorClassName: string;
  errorId?: string;
  errorMessage?: ReactNode;
  hasDescription: boolean;
  hasErrorMessage: boolean;
  indicatorClassName: string;
  inputProps: ComponentProps<'input'>;
  isInvalid: boolean;
  labelClassName: string;
  labelHtml?: string;
  labelId?: string;
  labelText?: string;
  rootClassName: string;
  hitAreaClassName: string;
};

const formatAriaIds = (ids?: string | string[]) => {
  if (Array.isArray(ids)) {
    return ids.join(' ');
  }

  return ids;
};

const hasRenderableContent = (value: ReactNode | undefined) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  return value !== undefined && value !== null && value !== false;
};

const normalizePlainText = (value?: string) => value?.replace(/\s+/g, ' ').trim() ?? '';

const isSpaceKey = (key: KeyboardEvent<HTMLInputElement>['key']) => key === ' ' || key === 'Spacebar';

export const useCheckbox = ({
  className,
  inputClassName,
  controlClassName,
  label,
  labelHtml,
  description,
  errorMessage,
  ariaLabel,
  'aria-label': nativeAriaLabel,
  ariaLabelledBy,
  'aria-labelledby': nativeAriaLabelledBy,
  ariaDescribedBy,
  'aria-describedby': nativeAriaDescribedBy,
  checked: checkedProp,
  defaultChecked = false,
  indeterminate = false,
  disabled = false,
  readOnly = false,
  invalid = false,
  onChange,
  onClick,
  onFocus,
  onBlur,
  onKeyDown,
  id,
  variant = 'default',
  size = 'md',
  'aria-invalid': nativeAriaInvalid,
  ...inputProps
}: CheckboxProps): UseCheckboxReturn => {
  if (label && labelHtml) {
    throw new Error('Checkbox accepts either label or labelHtml, but not both.');
  }

  const generatedId = useId().replace(/:/g, '');
  const resolvedId = id ?? `checkbox-${generatedId}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const [, setReadOnlyInteractionCount] = useState(0);
  const isControlled = checkedProp !== undefined;
  const checked = checkedProp ?? internalChecked;

  const plainLabelText = normalizePlainText(label);
  const sanitizedLabelHtml = labelHtml ? sanitizeInlineHtml(labelHtml) : undefined;
  const sanitizedLabelText = sanitizedLabelHtml ? getSanitizedTextContent(sanitizedLabelHtml) : '';
  const externalAriaLabel = ariaLabel ?? nativeAriaLabel;
  const externalLabelledBy = formatAriaIds(ariaLabelledBy ?? nativeAriaLabelledBy);

  if (labelHtml && !sanitizedLabelText && !externalAriaLabel && !externalLabelledBy) {
    throw new Error(
      'Checkbox labelHtml must retain meaningful text after sanitization or be paired with ariaLabel/aria-labelledby.'
    );
  }

  if (!plainLabelText && !sanitizedLabelText && !externalAriaLabel && !externalLabelledBy) {
    throw new Error(
      'Checkbox requires an accessible name. Provide label, labelHtml, ariaLabel, aria-label, ariaLabelledBy, or aria-labelledby.'
    );
  }

  const shouldRenderPlainLabel = plainLabelText.length > 0;
  const shouldRenderHtmlLabel = sanitizedLabelText.length > 0 && Boolean(sanitizedLabelHtml);
  const hasDescription = hasRenderableContent(description);
  const hasErrorMessage = hasRenderableContent(errorMessage);
  const isInvalid = invalid || hasErrorMessage;
  const descriptionId = hasDescription ? `${resolvedId}-description` : undefined;
  const errorId = hasErrorMessage ? `${resolvedId}-error` : undefined;
  const labelId = shouldRenderPlainLabel || shouldRenderHtmlLabel ? `${resolvedId}-label` : undefined;
  const labelledBy = [labelId, externalLabelledBy].filter(Boolean).join(' ') || undefined;
  const describedBy =
    [formatAriaIds(ariaDescribedBy ?? nativeAriaDescribedBy), descriptionId, errorId].filter(Boolean).join(' ') ||
    undefined;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleBlockedToggle = (event: MouseEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>) => {
    if (readOnly) {
      event.preventDefault();
      queueMicrotask(() => {
        if (inputRef.current) {
          inputRef.current.checked = checked;
          inputRef.current.indeterminate = indeterminate;
        }
      });
      setReadOnlyInteractionCount((count) => count + 1);
    }
  };

  const handleClick = (event: MouseEvent<HTMLInputElement>) => {
    handleBlockedToggle(event);
    onClick?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (readOnly && isSpaceKey(event.key)) {
      handleBlockedToggle(event);
    }

    onKeyDown?.(event);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) {
      event.preventDefault();
      event.currentTarget.checked = checked;
      return;
    }

    const nextChecked = event.currentTarget.checked;

    if (!isControlled) {
      setInternalChecked(nextChecked);
    }

    onChange?.(nextChecked, event);
  };

  const controlState: CheckboxVisualState = indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked';

  return {
    checked,
    description,
    controlClassName: cn(checkboxControl({ size, variant, state: controlState, invalid: isInvalid }), controlClassName),
    controlState,
    descriptionClassName: checkboxDescription({ size }),
    descriptionId,
    errorClassName: checkboxError({ size }),
    errorId,
    errorMessage,
    hasDescription,
    hasErrorMessage,
    hitAreaClassName: checkboxHitArea({ disabled, readOnly }),
    indicatorClassName: checkboxIndicator({ size, variant, invalid: isInvalid }),
    inputProps: {
      ...inputProps,
      ref: inputRef,
      id: resolvedId,
      type: 'checkbox',
      checked,
      disabled,
      readOnly,
      'aria-checked': indeterminate ? 'mixed' : checked,
      'aria-describedby': describedBy,
      'aria-invalid': isInvalid ? true : nativeAriaInvalid,
      'aria-label': externalAriaLabel,
      'aria-labelledby': labelledBy,
      'aria-readonly': readOnly ? true : undefined,
      className: cn(checkboxInput({ disabled, readOnly }), inputClassName),
      onBlur,
      onChange: handleChange,
      onClick: handleClick,
      onFocus,
      onKeyDown: handleKeyDown
    },
    isInvalid,
    labelClassName: checkboxLabel({ size, disabled }),
    labelHtml: shouldRenderHtmlLabel ? sanitizedLabelHtml : undefined,
    labelId,
    labelText: shouldRenderPlainLabel ? plainLabelText : undefined,
    rootClassName: cn(checkboxRoot({ disabled }), className)
  };
};
