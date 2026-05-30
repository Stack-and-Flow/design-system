const UNSAFE_URL_PATTERN = /^(javascript|data):/i;
const UNSAFE_ELEMENTS = new Set(['embed', 'iframe', 'object']);
const UNSAFE_ATTRIBUTES = new Set(['srcdoc']);
const URL_ATTRIBUTES = new Set(['action', 'formaction', 'href', 'poster', 'src', 'xlink:href']);
const INLINE_ALLOWED_ELEMENTS = new Set(['span', 'strong', 'b', 'em', 'i', 'u', 'br']);
const INLINE_REMOVED_ELEMENTS = new Set(['embed', 'iframe', 'object', 'script', 'style', 'svg']);

export type SanitizeHtmlProfile = 'default' | 'inline';

export type SanitizeHtmlOptions = {
  profile?: SanitizeHtmlProfile;
};

const removeControlAndWhitespace = (value: string) =>
  [...value]
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code > 0x20 && code !== 0x7f;
    })
    .join('');

const unwrapElement = (element: Element) => {
  const parent = element.parentNode;

  if (!parent) {
    return;
  }

  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }

  parent.removeChild(element);
};

const sanitizeDefaultHtml = (document: Document) => {
  document.querySelectorAll('script').forEach((script) => script.remove());

  document.querySelectorAll('*').forEach((element) => {
    if (UNSAFE_ELEMENTS.has(element.tagName.toLowerCase())) {
      element.remove();
      return;
    }

    [...element.attributes].forEach((attribute) => {
      const attributeName = attribute.name.toLowerCase();
      const normalizedAttributeValue = removeControlAndWhitespace(attribute.value);

      if (attributeName.startsWith('on') || UNSAFE_ATTRIBUTES.has(attributeName)) {
        element.removeAttribute(attribute.name);
        return;
      }

      if (URL_ATTRIBUTES.has(attributeName) && UNSAFE_URL_PATTERN.test(normalizedAttributeValue)) {
        element.removeAttribute(attribute.name);
      }
    });
  });
};

const sanitizeInlineOnlyHtml = (document: Document) => {
  const elements = [...document.body.querySelectorAll('*')].reverse();

  elements.forEach((element) => {
    const tagName = element.tagName.toLowerCase();

    if (INLINE_REMOVED_ELEMENTS.has(tagName)) {
      element.remove();
      return;
    }

    if (!INLINE_ALLOWED_ELEMENTS.has(tagName)) {
      unwrapElement(element);
      return;
    }

    [...element.attributes].forEach((attribute) => {
      element.removeAttribute(attribute.name);
    });
  });
};

export function sanitizeHtml(html: string, options: SanitizeHtmlOptions = {}): string {
  const document = new DOMParser().parseFromString(html, 'text/html');

  if (options.profile === 'inline') {
    sanitizeInlineOnlyHtml(document);
  } else {
    sanitizeDefaultHtml(document);
  }

  return document.body.innerHTML;
}

export function sanitizeInlineHtml(html: string): string {
  return sanitizeHtml(html, { profile: 'inline' });
}

export function getSanitizedTextContent(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
