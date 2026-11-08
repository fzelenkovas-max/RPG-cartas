import type { Entry } from '../../core/data';
import { h, btn, bar } from '../dom';

export type CombatAction = 'atacar' | 'habilidade' | 'defender' | 'pocao' | 'fugir';

export function combatScreen(enemy: Entry, onAction: (a: CombatAction) => void): HTMLElement {
  const hp = Number(enemy.hp ?? 10);
  return h('div', { class: 'screen-body combat' },
    h('div', { class: 'enemy' },
      h('div', { class: 'enemy-art', aria: 'Ilustração do inimigo' }, '👹'),
      h('h2', { class: 'enemy-name' }, enemy.name),
      bar('HP', hp, hp, 'hp'),
    ),
    h('div', { class: 'dice-area' }, h('span', { class: 'die' }, '⚀'), h('span', { class: 'muted' }, 'Sua vez')),
    h('div', { class: 'combat-actions' },
      btn('Atacar', () => onAction('atacar'), 'primary big'),
      btn('Habilidade', () => onAction('habilidade'), 'big'),
      btn('Defender', () => onAction('defender'), 'big'),
      btn('Poção', () => onAction('pocao'), 'big'),
      btn('Fugir', () => onAction('fugir'), 'danger big wide'),
    ),
  );
}
