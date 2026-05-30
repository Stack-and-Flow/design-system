import { describe, expect, it } from 'vitest';
import { getSanitizedTextContent, sanitizeHtml, sanitizeInlineHtml } from './sanitizeHtml';

describe('sanitizeHtml', () => {
  it('preserves current general sanitization behavior for rich text', () => {
    expect(
      sanitizeHtml(
        [
          '<strong onclick="alert(1)">Safe</strong>',
          '<script>alert(1)</script>',
          '<a href="javascript:alert(1)">link</a>',
          '<form action="javascript:alert(1)"></form>',
          '<button formaction="javascript:alert(1)">submit</button>',
          '<img src="d&#x61;ta:text/html,foo">',
          '<object data="javascript:alert(1)"></object>'
        ].join('')
      )
    ).toBe('<strong>Safe</strong><a>link</a><form></form><button>submit</button><img>');
  });
});

describe('sanitizeInlineHtml', () => {
  it('keeps only strict inline non-interactive markup for checkbox labels', () => {
    expect(
      sanitizeInlineHtml(
        [
          '<strong onclick="alert(1)">Safe</strong>',
          '<a href="https://example.com">link</a>',
          '<button type="button">button</button>',
          '<img src="/image.png" alt="preview">',
          '<span class="label" tabindex="0">focus</span>',
          '<div>block</div>',
          '<script>alert(1)</script>'
        ].join(' ')
      )
    ).toBe('<strong>Safe</strong> link button  <span>focus</span> block ');
  });

  it('extracts normalized text content from sanitized markup', () => {
    expect(getSanitizedTextContent('<strong>Safe</strong><br><span>content</span>')).toBe('Safe content');
  });
});
