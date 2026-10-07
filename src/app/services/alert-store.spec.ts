import { describe, expect, it } from 'vitest';
import { AlertStore } from './alert-store';

describe('AlertStore', () => {
  it('alterna la alerta por película', () => {
    const store = new AlertStore();
    expect(store.has(4)).toBe(false);
    store.toggle(4);
    expect(store.has(4)).toBe(true);
    store.toggle(4);
    expect(store.has(4)).toBe(false);
  });

  it('una alerta no afecta a otras', () => {
    const store = new AlertStore();
    store.toggle(4);
    expect(store.has(5)).toBe(false);
    store.toggle(4);
  });
});
