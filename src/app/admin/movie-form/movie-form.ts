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
import { MovieDraft, createEmptyMovieDraft } from '../../catalog/movie.model';

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
        });
      }
    });
  }

  protected async save(): Promise<void> {
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
