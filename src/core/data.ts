/**
 * Carregamento e validação dos dados do jogo (JSON em src/data/).
 * IDs são fixos e únicos; nunca reaproveitar um id removido.
 */
import cards from '../data/cards.json';
import enemies from '../data/enemies.json';
import modifiers from '../data/modifiers.json';
import items from '../data/items.json';
import encounters from '../data/encounters.json';
import quests from '../data/quests.json';
import skills from '../data/skills.json';
import abilities from '../data/abilities.json';
import locations from '../data/locations.json';
import dungeons from '../data/dungeons.json';

export interface Entry {
  id: string;
  name: string;
  [key: string]: unknown;
}

export interface GameData {
  cards: Entry[];
  enemies: Entry[];
  modifiers: Entry[];
  items: Entry[];
  encounters: Entry[];
  quests: Entry[];
  skills: Entry[];
  abilities: Entry[];
  locations: Entry[];
  dungeons: Entry[];
}

export type DataKind = keyof GameData;

/** Valida que cada coleção é uma lista de objetos com id/nome e ids únicos (inclusive entre coleções). */
export function validateData(data: GameData): string[] {
  const errors: string[] = [];
  const seen = new Map<string, string>();
  for (const kind of Object.keys(data) as DataKind[]) {
    const list = data[kind];
    if (!Array.isArray(list)) {
      errors.push(`${kind}: não é uma lista`);
      continue;
    }
    list.forEach((e, i) => {
      if (typeof e?.id !== 'string' || e.id === '') return void errors.push(`${kind}[${i}]: id ausente`);
      if (typeof e.name !== 'string' || e.name === '') errors.push(`${kind}/${e.id}: nome ausente`);
      const prev = seen.get(e.id);
      if (prev) errors.push(`id duplicado "${e.id}" em ${prev} e ${kind}`);
      else seen.set(e.id, kind);
    });
  }
  return errors;
}

export function indexById(list: readonly Entry[]): Map<string, Entry> {
  return new Map(list.map((e) => [e.id, e]));
}

export function loadGameData(): GameData {
  const data: GameData = { cards, enemies, modifiers, items, encounters, quests, skills, abilities, locations, dungeons } as GameData;
  const errors = validateData(data);
  if (errors.length) throw new Error('Dados inválidos:\n' + errors.join('\n'));
  return data;
}
