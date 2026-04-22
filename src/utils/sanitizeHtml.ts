export function sanitizeHtml(html: string): string {
  const template = document.createElement('template');
  template.innerHTML = html;

  const scripts = template.content.querySelectorAll('script');
  scripts.forEach((script) => script.remove());

  const elements = template.content.querySelectorAll('*');
  elements.forEach((el) => {
    [...el.attributes].forEach((attr) => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return template.innerHTML;
}
