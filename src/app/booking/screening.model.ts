export type ScreeningFormat = '2D' | '3D' | '4D' | '5D';
export type ScreeningLanguage = 'castellano' | 'subtitulada';

export interface Room {
  id: number;
  name: string;
}

export interface Screening {
  id: number;
  movieId: number;
  roomId: number;
  date: string;
  time: string;
  format: ScreeningFormat;
  language: ScreeningLanguage;
}

export type ScreeningDraft = Omit<Screening, 'id'>;

export interface ScreeningSlot {
  date: string;
  time: string;
  durationMin: number;
}

export function createEmptyScreeningDraft(): ScreeningDraft {
  return { movieId: 0, roomId: 0, date: '', time: '', format: '2D', language: 'castellano' };
}

export function canCancelAt(date: string, time: string, nowMs: number): boolean {
  return new Date(`${date}T${time}`).getTime() - nowMs > 2 * 3600000;
}

export function hoursUntil(date: string, time: string, nowMs: number): number {
  return (new Date(`${date}T${time}`).getTime() - nowMs) / 3600000;
}
