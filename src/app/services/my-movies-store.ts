import { Injectable, signal } from '@angular/core';

export interface WatchedEntry {
  movieId: number;
  watchedAt: string;
}

const KEY = 'cine-my-ratings';

const WATCHED_MOCK: WatchedEntry[] = [
  { movieId: 1, watchedAt: '2026-08-10' },
  { movieId: 3, watchedAt: '2026-09-02' },
];

function load(): Record<number, number> {
  try {
    if (typeof localStorage === 'undefined') return {};
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<number, number>;
  } catch {
    return {};
  }
}

@Injectable({ providedIn: 'root' })
export class MyMoviesStore {
  readonly watched = signal<WatchedEntry[]>(WATCHED_MOCK);
  readonly ratings = signal<Record<number, number>>(load());

  rating(movieId: number): number {
    return this.ratings()[movieId] ?? 0;
  }

  rate(movieId: number, stars: number): void {
    this.ratings.update((r) => ({ ...r, [movieId]: stars }));
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, JSON.stringify(this.ratings()));
    } catch {
      // sin almacenamiento disponible
    }
  }
}
