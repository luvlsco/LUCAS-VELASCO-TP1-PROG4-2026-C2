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
