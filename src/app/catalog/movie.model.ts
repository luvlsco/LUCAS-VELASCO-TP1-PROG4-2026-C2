export interface Movie {
  id: number;
  title: string;
  image: string;
  synopsis: string;
  duration: number;
}

export type MovieDraft = Omit<Movie, 'id'>;

export function createEmptyMovieDraft(): MovieDraft {
  return { title: '', image: '', synopsis: '', duration: 90 };
}
