import { describe, expect, it } from 'vitest';
import { ReviewStore } from './review-store';

describe('ReviewStore', () => {
  it('calcula promedio y cantidad del seed', () => {
    const store = new ReviewStore();
    expect(store.count(3)).toBe(2);
    expect(store.average(3)).toBe(4.5);
    expect(store.count(1)).toBe(0);
    expect(store.average(1)).toBe(0);
  });

  it('agregar reseña actualiza promedio', () => {
    const store = new ReviewStore();
    store.add({ movieId: 3, stars: 3, comment: 'Bien, sin más.' });
    expect(store.count(3)).toBe(3);
    expect(store.average(3)).toBe(4);
  });
});
