import { Injectable, computed, signal } from '@angular/core';
import { Movie, MovieDraft } from '../catalog/movie.model';

// mock en memoria; datos reales en S3
const DAY = 86400000;
const iso = (days: number): string => new Date(Date.now() + days * DAY).toISOString().slice(0, 10);

const MOVIE_MOCK: Movie[] = [
  {
    id: 1,
    title: 'El Padrino',
    image: 'https://a.ltrbxd.com/resized/film-poster/5/1/8/1/8/51818-the-godfather-0-1000-0-1500-crop.jpg',
    synopsis:
      'El patriarca de una dinastía mafiosa transfiere el control de su imperio a su hijo menor.',
    duration: 175,
    genres: ['Crimen', 'Drama'],
    ageRating: '18',
    featured: true,
    soldTickets: 1800,
    releaseDate: iso(-60),
  },
  {
    id: 2,
    title: 'Volver al Futuro',
    image: 'https://a.ltrbxd.com/resized/film-poster/5/1/9/4/5/51945-back-to-the-future-0-1000-0-1500-crop.jpg',
    synopsis: 'Un adolescente viaja al pasado y debe asegurar que sus padres se conozcan.',
    duration: 116,
    genres: ['Ciencia ficción', 'Aventura', 'Comedia'],
    ageRating: 'libre',
    featured: true,
    soldTickets: 900,
    releaseDate: iso(-30),
  },
  {
    id: 3,
    title: 'Titanic',
    image: 'https://a.ltrbxd.com/resized/film-poster/5/1/5/2/4/51524-titanic-0-1000-0-1500-crop.jpg',
    synopsis: 'Un romance a bordo del transatlántico condenado en su viaje inaugural.',
    duration: 194,
    genres: ['Drama', 'Romance'],
    ageRating: '13',
    featured: false,
    soldTickets: 2300,
    releaseDate: iso(-10),
  },
  {
    id: 4,
    title: 'Matrix',
    image: 'https://a.ltrbxd.com/resized/film-poster/5/1/5/1/8/51518-the-matrix-0-1000-0-1500-crop.jpg',
    synopsis: 'Un hacker descubre que su realidad es una simulación controlada por máquinas.',
    duration: 136,
    genres: ['Ciencia ficción', 'Acción'],
    ageRating: '13',
    featured: true,
    soldTickets: 1500,
    releaseDate: iso(10),
  },
  {
    id: 5,
    title: 'Gladiador',
    image: 'https://a.ltrbxd.com/resized/film-poster/5/1/9/5/2/51952-gladiator-2000-0-1000-0-1500-crop.jpg',
    synopsis: 'Un general romano busca venganza contra el emperador que asesinó a su familia.',
    duration: 155,
    genres: ['Acción', 'Drama', 'Aventura'],
    ageRating: '13',
    featured: false,
    soldTickets: 1200,
    releaseDate: iso(35),
  },
];

@Injectable({ providedIn: 'root' })
export class CatalogStore {
  readonly movies = signal<Movie[]>(MOVIE_MOCK);
  readonly featured = computed(() => this.movies().filter((m) => m.featured));
  readonly top3 = computed(() =>
    [...this.movies()].sort((a, b) => b.soldTickets - a.soldTickets).slice(0, 3),
  );
  readonly comingSoon = computed(() => {
    const today = new Date().toISOString().slice(0, 10);
    return this.movies().filter((m) => m.releaseDate > today);
  });
  readonly query = signal('');
  readonly genre = signal('');
  readonly filtered = computed(() => {    const q = this.query().toLowerCase();
    const g = this.genre();
    return this.movies().filter(
      (m) => m.title.toLowerCase().includes(q) && (g === '' || m.genres.includes(g)),
    );
  });

  find(id: number): Movie | undefined {
    return this.movies().find((m) => m.id === id);
  }

  add(draft: MovieDraft): Movie {
    const ids = this.movies().map((m) => m.id);
    const created: Movie = { ...draft, id: ids.length === 0 ? 1 : Math.max(...ids) + 1 };
    this.movies.update((list) => [...list, created]);
    return created;
  }

  update(id: number, patch: MovieDraft): void {
    this.movies.update((list) => list.map((m) => (m.id === id ? { ...patch, id } : m)));
  }

  toggleFeatured(id: number): void {
    this.movies.update((list) => list.map((m) => (m.id === id ? { ...m, featured: !m.featured } : m)));
  }
}
