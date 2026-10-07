import { Component, effect, inject, input, numberAttribute, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormField,
  FormRoot,
  form,
  max,
  maxLength,
  min,
  minLength,
  required,
} from '@angular/forms/signals';
import { CatalogStore } from '../../services/catalog-store';
import { MovieDraft, MOVIE_GENRES, createEmptyMovieDraft } from '../../catalog/movie.model';

@Component({
  selector: 'app-movie-form',
  imports: [FormField, FormRoot, RouterLink],
  templateUrl: './movie-form.html',
  styleUrl: './movie-form.css',
})
export class MovieForm {
  private readonly store = inject(CatalogStore);
  private readonly router = inject(Router);

  // presente solo en /admin/peliculas/:movieId/editar
  movieId = input<number | undefined, unknown>(undefined, {
    transform: (value) =>
      value === undefined || value === null || value === '' ? undefined : numberAttribute(value),
  });

  protected draft = signal<MovieDraft>(createEmptyMovieDraft());
  protected readonly genreOptions = MOVIE_GENRES;
  protected submitted = signal(false);
  protected saving = signal(false);
  protected submitError = signal<string | null>(null);

  protected movieForm = form(this.draft, (f) => {
    required(f.title, { message: 'El título es obligatorio' });
    minLength(f.title, 3, { message: 'Mínimo 3 caracteres' });
    maxLength(f.title, 80, { message: 'Máximo 80 caracteres' });
    required(f.image, { message: 'La imagen es obligatoria' });
    required(f.synopsis, { message: 'La sinopsis es obligatoria' });
    minLength(f.synopsis, 10, { message: 'Mínimo 10 caracteres' });
    maxLength(f.synopsis, 500, { message: 'Máximo 500 caracteres' });
    min(f.duration, 1, { message: 'Mínimo 1 minuto' });
    max(f.duration, 600, { message: 'Máximo 600 minutos' });
    minLength(f.genres, 1, { message: 'Elegí al menos un género' });
    required(f.ageRating, { message: 'La edad es obligatoria' });
    required(f.releaseDate, { message: 'La fecha de estreno es obligatoria' });
    min(f.presalePrice, 0, { message: 'Mínimo 0' });
    min(f.price, 0, { message: 'Mínimo 0' });
  });

  constructor() {
    effect(() => {
      const id = this.movieId();
      if (!id) return;
      const found = this.store.find(id);
      if (found) {
        this.draft.set({
          title: found.title,
          image: found.image,
          synopsis: found.synopsis,
          duration: found.duration,
          genres: [...found.genres],
          ageRating: found.ageRating,
          featured: found.featured,
          soldTickets: found.soldTickets,
          releaseDate: found.releaseDate,
          presalePrice: found.presalePrice,
          price: found.price,
        });
      }
    });
  }

  protected toggleGenre(genre: string): void {
    this.draft.update((d) => ({
      ...d,
      genres: d.genres.includes(genre) ? d.genres.filter((g) => g !== genre) : [...d.genres, genre],
    }));
  }

  protected async save(): Promise<void> {
    this.submitted.set(true);
    if (!this.movieForm().valid()) {
      this.submitError.set('Revisá los campos marcados.');
      return;
    }
    this.saving.set(true);
    this.submitError.set(null);
    try {
      const id = this.movieId();
      const savedId = id ?? this.store.add(this.draft()).id;
      if (id !== undefined) this.store.update(id, this.draft());
      await this.router.navigate(['/admin/peliculas', savedId, 'editar']);
    } finally {
      this.saving.set(false);
    }
  }
}
