const UNSAFE_URL_PATTERN = /^\s*(javascript|data):/i;
const URL_ATTRIBUTES = new Set(['href', 'src', 'xlink:href']);

export function sanitizeHtml(html: string): string {
  const document = new DOMParser().parseFromString(html, 'text/html');

  document.querySelectorAll('script').forEach((script) => script.remove());

  document.querySelectorAll('*').forEach((element) => {
    [...element.attributes].forEach((attribute) => {
      const attributeName = attribute.name.toLowerCase();
      const attributeValue = attribute.value;

      if (attributeName.startsWith('on')) {
        element.removeAttribute(attribute.name);
        return;
      }

      if (URL_ATTRIBUTES.has(attributeName) && UNSAFE_URL_PATTERN.test(attributeValue)) {
        element.removeAttribute(attribute.name);
      }
    });
  });

  return document.body.innerHTML;
}
