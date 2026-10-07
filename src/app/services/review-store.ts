import { Injectable, signal } from '@angular/core';
import { Review } from '../catalog/review.model';

const KEY = 'cine-reviews';

const SEED: Review[] = [
  { movieId: 3, stars: 5, comment: 'La vi tres veces y sigue emocionando.' },
  { movieId: 3, stars: 4, comment: 'Larga, pero vale cada minuto.' },
  { movieId: 4, stars: 5, comment: 'Un antes y un después.' },
];

function load(): Review[] {
  try {
    if (typeof localStorage === 'undefined') return [...SEED];
    const raw = localStorage.getItem(KEY);
    if (!raw) return [...SEED];
    return JSON.parse(raw) as Review[];
  } catch {
    return [...SEED];
  }
}

@Injectable({ providedIn: 'root' })
export class ReviewStore {
  readonly reviews = signal<Review[]>(load());

  forMovie(movieId: number): Review[] {
    return this.reviews().filter((r) => r.movieId === movieId);
  }

  count(movieId: number): number {
    return this.forMovie(movieId).length;
  }

  average(movieId: number): number {
    const list = this.forMovie(movieId);
    if (list.length === 0) return 0;
    return Math.round((list.reduce((acc, r) => acc + r.stars, 0) / list.length) * 10) / 10;
  }

  add(review: Review): void {
    this.reviews.update((list) => [...list, review]);
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, JSON.stringify(this.reviews()));
    } catch {
      // sin almacenamiento disponible
    }
  }
}
