import type { GameData, Entry } from '../core/data';
import type { SaveData } from '../core/save';
import { Rng } from '../core/rng';

export type Screen = 'title' | 'village' | 'location' | 'dungeon-select' | 'dungeon' | 'combat';
export type MenuTab = 'personagem' | 'equipamento' | 'habilidades' | 'skills' | 'missoes' | 'bestiario' | 'bau' | 'opcoes';

export const MENU_TABS: { id: MenuTab; name: string }[] = [
  { id: 'personagem', name: 'Personagem' },
  { id: 'equipamento', name: 'Equipamento' },
  { id: 'habilidades', name: 'Habilidades' },
  { id: 'skills', name: 'Skills' },
  { id: 'missoes', name: 'Missões' },
  { id: 'bestiario', name: 'Bestiário' },
  { id: 'bau', name: 'Baú' },
  { id: 'opcoes', name: 'Opções' },
];

/**
 * Prévia de partida, só para a interface da etapa 2.
 * O motor real da masmorra (etapa 4) e o combate (etapa 5) substituem isto.
 */
export interface PreviewRun {
  dungeon: Entry;
  phase: number;
  energy: number;
  maxEnergy: number;
  clues: Record<string, { have: number; need: number }>;
  cards: [Entry, Entry];
  revealed: boolean;
  enemy: Entry | null;
}

export interface AppState {
  data: GameData;
  save: SaveData | null;
  screen: Screen;
  locationId: string | null;
  menuOpen: boolean;
  tab: MenuTab;
  run: PreviewRun | null;
  log: string[];
  message: string;
  rng: Rng;
}

export function drawPreviewCards(data: GameData, rng: Rng): [Entry, Entry] {
  return [rng.pick(data.cards), rng.pick(data.cards)];
}

export function newPreviewRun(data: GameData, dungeon: Entry, rng: Rng): PreviewRun {
  return {
    dungeon,
    phase: 1,
    energy: 20,
    maxEnergy: 20,
    clues: { key: { have: 0, need: 2 }, eye: { have: 0, need: 1 } },
    cards: drawPreviewCards(data, rng),
    revealed: false,
    enemy: null,
  };
}
