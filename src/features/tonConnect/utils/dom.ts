/******************************************************************************
 * File: dom.ts
 * Layer: feature
 * Desc: DOM utility functions for applying blur effects to HTML elements
 ******************************************************************************/

/**
 * Helper function that applies blur effect to HTMLElement
 * Sets background color and backdrop filter with WebKit prefix support
 * @param el - HTML element to apply blur effect to
 * @param color - Background color for the blur effect (default: semi-transparent black)
 */
export function setBlur(el: HTMLElement, color: string = 'rgba(0, 0, 0, 0.7)'): void {
  el.style.backgroundColor = color;
  el.style.backdropFilter = 'blur(8px)';

  // Type extension for WebKit prefix
  const css = el.style as CSSStyleDeclaration & { webkitBackdropFilter?: string };
  css.webkitBackdropFilter = 'blur(8px)';
}
