export type AgeRating = 'libre' | '13' | '18';

export const MOVIE_GENRES: string[] = [
  'Acción',
  'Aventura',
  'Ciencia ficción',
  'Comedia',
  'Crimen',
  'Drama',
  'Romance',
  'Terror',
];

export interface Movie {
  id: number;
  title: string;
  image: string;
  synopsis: string;
  duration: number;
  genres: string[];
  ageRating: AgeRating;
  featured: boolean;
  soldTickets: number;
}

export type MovieDraft = Omit<Movie, 'id'>;

export function createEmptyMovieDraft(): MovieDraft {
  return {
    title: '',
    image: '',
    synopsis: '',
    duration: 90,
    genres: [],
    ageRating: 'libre',
    featured: false,
    soldTickets: 0,
  };
}
