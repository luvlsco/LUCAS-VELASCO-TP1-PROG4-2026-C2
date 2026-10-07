import { Injectable, signal } from '@angular/core';
import { Room, Screening, ScreeningDraft, ScreeningSlot } from '../booking/screening.model';

const ROOMS: Room[] = [
  { id: 1, name: 'Sala 1' },
  { id: 2, name: 'Sala 2' },
  { id: 3, name: 'Sala 3' },
];

const SCREENINGS_MOCK: Screening[] = [  { id: 1, movieId: 1, roomId: 1, date: '2026-10-10', time: '18:00', format: '2D', language: 'castellano' },
  { id: 2, movieId: 2, roomId: 2, date: '2026-10-10', time: '20:00', format: '3D', language: 'subtitulada' },
  { id: 3, movieId: 3, roomId: 1, date: '2026-10-11', time: '18:00', format: '2D', language: 'castellano' },
  { id: 4, movieId: 4, roomId: 3, date: '2026-10-12', time: '22:00', format: '4D', language: 'castellano' },
];

@Injectable({ providedIn: 'root' })
export class BookingStore {
  readonly rooms = signal<Room[]>(ROOMS);
  readonly screenings = signal<Screening[]>(SCREENINGS_MOCK);
  readonly occupied = signal<Record<number, string[]>>({ 1: ['A1', 'A2', 'J5'], 2: ['B3'] });

  isOccupied(screeningId: number, seatId: string): boolean {
    return this.occupied()[screeningId]?.includes(seatId) ?? false;
  }

  forMovie(movieId: number): Screening[] {
    return this.screenings().filter((s) => s.movieId === movieId);
  }

  roomName(roomId: number): string {
    return this.rooms().find((r) => r.id === roomId)?.name ?? '—';
  }

  add(draft: ScreeningDraft): Screening {
    const ids = this.screenings().map((s) => s.id);
    const created: Screening = { ...draft, id: ids.length === 0 ? 1 : Math.max(...ids) + 1 };
    this.screenings.update((list) => [...list, created]);
    return created;
  }

  update(id: number, patch: ScreeningDraft): void {
    this.screenings.update((list) => list.map((s) => (s.id === id ? { ...patch, id } : s)));
  }

  remove(id: number): void {
    this.screenings.update((list) => list.filter((s) => s.id !== id));
  }

  overlaps(a: ScreeningSlot, b: ScreeningSlot): boolean {
    if (a.date !== b.date) return false;
    const start = (t: string): number => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const a0 = start(a.time);
    const a1 = a0 + a.durationMin + 30;
    const b0 = start(b.time);
    const b1 = b0 + b.durationMin + 30;
    return a0 < b1 && b0 < a1;
  }

  conflicts(
    roomId: number,
    slot: ScreeningSlot,
    excludeId: number | undefined,
    durationOf: (movieId: number) => number,
  ): boolean {
    return this.screenings().some(
      (s) =>
        s.id !== excludeId &&
        s.roomId === roomId &&
        this.overlaps(slot, { date: s.date, time: s.time, durationMin: durationOf(s.movieId) }),
    );
  }

  findFreeRoom(
    date: string,
    time: string,
    durationMin: number,
    excludeId: number | undefined,
    durationOf: (movieId: number) => number,
  ): number | undefined {
    return this.rooms()
      .map((r) => r.id)
      .find(
        (roomId) =>
          !this.screenings().some(
            (s) =>
              s.id !== excludeId &&
              s.roomId === roomId &&
              this.overlaps(
                { date, time, durationMin },
                { date: s.date, time: s.time, durationMin: durationOf(s.movieId) },
              ),
          ),
      );
  }
}
