import { describe, expect, it } from 'vitest';
import { BookingStore } from './booking-store';

describe('BookingStore', () => {
  it('agrega función con id nuevo', () => {
    const store = new BookingStore();
    const created = store.add({
      movieId: 1,
      roomId: 2,
      date: '2026-10-15',
      time: '18:00',
      format: '2D',
      language: 'castellano',
    });
    expect(created.id).toBeGreaterThan(0);
    expect(store.forMovie(1).length).toBe(2);
  });

  it('filtra funciones por película', () => {
    const store = new BookingStore();
    expect(store.forMovie(2).map((s) => s.id)).toEqual([2]);
    expect(store.forMovie(5)).toEqual([]);
  });
});
