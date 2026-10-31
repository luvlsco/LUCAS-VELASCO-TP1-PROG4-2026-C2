import { describe, expect, it } from 'vitest';
import { canCancelAt, hoursUntil } from './screening.model';

describe('canCancelAt', () => {
  const now = new Date('2026-10-10T12:00').getTime();
  it('permite con más de 2 h y bloquea con menos', () => {
    expect(canCancelAt('2026-10-10', '15:00', now)).toBe(true);
    expect(canCancelAt('2026-10-10', '13:30', now)).toBe(false);
    expect(canCancelAt('2026-10-10', '14:00', now)).toBe(false);
    expect(canCancelAt('2026-10-09', '12:00', now)).toBe(false);
  });

  it('calcula horas restantes', () => {
    expect(hoursUntil('2026-10-10', '18:00', now)).toBe(6);
    expect(hoursUntil('2026-10-09', '12:00', now)).toBe(-24);
  });
});
