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
      featured: false,
      soldTickets: 0,
      releaseDate: '2026-01-01',
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
      featured: true,
      soldTickets: 10,
      releaseDate: '2026-01-01',
    });
    expect(store.find(1)?.title).toBe('Editada');
    expect(store.find(1)?.genres).toEqual(['Acción']);
  });

  it('filtra por nombre, género y combinado', () => {
    const store = new CatalogStore();
    store.query.set('matrix');
    expect(store.filtered().map((m) => m.title)).toEqual(['Matrix']);
    store.query.set('');
    store.genre.set('Romance');
    expect(store.filtered().map((m) => m.title)).toEqual(['Titanic']);
    store.query.set('a');
    store.genre.set('Acción');
    expect(store.filtered().map((m) => m.title)).toEqual(['Matrix', 'Gladiador']);
    store.query.set('');
    store.genre.set('');
    expect(store.filtered().length).toBe(5);
  });

  it('ordena el top 3 por entradas vendidas', () => {
    const store = new CatalogStore();
    expect(store.top3().map((m) => m.title)).toEqual(['Titanic', 'El Padrino', 'Matrix']);
    store.add({
      title: 'Sin ventas',
      image: 'https://img.test/sv.jpg',
      synopsis: 'Sinopsis con más de diez caracteres.',
      duration: 90,
      genres: ['Drama'],
      ageRating: 'libre',
      featured: false,
      soldTickets: 0,
      releaseDate: '2026-01-01',
    });
    expect(store.top3().map((m) => m.title)).toEqual(['Titanic', 'El Padrino', 'Matrix']);
  });

  it('filtra próximos estrenos', () => {
    const store = new CatalogStore();
    expect(store.comingSoon().map((m) => m.title)).toEqual(['Matrix', 'Gladiador']);
  });

  it('filtra destacadas y alterna con toggle', () => {
    const store = new CatalogStore();
    expect(store.featured().length).toBe(3);
    store.toggleFeatured(3);
    expect(store.featured().length).toBe(4);
    store.toggleFeatured(1);
    expect(store.featured().length).toBe(3);
  });
});
