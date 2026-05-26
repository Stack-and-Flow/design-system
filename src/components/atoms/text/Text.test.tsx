import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Text } from './Text';
import { useText } from './useText';

describe('useText', () => {
  it('defaults to a paragraph tag and secondary font', () => {
    const { result } = renderHook(() => useText({ children: 'Default text' }));

    expect(result.current.tag).toBe('p');
    expect(result.current.className).toContain('font-primary');
    expect(result.current.className).toContain('fs-base');
  });

  it('sanitizes html content before rendering', () => {
    const { result } = renderHook(() =>
      useText({
        isHtml: true,
        children: [
          '<strong onclick="alert(1)">Safe</strong>',
          '<script>alert(1)</script>',
          '<a href="javascript:alert(1)">link</a>',
          '<a href="jav&#x61;script:alert(1)">encoded</a>',
          '<a href="jav&#x09;ascript:alert(1)">control</a>',
          '<form action="jav&#x09;ascript:alert(1)"></form>',
          '<button formaction="javascript:alert(1)">submit</button>',
          '<img src="d&#x61;ta:text/html,foo">',
          '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
          '<object data="javascript:alert(1)"></object>',
          '<script>alert(1)'
        ].join('')
      })
    );

    expect(result.current.sanitizedHtml).toBe(
      '<strong>Safe</strong><a>link</a><a>encoded</a><a>control</a><form></form><button>submit</button><img>'
    );
  });
});

describe('Text', () => {
  it('renders as a paragraph by default', () => {
    render(<Text>Body copy</Text>);

    expect(screen.getByText('Body copy').tagName).toBe('P');
  });

  it('renders the requested semantic tag', () => {
    render(<Text tag='small'>Caption</Text>);

    expect(screen.getByText('Caption').tagName).toBe('SMALL');
  });

  it('applies screen-reader-only styling when srOnly is true', () => {
    render(
      <Text tag='span' srOnly={true}>
        Assistive copy
      </Text>
    );

    expect(screen.getByText('Assistive copy')).toHaveClass('sr-only');
  });

  it('maps ariaLive to the aria-live attribute', () => {
    render(
      <Text role='status' ariaLive='polite'>
        Saved
      </Text>
    );

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveTextContent('Saved');
  });

  it('renders sanitized HTML content', () => {
    render(
      <Text isHtml={true}>{'<strong onclick="alert(1)">Safe</strong><a href="javascript:alert(1)">link</a>'}</Text>
    );

    const strong = screen.getByText('Safe');
    const link = screen.getByText('link');

    expect(strong.tagName).toBe('STRONG');
    expect(strong).not.toHaveAttribute('onclick');
    expect(link.tagName).toBe('A');
    expect(link).not.toHaveAttribute('href');
  });
});
