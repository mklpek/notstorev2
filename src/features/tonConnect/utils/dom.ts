/**
 * HTMLElement için blur efekti uygulayan yardımcı fonksiyon
 */
export function setBlur(el: HTMLElement, color: string = 'rgba(0, 0, 0, 0.7)'): void {
  el.style.backgroundColor = color;
  el.style.backdropFilter = 'blur(8px)';

  // WebKit prefix için tip genişletme
  const css = el.style as CSSStyleDeclaration & { webkitBackdropFilter?: string };
  css.webkitBackdropFilter = 'blur(8px)';
}
