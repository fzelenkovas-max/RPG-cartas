import { describe, expect, it } from 'vitest';
import { loadGameData, validateData, type GameData } from '../src/core/data';

describe('dados', () => {
  it('os JSON do jogo são válidos', () => {
    const d = loadGameData();
    expect(d.cards.length).toBeGreaterThan(0);
    expect(validateData(d)).toEqual([]);
  });
  it('detecta id duplicado entre coleções', () => {
    const d = loadGameData();
    const bad: GameData = { ...d, items: [...d.items, { id: d.enemies[0].id, name: 'x' }] };
    expect(validateData(bad).some((e) => e.includes('duplicado'))).toBe(true);
  });
  it('detecta id e nome ausentes', () => {
    const d = loadGameData();
    const bad = { ...d, items: [{ name: 'x' }, { id: 'a' }] } as unknown as GameData;
    expect(validateData(bad).length).toBe(2);
  });
});
