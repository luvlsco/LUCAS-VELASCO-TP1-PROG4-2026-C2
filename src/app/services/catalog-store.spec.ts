import { describe, expect, it } from 'vitest';
import { CatalogStore } from './catalog-store';
import { MovieDraft } from '../catalog/movie.model';

describe('CatalogStore', () => {
  it('agrega una película con id nuevo', () => {
    const store = new CatalogStore();
    const draft: MovieDraft = {
      title: 'Nueva peli',
      image: 'https://img.test/peli.jpg',
      synopsis: 'Una sinopsis válida con más de diez caracteres.',
      duration: 120,
      genres: ['Drama'],
      ageRating: 'libre',
    };
    const created = store.add(draft);
    expect(created.id).toBeGreaterThan(0);
    expect(store.find(created.id)?.title).toBe('Nueva peli');
  });

  it('actualiza una película existente', () => {
    const store = new CatalogStore();
    store.update(1, {
      title: 'Editada',
      image: 'https://img.test/edit.jpg',
      synopsis: 'Sinopsis editada con más de diez caracteres.',
      duration: 100,
      genres: ['Acción'],
      ageRating: '13',
    });
    expect(store.find(1)?.title).toBe('Editada');
    expect(store.find(1)?.genres).toEqual(['Acción']);
  });
});
