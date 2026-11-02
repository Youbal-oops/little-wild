export const html = String.raw;
export function svg(body, view = '0 0 160 160', className = '') {
  return html`<svg
    class="art ${className}"
    viewBox="${view}"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    ${body}
  </svg>`;
}
