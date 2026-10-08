import { describe, expect, it } from 'vitest';
import { areContiguous, buildRoomSeats, seatId, seatPrice } from './seat.model';

describe('buildRoomSeats', () => {
  const seats = buildRoomSeats();

  it('arma 532 butacas', () => {
    expect(seats.length).toBe(15 * 28 + 2 * 14 + 3 * 28);
  });

  it('J y K son accesibles 2/10/2', () => {
    const jk = seats.filter((s) => s.row === 'J' || s.row === 'K');
    expect(jk.length).toBe(28);
    expect(jk.every((s) => s.kind === 'accessible')).toBe(true);
    const jBlocks = seats.filter((s) => s.row === 'J').map((s) => s.block);
    expect(jBlocks.filter((b) => b === 0).length).toBe(2);
    expect(jBlocks.filter((b) => b === 1).length).toBe(10);
    expect(jBlocks.filter((b) => b === 2).length).toBe(2);
  });

  it('R, S y T son VIP', () => {
    const vip = seats.filter((s) => s.kind === 'vip');
    expect(vip.length).toBe(3 * 28);
    expect(vip.every((s) => ['R', 'S', 'T'].includes(s.row))).toBe(true);
  });

  it('A es estándar 4/20/4', () => {
    const a = seats.filter((s) => s.row === 'A');
    expect(a.length).toBe(28);
    expect(a.every((s) => s.kind === 'standard')).toBe(true);
  });

  it('id y precio', () => {
    expect(seatId({ row: 'J', number: 5 })).toBe('J5');
    expect(seatPrice({ row: 'R', number: 1, block: 1, kind: 'vip' }, 5000)).toBe(7500);
    expect(seatPrice({ row: 'A', number: 1, block: 0, kind: 'standard' }, 5000)).toBe(5000);
  });

  it('valida contigüidad', () => {
    expect(areContiguous([])).toBe(true);
    expect(areContiguous(['A5'])).toBe(true);
    expect(areContiguous(['A5', 'A6', 'A7'])).toBe(true);
    expect(areContiguous(['A7', 'A5', 'A6'])).toBe(true);
    expect(areContiguous(['A5', 'A7'])).toBe(false);
    expect(areContiguous(['A5', 'B5'])).toBe(false);
  });
});
