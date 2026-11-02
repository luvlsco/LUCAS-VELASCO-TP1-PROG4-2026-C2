import { describe, expect, it } from 'vitest';
import { candyTotal } from './candy.model';

describe('candyTotal', () => {
  it('suma productos y combos', () => {
    expect(candyTotal([{ price: 2000 }, { price: 3500 }])).toBe(5500);
    expect(candyTotal([])).toBe(0);
  });
});
