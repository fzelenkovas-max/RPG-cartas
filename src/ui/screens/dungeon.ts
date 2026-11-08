import type { Entry } from '../../core/data';
import { CLUE_TYPES } from '../../core/constants';
import type { PreviewRun } from '../state';
import { h, btn, bar } from '../dom';

const KIND_LABEL: Record<string, string> = {
  combat: 'Combate', treasure: 'Tesouro', encounter: 'Encontro', trap: 'Armadilha',
  camp: 'Acampamento', merchant: 'Mercador', shrine: 'Santuário', quest_event: 'Missão',
};
const KIND_ICON: Record<string, string> = {
  combat: '⚔', treasure: '💰', encounter: '❓', trap: '⚠', camp: '🔥', merchant: '⚖', shrine: '✟', quest_event: '📜',
};

export function cardView(card: Entry | null, opts: { faceDown?: boolean; label?: string; risky?: boolean } = {}): HTMLElement {
  if (opts.faceDown || !card) {
    return h('div', { class: `card back${opts.risky ? ' risky' : ''}` },
      h('span', { class: 'card-back-mark' }, '?'),
      opts.label ? h('span', { class: 'card-label' }, opts.label) : null,
    );
  }
  const kind = String(card.kind ?? '');
  return h('div', { class: `card kind-${kind}` },
    h('span', { class: 'card-kind' }, KIND_LABEL[kind] ?? kind),
    h('span', { class: 'card-icon' }, KIND_ICON[kind] ?? '•'),
    h('span', { class: 'card-name' }, card.name),
    opts.label ? h('span', { class: 'card-label' }, opts.label) : null,
  );
}

export function dungeonScreen(run: PreviewRun, actions: { onResolve: () => void; onRisk: () => void; onLeave: () => void }): HTMLElement {
  const clues = h('div', { class: 'clues', aria: 'Pistas da fase' },
    ...CLUE_TYPES.filter((c) => run.clues[c.id]).map((c) => {
      const v = run.clues[c.id];
      return h('span', { class: 'clue', title: c.name }, `${c.symbol} ${v.have}/${v.need}`);
    }),
  );
  return h('div', { class: 'screen-body dungeon' },
    h('div', { class: 'dungeon-head' },
      h('h2', { class: 'screen-title' }, `${run.dungeon.name} · Fase ${run.phase}/3`),
      bar('Energia', run.energy, run.maxEnergy, 'energy'),
      clues,
    ),
    h('div', { class: 'two-doors' },
      cardView(run.cards[0], { label: 'Porta 1 · segura' }),
      cardView(run.cards[1], { faceDown: true, risky: true, label: 'Porta 2 · ×1,5' }),
    ),
    h('div', { class: 'actions' },
      btn('Resolver porta 1', actions.onResolve, 'primary big'),
      btn('Arriscar porta 2', actions.onRisk, 'danger big'),
      btn('Sair da masmorra', actions.onLeave, 'small'),
    ),
  );
}
