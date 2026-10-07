import { Injectable, signal } from '@angular/core';

const KEY = 'cine-alerts';

function load(): number[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as number[];
  } catch {
    return [];
  }
}

@Injectable({ providedIn: 'root' })
export class AlertStore {
  readonly movieIds = signal<number[]>(load());

  has(movieId: number): boolean {
    return this.movieIds().includes(movieId);
  }

  toggle(movieId: number): void {
    this.movieIds.update((ids) =>
      ids.includes(movieId) ? ids.filter((id) => id !== movieId) : [...ids, movieId],
    );
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, JSON.stringify(this.movieIds()));
    } catch {
      // sin almacenamiento disponible
    }
  }
}
