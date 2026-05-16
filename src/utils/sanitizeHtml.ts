const UNSAFE_URL_PATTERN = /^(javascript|data):/i;
const UNSAFE_ELEMENTS = new Set(['embed', 'iframe', 'object']);
const UNSAFE_ATTRIBUTES = new Set(['srcdoc']);
const URL_ATTRIBUTES = new Set(['href', 'src', 'xlink:href']);

const removeControlAndWhitespace = (value: string) =>
  [...value]
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code > 0x20 && code !== 0x7f;
    })
    .join('');

export function sanitizeHtml(html: string): string {
  const document = new DOMParser().parseFromString(html, 'text/html');

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

  return document.body.innerHTML;
}
