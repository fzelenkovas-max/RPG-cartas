import type { GameData } from '../../core/data';
import type { SaveData } from '../../core/save';
import { CURRENT_SAVE_VERSION } from '../../core/save';
import { EQUIPMENT_SLOTS } from '../../core/constants';
import { MENU_TABS, type MenuTab } from '../state';
import { h, btn } from '../dom';

export interface MenuActions {
  onTab: (t: MenuTab) => void;
  onClose: () => void;
  onExport: () => void;
  onImport: () => void;
  onDelete: () => void;
}

const CLASS_NAMES: Record<string, string> = { novice: 'Novato' };

function rows(pairs: [string, string | number][]): HTMLElement {
  return h('dl', { class: 'kv' }, ...pairs.flatMap(([k, v]) => [h('dt', {}, k), h('dd', {}, String(v))]));
}

function tabContent(tab: MenuTab, save: SaveData, data: GameData, a: MenuActions): HTMLElement {
  const p = save.player;
  switch (tab) {
    case 'personagem':
      return h('div', {},
        rows([
          ['Nome', p.name],
          ['Classe', CLASS_NAMES[p.classId] ?? p.classId],
          ['Nível de personagem', p.characterLevel],
          ['Nível de classe', p.classLevel],
          ['HP / MP', `${p.hp} / ${p.mp}`],
          ['Ouro', p.gold],
          ['Recorde de profundidade', save.depthRecord],
        ]),
        h('p', { class: 'placeholder' }, 'XP, atributos e fórmulas: etapa 3.'),
      );
    case 'equipamento':
      return h('div', {},
        h('div', { class: 'slot-grid' },
          ...EQUIPMENT_SLOTS.map((s) => h('div', { class: 'slot' }, h('span', { class: 'slot-name' }, s.name), h('span', { class: 'muted' }, 'vazio'))),
        ),
        h('p', { class: 'placeholder' }, 'Itens e equipar: etapa 6.'),
      );
    case 'habilidades':
      return h('p', { class: 'placeholder' }, 'Novato não ganha pontos de habilidade. Árvores de classe: etapa 10.');
    case 'skills':
      return h('div', {},
        h('ul', { class: 'list' }, ...data.skills.map((s) => h('li', {}, h('span', {}, s.name), h('span', { class: 'muted' }, 'nível 0')))),
        h('p', { class: 'placeholder' }, 'Skills sobem com o uso em combate (etapa 3).'),
      );
    case 'missoes':
      return h('ul', { class: 'list' },
        ...data.quests.map((q) => h('li', {}, h('span', {}, q.name), h('span', { class: 'muted' }, save.quests[q.id] === 'done' ? 'concluída' : save.quests[q.id] === 'active' ? 'ativa' : 'disponível'))),
      );
    case 'bestiario':
      return h('ul', { class: 'list' },
        ...data.enemies.map((e) => {
          const k = save.kills[e.id] ?? 0;
          return h('li', {}, h('span', {}, k > 0 ? e.name : '???'), h('span', { class: 'muted' }, `${k} abates`));
        }),
      );
    case 'bau': {
      const entries = Object.entries(save.chest);
      return entries.length
        ? h('ul', { class: 'list' }, ...entries.map(([id, n]) => h('li', {}, h('span', {}, data.items.find((i) => i.id === id)?.name ?? id), h('span', { class: 'muted' }, `×${n}`))))
        : h('p', { class: 'muted' }, 'O baú está vazio.');
    }
    case 'opcoes':
      return h('div', {},
        rows([['Versão do save', `${save.saveVersion} (atual ${CURRENT_SAVE_VERSION})`], ['Atualizado', new Date(save.updatedAt).toLocaleString('pt-BR')]]),
        h('div', { class: 'stack' },
          btn('Exportar save', a.onExport, 'big'),
          btn('Importar save', a.onImport, 'big'),
          btn('Apagar save', a.onDelete, 'danger big'),
        ),
      );
  }
}

export function menuPanel(tab: MenuTab, save: SaveData, data: GameData, a: MenuActions): HTMLElement {
  return h('div', { class: 'menu-overlay' },
    h('div', { class: 'menu' },
      h('div', { class: 'menu-head' },
        h('h2', {}, MENU_TABS.find((t) => t.id === tab)!.name),
        h('button', { class: 'icon-btn', onClick: a.onClose, aria: 'Fechar menu' }, '✕'),
      ),
      h('nav', { class: 'tabs', aria: 'Abas do menu' },
        ...MENU_TABS.map((t) => h('button', { class: `tab${t.id === tab ? ' active' : ''}`, onClick: () => a.onTab(t.id) }, t.name)),
      ),
      h('div', { class: 'menu-body' }, tabContent(tab, save, data, a)),
    ),
  );
}
