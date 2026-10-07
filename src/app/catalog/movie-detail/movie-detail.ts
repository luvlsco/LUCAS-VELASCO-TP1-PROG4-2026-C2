import { Component, computed, inject, input, numberAttribute, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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
import { ReviewStore } from '../../services/review-store';

@Component({
  selector: 'app-movie-detail',
  imports: [FormField, FormRoot, RouterLink],
  templateUrl: './movie-detail.html',
})
export class MovieDetail {
  protected readonly store = inject(CatalogStore);
  protected readonly reviews = inject(ReviewStore);

  movieId = input<number | undefined, unknown>(undefined, {
    transform: (value) =>
      value === undefined || value === null || value === '' ? undefined : numberAttribute(value),
  });

  protected movie = computed(() => {
    const id = this.movieId();
    return id === undefined ? undefined : this.store.find(id);
  });

  protected draft = signal({ stars: 5, comment: '' });
  protected submitted = signal(false);
  protected submitError = signal<string | null>(null);

  protected reviewForm = form(this.draft, (f) => {
    min(f.stars, 1);
    max(f.stars, 5);
    required(f.comment, { message: 'El comentario es obligatorio' });
    minLength(f.comment, 3, { message: 'Mínimo 3 caracteres' });
    maxLength(f.comment, 200, { message: 'Máximo 200 caracteres' });
  });

  protected setStars(value: string): void {
    this.draft.update((d) => ({ ...d, stars: Number(value) }));
  }

  protected save(): void {
    const id = this.movieId();
    if (id === undefined) return;
    this.submitted.set(true);
    if (!this.reviewForm().valid()) {
      this.submitError.set('Revisá los campos marcados.');
      return;
    }
    this.reviews.add({ movieId: id, stars: this.draft().stars, comment: this.draft().comment });
    this.draft.set({ stars: 5, comment: '' });
    this.submitted.set(false);
    this.submitError.set(null);
  }
}
