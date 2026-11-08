import { describe, expect, it } from 'vitest';
import {
  CURRENT_SAVE_VERSION, SAVE_KEY, SaveError, exportSave, importSave, loadSave, migrate, newSave, writeSave,
  type KeyValueStore,
} from '../src/core/save';

function memStore(): KeyValueStore & { map: Map<string, string> } {
  const map = new Map<string, string>();
  return {
    map,
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
}

describe('save', () => {
  it('novo save usa HP/MP iniciais 20/10 e versão atual', () => {
    const s = newSave(1, 0);
    expect(s.saveVersion).toBe(CURRENT_SAVE_VERSION);
    expect(s.player.hp).toBe(20);
    expect(s.player.mp).toBe(10);
  });
  it('grava e carrega', () => {
    const st = memStore();
    const saved = writeSave(st, newSave(1, 0), 50);
    expect(loadSave(st)).toEqual(saved);
    expect(saved.updatedAt).toBe(50);
  });
  it('sem save retorna null', () => {
    expect(loadSave(memStore())).toBeNull();
  });
  it('exporta e importa', () => {
    const s = newSave(3, 0);
    expect(importSave(exportSave(s))).toEqual(s);
  });
  it('recusa importação inválida', () => {
    expect(() => importSave('não é json')).toThrow(SaveError);
    expect(() => importSave('{"x":1}')).toThrow(SaveError);
  });
  it('recusa save de versão futura e guarda backup', () => {
    const st = memStore();
    st.setItem(SAVE_KEY, JSON.stringify({ saveVersion: CURRENT_SAVE_VERSION + 1 }));
    expect(() => loadSave(st)).toThrow(SaveError);
    expect([...st.map.keys()].some((k) => k.includes('backup'))).toBe(true);
    expect(st.getItem(SAVE_KEY)).not.toBeNull();
  });
  it('recusa save sem versão', () => {
    expect(() => migrate({})).toThrow(SaveError);
  });
  it('aplica migrações em cadeia sem perder dados', () => {
    const migrations = {
      1: (o: Record<string, unknown>) => ({ ...o, extra: 'a' }),
      2: (o: Record<string, unknown>) => ({ ...o, extra: `${o.extra}b` }),
    };
    const out = migrate({ saveVersion: 1, keep: 42 }, migrations, 3) as unknown as Record<string, unknown>;
    expect(out).toMatchObject({ saveVersion: 3, keep: 42, extra: 'ab' });
  });
  it('falha se faltar uma migração', () => {
    expect(() => migrate({ saveVersion: 1 }, {}, 2)).toThrow(SaveError);
  });
});
