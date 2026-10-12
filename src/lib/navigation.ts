export function pageLink(href: string, pathname = window.location.pathname): string {
  if (href === '#contact') return href; // One shared modal on either page.
  if (href.startsWith('#') && pathname !== '/') return `/${href}`;
  return href;
}
