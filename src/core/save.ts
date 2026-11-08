/**
 * Save versionado. Regras:
 *  - Todo save tem `saveVersion`.
 *  - Ao mudar o formato: incrementar CURRENT_SAVE_VERSION e adicionar uma migração
 *    em MIGRATIONS (chave = versão de origem). Nunca editar migrações antigas.
 *  - Dados desconhecidos (de versão futura) são recusados, nunca sobrescritos.
 */

export const CURRENT_SAVE_VERSION = 1;
export const SAVE_KEY = 'rpg-cartas:save';
const EXPORT_MAGIC = 'rpg-cartas-save';

export interface SaveData {
  saveVersion: number;
  createdAt: number;
  updatedAt: number;
  /** Semente do jogo; o estado do sorteio avança aqui. */
  rngSeed: number;
  rngState: number;
  player: {
    name: string;
    gender: 'm' | 'f';
    characterLevel: number;
    characterXp: number;
    classId: string;
    classLevel: number;
    hp: number;
    mp: number;
    gold: number;
  };
  /** Maior profundidade de masmorra vencida. */
  depthRecord: number;
  /** Baú da vila: id do item -> quantidade. */
  chest: Record<string, number>;
  /** Contadores de abate por id de inimigo (bestiário). */
  kills: Record<string, number>;
  /** Missões: id -> estado. */
  quests: Record<string, 'active' | 'done'>;
}

type Migration = (old: Record<string, unknown>) => Record<string, unknown>;

/** MIGRATIONS[n] converte um save da versão n para n+1. */
export const MIGRATIONS: Record<number, Migration> = {};

export function newSave(seed: number = (Math.random() * 2 ** 32) >>> 0, now = Date.now()): SaveData {
  return {
    saveVersion: CURRENT_SAVE_VERSION,
    createdAt: now,
    updatedAt: now,
    rngSeed: seed >>> 0,
    rngState: seed >>> 0,
    player: {
      name: 'Aventureiro',
      gender: 'm',
      characterLevel: 1,
      characterXp: 0,
      classId: 'novice',
      classLevel: 1,
      hp: 20,
      mp: 10,
      gold: 0,
    },
    depthRecord: 0,
    chest: {},
    kills: {},
    quests: {},
  };
}

export class SaveError extends Error {}

/** Aplica as migrações em cadeia até a versão atual. */
export function migrate(raw: unknown, migrations: Record<number, Migration> = MIGRATIONS, target = CURRENT_SAVE_VERSION): SaveData {
  if (typeof raw !== 'object' || raw === null) throw new SaveError('Save inválido.');
  let data = raw as Record<string, unknown>;
  let version = data.saveVersion;
  if (typeof version !== 'number' || !Number.isInteger(version) || version < 1) {
    throw new SaveError('Save sem versão válida.');
  }
  if (version > target) {
    throw new SaveError(`Save de versão futura (${version}). Atualize o jogo.`);
  }
  while (version < target) {
    const step = migrations[version];
    if (!step) throw new SaveError(`Sem migração da versão ${version}.`);
    data = { ...step(data), saveVersion: version + 1 };
    version++;
  }
  return data as unknown as SaveData;
}

/** Abstração mínima de storage (permite testar sem DOM). */
export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function loadSave(store: KeyValueStore): SaveData | null {
  const text = store.getItem(SAVE_KEY);
  if (text === null) return null;
  try {
    return migrate(JSON.parse(text));
  } catch (e) {
    // Preserva o save corrompido/futuro para não perder dados.
    store.setItem(`${SAVE_KEY}:backup:${Date.now()}`, text);
    throw e instanceof SaveError ? e : new SaveError('Save corrompido.');
  }
}

export function writeSave(store: KeyValueStore, save: SaveData, now = Date.now()): SaveData {
  const out = { ...save, updatedAt: now };
  store.setItem(SAVE_KEY, JSON.stringify(out));
  return out;
}

export function deleteSave(store: KeyValueStore): void {
  store.removeItem(SAVE_KEY);
}

export function exportSave(save: SaveData): string {
  return JSON.stringify({ magic: EXPORT_MAGIC, save }, null, 2);
}

export function importSave(text: string): SaveData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new SaveError('Arquivo não é um JSON válido.');
  }
  const obj = parsed as { magic?: unknown; save?: unknown };
  if (!obj || obj.magic !== EXPORT_MAGIC) throw new SaveError('Arquivo não é um save deste jogo.');
  return migrate(obj.save);
}
