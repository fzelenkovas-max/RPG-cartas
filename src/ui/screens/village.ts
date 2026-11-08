import type { Entry } from '../../core/data';
import { h, btn } from '../dom';

const ICONS: Record<string, string> = {
  loc_gate: '⛩', loc_elder: '📜', loc_smith: '⚒', loc_armorer: '🛡', loc_alchemist: '⚗',
  loc_merchant: '⚖', loc_chest: '🧰', loc_class_master: '⚔', loc_quest_board: '📌',
};

export function villageScreen(locations: Entry[], onPick: (id: string) => void): HTMLElement {
  return h('div', { class: 'screen-body' },
    h('h2', { class: 'screen-title' }, 'Vila'),
    h('div', { class: 'loc-grid' },
      ...locations.map((l) =>
        h('button', { class: `loc-card${l.id === 'loc_gate' ? ' loc-gate' : ''}`, onClick: () => onPick(l.id) },
          h('span', { class: 'loc-icon' }, ICONS[l.id] ?? '•'),
          h('span', { class: 'loc-name' }, l.name),
          h('span', { class: 'loc-desc' }, String(l.desc ?? '')),
        ),
      ),
    ),
  );
}

export function locationScreen(loc: Entry, onBack: () => void): HTMLElement {
  return h('div', { class: 'screen-body' },
    h('h2', { class: 'screen-title' }, loc.name),
    loc.npc ? h('p', { class: 'npc' }, `${loc.npc}: "Volte quando estiver pronto."`) : null,
    h('p', { class: 'muted' }, String(loc.desc ?? '')),
    h('p', { class: 'placeholder' }, 'Em construção (etapa 7).'),
    h('div', { class: 'actions' }, btn('Voltar à vila', onBack, 'big')),
  );
}

export function dungeonSelectScreen(dungeons: Entry[], onPick: (d: Entry) => void, onBack: () => void): HTMLElement {
  return h('div', { class: 'screen-body' },
    h('h2', { class: 'screen-title' }, 'Portão da masmorra'),
    h('div', { class: 'stack' },
      ...dungeons.map((d) =>
        h('button', { class: 'dungeon-card', onClick: () => onPick(d) },
          h('span', { class: 'loc-name' }, d.name),
          h('span', { class: 'loc-desc' }, String(d.desc ?? '')),
          d.tutorial ? h('span', { class: 'tag' }, 'Tutorial') : null,
        ),
      ),
    ),
    h('div', { class: 'actions' }, btn('Voltar à vila', onBack, 'big')),
  );
}
