import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Slider as RootSlider } from '../../../index';
import { Slider } from './Slider';
import { useSlider } from './useSlider';

class ResizeObserverMock implements ResizeObserver {
  observe = () => undefined;
  unobserve = () => undefined;
  disconnect = () => undefined;
}
globalThis.ResizeObserver = ResizeObserverMock;

describe('useSlider — logic', () => {
  it('resolves omitted and controlled values for single-value mode', () => {
    expect(renderHook(() => useSlider({ ariaLabel: 'Volume' })).result.current.rootProps.defaultValue).toEqual([0]);
    expect(
      renderHook(() => useSlider({ ariaLabel: 'Volume', min: 20, max: 80 })).result.current.rootProps.defaultValue
    ).toEqual([20]);
    const controlled = renderHook(() => useSlider({ ariaLabel: 'Volume', value: [40] })).result.current.rootProps;
    expect(controlled.value).toEqual([40]);
    expect(controlled.defaultValue).toBeUndefined();
  });

  it('returns one thumb and maps accessible names for single-value usage', () => {
    expect(renderHook(() => useSlider({ ariaLabel: 'Volume', defaultValue: [25] })).result.current.thumbs).toHaveLength(
      1
    );
    expect(renderHook(() => useSlider({ ariaLabel: 'Volume' })).result.current.thumbs[0]).toMatchObject({
      'aria-label': 'Volume'
    });
    expect(renderHook(() => useSlider({ 'aria-label': 'Volume level' })).result.current.thumbs[0]).toMatchObject({
      'aria-label': 'Volume level'
    });
    const labelled = renderHook(() => useSlider({ ariaLabel: 'Ignored', 'aria-labelledby': 'volume-label' })).result
      .current.thumbs[0];
    expect(labelled?.['aria-labelledby']).toBe('volume-label');
    expect(labelled?.['aria-label']).toBeUndefined();
  });

  it('falls back to a safe single-thumb accessible name when labels are omitted', () => {
    expect(renderHook(() => useSlider({ defaultValue: [25] })).result.current.thumbs[0]).toMatchObject({
      'aria-label': 'Slider value'
    });
  });

  it('resolves explicit range values and truncates unsupported extra thumbs', () => {
    const defaultRange = renderHook(() =>
      useSlider({ defaultValue: [25, 75], thumbLabels: ['Minimum price', 'Maximum price'] })
    ).result.current;
    expect(defaultRange.rootProps.defaultValue).toEqual([25, 75]);
    expect(defaultRange.thumbs).toHaveLength(2);

    const controlledRange = renderHook(() =>
      useSlider({ value: [10, 90], thumbLabels: ['Minimum value', 'Maximum value'] })
    ).result.current;
    expect(controlledRange.rootProps.value).toEqual([10, 90]);
    expect(controlledRange.rootProps.defaultValue).toBeUndefined();
    expect(controlledRange.thumbs).toHaveLength(2);

    const truncated = renderHook(() => useSlider({ value: [10, 50, 90], thumbLabels: ['Lower bound', 'Upper bound'] }))
      .result.current;
    expect(truncated.rootProps.value).toEqual([10, 50]);
    expect(truncated.thumbs).toHaveLength(2);
  });

  it('maps range thumb labels and range fallback labels to distinguishable thumbs', () => {
    const labelled = renderHook(() =>
      useSlider({ defaultValue: [25, 75], thumbLabels: ['Minimum price', 'Maximum price'] })
    ).result.current.thumbs;
    expect(labelled[0]).toMatchObject({ 'aria-label': 'Minimum price' });
    expect(labelled[1]).toMatchObject({ 'aria-label': 'Maximum price' });

    const fallback = renderHook(() => useSlider({ defaultValue: [25, 75] })).result.current.thumbs;
    expect(fallback[0]).toMatchObject({ 'aria-label': 'Minimum value' });
    expect(fallback[1]).toMatchObject({ 'aria-label': 'Maximum value' });
  });

  it('normalizes invalid numeric domain props without inferring range from min and max', () => {
    const invalidDomain = renderHook(() =>
      useSlider({ defaultValue: [Number.NaN], min: Number.NaN, max: Number.NEGATIVE_INFINITY, step: 0 })
    ).result.current.rootProps;
    expect(invalidDomain.min).toBe(0);
    expect(invalidDomain.max).toBe(100);
    expect(invalidDomain.step).toBe(1);
    expect(invalidDomain.defaultValue).toEqual([0]);

    const boundedSingle = renderHook(() => useSlider({ min: 20, max: 80 })).result.current;
    expect(boundedSingle.rootProps.defaultValue).toEqual([20]);
    expect(boundedSingle.thumbs).toHaveLength(1);
  });

  it('clamps controlled and default values to the resolved numeric domain', () => {
    const controlled = renderHook(() => useSlider({ ariaLabel: 'Volume', min: 20, max: 80, value: [10, 120] })).result
      .current.rootProps;
    expect(controlled.value).toEqual([20, 80]);

    const uncontrolled = renderHook(() => useSlider({ ariaLabel: 'Volume', min: 20, max: 80, defaultValue: [10, 120] }))
      .result.current.rootProps;
    expect(uncontrolled.defaultValue).toEqual([20, 80]);
  });

  it('sorts two-thumb values so range labels match minimum and maximum semantics', () => {
    const controlled = renderHook(() => useSlider({ ariaLabel: 'Price', value: [80, 20] })).result.current.rootProps;
    expect(controlled.value).toEqual([20, 80]);

    const uncontrolled = renderHook(() => useSlider({ ariaLabel: 'Price', defaultValue: [80, 20] })).result.current
      .rootProps;
    expect(uncontrolled.defaultValue).toEqual([20, 80]);
  });
});

describe('Slider — component behavior', () => {
  it('renders one named slider thumb with value semantics', () => {
    render(<Slider ariaLabel='Volume' min={20} max={80} defaultValue={[40]} />);
    const slider = screen.getByRole('slider', { name: 'Volume' });
    expect(screen.getAllByRole('slider')).toHaveLength(1);
    expect(slider).toHaveAttribute('aria-valuemin', '20');
    expect(slider).toHaveAttribute('aria-valuemax', '80');
    expect(slider).toHaveAttribute('aria-valuenow', '40');
  });

  it('reports controlled single-value changes from Radix keyboard behavior where practical', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const ControlledSlider = () => {
      const [value, setValue] = useState([40]);
      return (
        <Slider
          ariaLabel='Volume'
          value={value}
          step={5}
          onValueChange={(next: number[]) => {
            handleChange(next);
            setValue(next);
          }}
        />
      );
    };
    render(<ControlledSlider />);
    screen.getByRole('slider', { name: 'Volume' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(handleChange).toHaveBeenCalledWith([45]);
    expect(screen.getByRole('slider', { name: 'Volume' })).toHaveAttribute('aria-valuenow', '45');
  });

  it('keeps Home and End keyboard behavior delegated to Radix bounds handling', async () => {
    const user = userEvent.setup();
    const ControlledSlider = () => {
      const [value, setValue] = useState([40]);
      return <Slider ariaLabel='Volume' min={20} max={80} value={value} onValueChange={setValue} />;
    };
    render(<ControlledSlider />);
    const slider = screen.getByRole('slider', { name: 'Volume' });

    slider.focus();
    await user.keyboard('{End}');
    expect(slider).toHaveAttribute('aria-valuenow', '80');

    await user.keyboard('{Home}');
    expect(slider).toHaveAttribute('aria-valuenow', '20');
  });

  it('renders two named thumbs for explicit range mode', () => {
    render(<Slider defaultValue={[25, 75]} thumbLabels={['Minimum price', 'Maximum price']} />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
    expect(screen.getByRole('slider', { name: 'Minimum price' })).toHaveAttribute('aria-valuenow', '25');
    expect(screen.getByRole('slider', { name: 'Maximum price' })).toHaveAttribute('aria-valuenow', '75');
  });

  it('combines external field context with distinguishable thumb names in range mode', () => {
    render(
      <>
        <span id='price-range-label'>Price range</span>
        <Slider
          aria-labelledby='price-range-label'
          defaultValue={[25, 75]}
          thumbLabels={['Minimum price', 'Maximum price']}
        />
      </>
    );

    const minimum = screen.getByRole('slider', { name: 'Price range Minimum price' });
    const maximum = screen.getByRole('slider', { name: 'Price range Maximum price' });

    expect(minimum).toHaveAttribute('aria-valuenow', '25');
    expect(maximum).toHaveAttribute('aria-valuenow', '75');
    expect(minimum).toHaveAccessibleName('Price range Minimum price');
    expect(maximum).toHaveAccessibleName('Price range Maximum price');
  });

  it('renders distinguishable fallback names for range mode without thumbLabels', () => {
    render(<Slider defaultValue={[25, 75]} />);
    expect(screen.getByRole('slider', { name: 'Minimum value' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Maximum value' })).toBeInTheDocument();
  });

  it('does not call onValueChange from keyboard interaction when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Slider ariaLabel='Volume' disabled={true} defaultValue={[40]} onValueChange={handleChange} />);
    const slider = screen.getByRole('slider', { name: 'Volume' });
    slider.focus();
    await user.keyboard('{ArrowRight}');
    expect(slider).toHaveAttribute('aria-disabled', 'true');
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('does not call onValueChange from keyboard interaction when range mode is disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Slider
        defaultValue={[25, 75]}
        disabled={true}
        thumbLabels={['Minimum price', 'Maximum price']}
        onValueChange={handleChange}
      />
    );
    const lower = screen.getByRole('slider', { name: 'Minimum price' });
    lower.focus();
    await user.keyboard('{ArrowRight}');
    expect(lower).toHaveAttribute('aria-disabled', 'true');
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('passes through onValueCommit, name, and safe native props through Radix root props', () => {
    const handleCommit = vi.fn();
    const { result } = renderHook(() =>
      useSlider({ ariaLabel: 'Volume', id: 'volume-slider', name: 'volume', onValueCommit: handleCommit })
    );
    expect(result.current.rootProps.onValueCommit).toBe(handleCommit);
    expect(result.current.rootProps.id).toBe('volume-slider');
    expect(result.current.rootProps.name).toBe('volume');
  });

  it('maps aria-describedby to the rendered thumb for external field descriptions', () => {
    render(<Slider ariaLabel='Storage' aria-describedby='storage-description' defaultValue={[60]} />);
    expect(screen.getByRole('slider', { name: 'Storage' })).toHaveAttribute('aria-describedby', 'storage-description');
  });

  it('resolves Slider from the root public export', () => {
    expect(RootSlider).toBe(Slider);
  });
});
