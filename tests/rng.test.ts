import { describe, expect, it } from 'vitest';
import { Rng } from '../src/core/rng';

describe('Rng', () => {
  it('mesma semente gera a mesma sequência', () => {
    const a = new Rng(123), b = new Rng(123);
    expect(Array.from({ length: 10 }, () => a.next())).toEqual(Array.from({ length: 10 }, () => b.next()));
  });
  it('sementes diferentes divergem', () => {
    expect(new Rng(1).next()).not.toBe(new Rng(2).next());
  });
  it('semente em texto é estável', () => {
    expect(new Rng('abc').next()).toBe(new Rng('abc').next());
  });
  it('int respeita limites e die rola 1..faces', () => {
    const r = new Rng(7);
    for (let i = 0; i < 500; i++) {
      const v = r.int(3, 5);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(5);
      const d = r.die(20);
      expect(d).toBeGreaterThanOrEqual(1);
      expect(d).toBeLessThanOrEqual(20);
    }
  });
  it('estado salvo retoma a sequência', () => {
    const a = new Rng(9);
    a.next(); a.next();
    const b = new Rng(0);
    b.setState(a.getState());
    expect(b.next()).toBe(a.next());
  });
  it('shuffle preserva os elementos e é determinístico', () => {
    const list = [1, 2, 3, 4, 5, 6];
    const s = new Rng(5).shuffle(list);
    expect([...s].sort()).toEqual(list);
    expect(s).toEqual(new Rng(5).shuffle(list));
  });
});
