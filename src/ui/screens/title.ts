import { h, btn } from '../dom';

export function titleScreen(opts: { onNew: () => void; onImport: () => void; message: string }): HTMLElement {
  return h('div', { class: 'title-screen' },
    h('div', { class: 'title-emblem' }, '⚜'),
    h('h1', {}, 'RPG de Cartas'),
    h('p', { class: 'muted' }, 'Uma expedição de cada vez.'),
    h('div', { class: 'stack' },
      btn('Novo jogo', opts.onNew, 'primary big'),
      btn('Importar save', opts.onImport, 'big'),
    ),
    opts.message ? h('p', { class: 'msg' }, opts.message) : null,
  );
}
