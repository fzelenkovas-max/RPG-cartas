/** Utilitários mínimos de DOM. */
type Child = Node | string | null | undefined | false;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: { class?: string; onClick?: () => void; title?: string; disabled?: boolean; aria?: string } = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  if (props.class) n.className = props.class;
  if (props.title) n.title = props.title;
  if (props.aria) n.setAttribute('aria-label', props.aria);
  if (props.disabled && n instanceof HTMLButtonElement) n.disabled = true;
  if (props.onClick) n.addEventListener('click', props.onClick);
  for (const c of children) if (c !== null && c !== undefined && c !== false) n.append(c);
  return n;
}

export function btn(label: string, onClick: () => void, cls = ''): HTMLButtonElement {
  return h('button', { class: cls, onClick }, label);
}

/** Barra de recurso (HP/MP/Energia). */
export function bar(label: string, value: number, max: number, cls: string): HTMLElement {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  const fill = h('div', { class: 'bar-fill' });
  fill.style.width = `${pct}%`;
  return h('div', { class: `bar ${cls}`, aria: `${label} ${value} de ${max}` },
    fill,
    h('span', { class: 'bar-text' }, `${label} ${value}/${max}`),
  );
}
