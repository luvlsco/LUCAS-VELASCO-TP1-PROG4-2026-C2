import { describe, expect, it } from 'vitest';
import { MyMoviesStore } from './my-movies-store';

describe('MyMoviesStore', () => {
  it('sin calificar devuelve 0', () => {
    const store = new MyMoviesStore();
    expect(store.rating(1)).toBe(0);
  });

  it('rate guarda y pisa sin tocar otras', () => {
    const store = new MyMoviesStore();
    store.rate(1, 5);
    expect(store.rating(1)).toBe(5);
    store.rate(1, 3);
    expect(store.rating(1)).toBe(3);
    expect(store.rating(3)).toBe(0);
  });
});
