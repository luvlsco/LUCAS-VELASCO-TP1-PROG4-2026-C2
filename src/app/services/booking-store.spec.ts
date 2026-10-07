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

  it('encuentra sala libre', () => {
    const store = new BookingStore();
    const durationOf = (movieId: number): number =>
      ({ 1: 175, 2: 116, 3: 194, 4: 136 })[movieId] ?? 0;
    expect(store.findFreeRoom('2026-10-10', '18:00', 90, undefined, durationOf)).toBe(2);
  });

  it('devuelve undefined sin salas libres', () => {
    const store = new BookingStore();
    const durationOf = (movieId: number): number =>
      ({ 1: 175, 2: 116, 3: 194, 4: 136 })[movieId] ?? 0;
    store.add({ movieId: 3, roomId: 3, date: '2026-10-10', time: '19:00', format: '2D', language: 'castellano' });
    expect(store.findFreeRoom('2026-10-10', '19:30', 60, undefined, durationOf)).toBe(undefined);
  });

  it('excludeId ignora la función en edición', () => {
    const store = new BookingStore();
    const durationOf = (movieId: number): number =>
      ({ 1: 175, 2: 116, 3: 194, 4: 136 })[movieId] ?? 0;
    expect(store.findFreeRoom('2026-10-10', '18:00', 175, 1, durationOf)).toBe(1);
    expect(store.findFreeRoom('2026-10-10', '18:00', 175, undefined, durationOf)).toBe(3);
  });

  it('detecta solapes y respeta 30 min', () => {
    const store = new BookingStore();
    const durationOf = (movieId: number): number =>
      ({ 1: 175, 2: 116, 3: 194, 4: 136 })[movieId] ?? 0;
    // s1: sala 1, 2026-10-10 18:00, 175 min → ocupa hasta 21:25
    expect(
      store.conflicts(1, { date: '2026-10-10', time: '19:00', durationMin: 90 }, undefined, durationOf),
    ).toBe(true);
    expect(
      store.conflicts(1, { date: '2026-10-10', time: '21:00', durationMin: 60 }, undefined, durationOf),
    ).toBe(true);
    expect(
      store.conflicts(1, { date: '2026-10-10', time: '21:25', durationMin: 60 }, undefined, durationOf),
    ).toBe(false);
    expect(
      store.conflicts(2, { date: '2026-10-10', time: '17:00', durationMin: 30 }, undefined, durationOf),
    ).toBe(false);
    expect(
      store.conflicts(1, { date: '2026-10-13', time: '19:00', durationMin: 90 }, undefined, durationOf),
    ).toBe(false);
    expect(
      store.conflicts(1, { date: '2026-10-10', time: '19:00', durationMin: 90 }, 1, durationOf),
    ).toBe(false);
  });
});
