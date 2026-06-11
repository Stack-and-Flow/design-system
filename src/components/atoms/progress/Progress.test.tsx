import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from './Progress';
import { useProgress } from './useProgress';

describe('useProgress', () => {
  it('calculates the default percentage for the default range', () => {
    const { result } = renderHook(() => useProgress({ value: 50 }));

    expect(result.current.clampedValue).toBe(50);
    expect(result.current.percentage).toBe(50);
    expect(result.current.ariaValueMin).toBe(0);
    expect(result.current.ariaValueMax).toBe(100);
    expect(result.current.ariaValueNow).toBe(50);
  });

  it('clamps values below the minimum range', () => {
    const { result } = renderHook(() => useProgress({ value: -10, minValue: 10, maxValue: 30 }));

    expect(result.current.clampedValue).toBe(10);
    expect(result.current.percentage).toBe(0);
  });

  it('clamps values above the maximum range', () => {
    const { result } = renderHook(() => useProgress({ value: 99, minValue: 10, maxValue: 30 }));

    expect(result.current.clampedValue).toBe(30);
    expect(result.current.percentage).toBe(100);
  });

  it('supports custom minimum and maximum values', () => {
    const { result } = renderHook(() => useProgress({ value: 125, minValue: 50, maxValue: 250 }));

    expect(result.current.clampedValue).toBe(125);
    expect(result.current.percentage).toBeCloseTo(37.5);
  });

  it('stays stable when minValue and maxValue are equal', () => {
    const { result } = renderHook(() => useProgress({ value: 40, minValue: 10, maxValue: 10 }));

    expect(result.current.clampedValue).toBe(10);
    expect(result.current.percentage).toBe(0);
    expect(result.current.ariaValueMax).toBe(10);
    expect(result.current.ariaValueNow).toBe(10);
  });

  it('stays stable when maxValue is lower than minValue', () => {
    const { result } = renderHook(() => useProgress({ value: 40, minValue: 20, maxValue: 10 }));

    expect(result.current.clampedValue).toBe(20);
    expect(result.current.percentage).toBe(0);
    expect(result.current.ariaValueMax).toBe(20);
    expect(result.current.ariaValueNow).toBe(20);
  });

  it('sanitizes non-finite numeric inputs', () => {
    const { result } = renderHook(() =>
      useProgress({ value: Number.NaN, minValue: Number.NEGATIVE_INFINITY, maxValue: Number.POSITIVE_INFINITY })
    );

    expect(result.current.clampedValue).toBe(0);
    expect(result.current.percentage).toBe(0);
    expect(result.current.ariaValueMin).toBe(0);
    expect(result.current.ariaValueMax).toBe(100);
    expect(result.current.ariaValueNow).toBe(0);
  });
});

describe('Progress', () => {
  it('omits aria-valuenow when indeterminate', () => {
    render(<Progress isIndeterminate={true} label='Loading' />);

    const progressbar = screen.getByRole('progressbar');
    expect(progressbar.getAttribute('aria-valuenow')).toBeNull();
  });

  it('renders the label and a stable percentage label', () => {
    render(<Progress value={40} minValue={10} maxValue={10} label='Upload progress' showValueLabel={true} />);

    screen.getByText('Upload progress');
    screen.getByText('0%');
    expect(screen.queryByText('NaN%')).toBeNull();
    expect(screen.queryByText('Infinity%')).toBeNull();
  });

  it('does not render NaN or Infinity when numeric props are not finite', () => {
    render(
      <Progress
        value={Number.NaN}
        minValue={Number.NEGATIVE_INFINITY}
        maxValue={Number.POSITIVE_INFINITY}
        label='Upload progress'
        showValueLabel={true}
      />
    );

    screen.getByText('0%');
    expect(screen.queryByText('NaN%')).toBeNull();
    expect(screen.queryByText('Infinity%')).toBeNull();
  });

  it('forwards native props and lets aria-labelledby override the default aria-label', () => {
    render(
      <>
        <span id='external-label'>External progress label</span>
        <Progress
          id='download-progress'
          data-state='ready'
          aria-labelledby='external-label'
          label='Internal label'
          value={25}
        />
      </>
    );

    const progressbar = screen.getByRole('progressbar');

    expect(progressbar.id).toBe('download-progress');
    expect(progressbar.getAttribute('data-state')).toBe('ready');
    expect(progressbar.getAttribute('aria-labelledby')).toBe('external-label');
    expect(progressbar.getAttribute('aria-label')).toBeNull();
  });

  it('supports the info color variant', () => {
    render(<Progress color='info' value={50} />);

    const progressbar = screen.getByRole('progressbar');
    const track = progressbar.querySelector('div');
    const indicator = track?.querySelector('div');

    expect(track).toHaveClass('bg-info-tint');
    expect(indicator).toHaveClass('bg-info-light');
  });

  it('falls back to a default aria-label when no external label is provided', () => {
    render(<Progress value={10} />);

    const progressbar = screen.getByRole('progressbar');
    expect(progressbar.getAttribute('aria-label')).toBe('Progress');
  });
});
