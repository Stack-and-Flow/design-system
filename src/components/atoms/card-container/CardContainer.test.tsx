import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CardContainer } from './CardContainer';
import { useCardContainer } from './useCardContainer';

describe('useCardContainer — logic', () => {
  it('passes native div props through the hook result', () => {
    const handleClick = vi.fn();

    const { result } = renderHook(() =>
      useCardContainer({
        children: 'Card content',
        id: 'card-container',
        role: 'article',
        onClick: handleClick,
        'aria-labelledby': 'card-title'
      })
    );

    expect(result.current.children).toBe('Card content');
    expect(result.current.cardContainerProps.id).toBe('card-container');
    expect(result.current.cardContainerProps.role).toBe('article');
    expect(result.current.cardContainerProps.onClick).toBe(handleClick);
    expect(result.current.cardContainerProps['aria-labelledby']).toBe('card-title');
  });

  it('keeps the consumer className while generating component classes', () => {
    const { result } = renderHook(() => useCardContainer({ children: 'Card content', className: 'custom-card' }));

    expect(result.current.className).toContain('custom-card');
    expect(result.current.className).not.toBe('custom-card');
  });
});

describe('CardContainer — component behavior', () => {
  it('renders children', () => {
    render(<CardContainer>Card content</CardContainer>);

    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders a div by default', () => {
    render(<CardContainer data-testid='card-container'>Card content</CardContainer>);

    expect(screen.getByTestId('card-container').tagName).toBe('DIV');
  });

  it('passes through native id, role, aria-* and data-* props', () => {
    render(
      <CardContainer id='billing-card' role='article' aria-labelledby='billing-card-title' data-testid='billing-card'>
        <h3 id='billing-card-title'>Billing</h3>
      </CardContainer>
    );

    const card = screen.getByTestId('billing-card');
    expect(card).toHaveAttribute('id', 'billing-card');
    expect(card).toHaveAttribute('role', 'article');
    expect(card).toHaveAttribute('aria-labelledby', 'billing-card-title');
    expect(card).toHaveAttribute('data-testid', 'billing-card');
  });

  it('passes through native event handlers without adding interactive semantics', () => {
    const handleClick = vi.fn();
    render(
      <CardContainer data-testid='card-container' onClick={handleClick}>
        Card content
      </CardContainer>
    );

    const card = screen.getByTestId('card-container');
    fireEvent.click(card);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(card).not.toHaveAttribute('role');
    expect(card).not.toHaveAttribute('aria-pressed');
  });

  it.each(['surface', 'raised', 'outlined', 'tinted'] as const)('supports the %s variant', (variant) => {
    render(
      <CardContainer data-testid={`card-${variant}`} variant={variant}>
        {variant}
      </CardContainer>
    );

    expect(screen.getByTestId(`card-${variant}`)).toBeInTheDocument();
  });

  it.each(['none', 'sm', 'md', 'lg'] as const)('supports the %s backdropBlur level', (backdropBlur) => {
    render(
      <CardContainer data-testid={`card-backdrop-blur-${backdropBlur}`} backdropBlur={backdropBlur}>
        {backdropBlur}
      </CardContainer>
    );

    expect(screen.getByTestId(`card-backdrop-blur-${backdropBlur}`)).toBeInTheDocument();
  });

  it.each([
    ['sm', '--blur-card-sm'],
    ['md', '--blur-card-md'],
    ['lg', '--blur-card-lg']
  ] as const)('maps backdropBlur=%s to the expected glass tokens', (backdropBlur, blurToken) => {
    render(
      <CardContainer data-testid='card-container' backdropBlur={backdropBlur}>
        {backdropBlur}
      </CardContainer>
    );

    const card = screen.getByTestId('card-container');
    expect(card.className).toContain('!bg-card-backdrop-light');
    expect(card.className).toContain('dark:!bg-card-backdrop-dark');
    expect(card.className).toContain(`[backdrop-filter:var(${blurToken})]`);
    expect(card.className).toContain(`[-webkit-backdrop-filter:var(${blurToken})]`);
  });

  it('keeps backdropBlur=none free of glass classes', () => {
    render(
      <CardContainer data-testid='card-container' backdropBlur='none'>
        none
      </CardContainer>
    );

    expect(screen.getByTestId('card-container').className).not.toContain('blur-card');
  });

  it('accepts className without dropping generated component classes', () => {
    render(
      <CardContainer data-testid='card-container' className='custom-card'>
        Card content
      </CardContainer>
    );

    const card = screen.getByTestId('card-container');
    expect(card.className).toContain('custom-card');
    expect(card.className).not.toBe('custom-card');
  });

  it('is not focusable by default', () => {
    render(<CardContainer data-testid='card-container'>Card content</CardContainer>);

    expect(screen.getByTestId('card-container')).not.toHaveAttribute('tabindex');
  });

  it('does not add interactive ARIA or roles by default', () => {
    render(<CardContainer data-testid='card-container'>Card content</CardContainer>);

    const card = screen.getByTestId('card-container');
    expect(card).not.toHaveAttribute('role');
    expect(card).not.toHaveAttribute('aria-disabled');
    expect(card).not.toHaveAttribute('aria-expanded');
    expect(card).not.toHaveAttribute('aria-pressed');
    expect(card).not.toHaveAttribute('aria-selected');
  });

  it('preserves semantic content passed as children', () => {
    render(
      <CardContainer>
        <h3>Usage summary</h3>
        <button type='button'>Manage</button>
      </CardContainer>
    );

    expect(screen.getByRole('heading', { name: 'Usage summary' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Manage' })).toBeInTheDocument();
  });
});
