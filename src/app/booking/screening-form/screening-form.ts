import { Component, effect, inject, input, numberAttribute, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormField, FormRoot, form, min, required } from '@angular/forms/signals';
import { BookingStore } from '../../services/booking-store';
import { CatalogStore } from '../../services/catalog-store';
import { ScreeningDraft, createEmptyScreeningDraft } from '../screening.model';

@Component({
  selector: 'app-screening-form',
  imports: [FormField, FormRoot, RouterLink],
  templateUrl: './screening-form.html',
})
export class ScreeningForm {
  protected readonly catalog = inject(CatalogStore);
  protected readonly store = inject(BookingStore);
  private readonly router = inject(Router);

  screeningId = input<number | undefined, unknown>(undefined, {
    transform: (value) =>
      value === undefined || value === null || value === '' ? undefined : numberAttribute(value),
  });

  protected draft = signal<ScreeningDraft>(createEmptyScreeningDraft());
  protected saving = signal(false);
  protected submitted = signal(false);
  protected submitError = signal<string | null>(null);

  protected screeningForm = form(this.draft, (f) => {
    min(f.movieId, 1, { message: 'Elegí una película' });
    required(f.date, { message: 'La fecha es obligatoria' });
    required(f.time, { message: 'La hora es obligatoria' });
    required(f.format, { message: 'El formato es obligatorio' });
    required(f.language, { message: 'El idioma es obligatorio' });
  });

  constructor() {
    effect(() => {
      const id = this.screeningId();
      if (!id) return;
      const found = this.store.screenings().find((s) => s.id === id);
      if (found) {
        this.draft.set({
          movieId: found.movieId,
          roomId: found.roomId,
          date: found.date,
          time: found.time,
          format: found.format,
          language: found.language,
        });
      }
    });
  }

  protected setMovie(value: string): void {
    this.draft.update((d) => ({ ...d, movieId: Number(value) }));
  }

  protected setRoom(value: string): void {
    this.draft.update((d) => ({ ...d, roomId: Number(value) }));
  }

  protected async save(): Promise<void> {
    this.submitted.set(true);
    if (!this.screeningForm().valid()) {
      this.submitError.set('Revisá los campos marcados.');
      return;
    }
    this.saving.set(true);
    this.submitError.set(null);
    try {
      const id = this.screeningId();
      const draft = this.draft();
      const durationOf = (movieId: number): number =>
        this.catalog.find(movieId)?.duration ?? 0;
      let roomId = draft.roomId;
      if (roomId === 0) {
        const duration = this.catalog.find(draft.movieId)?.duration ?? 0;
        const free = this.store.findFreeRoom(draft.date, draft.time, duration, id, durationOf);
        if (free === undefined) {
          this.submitError.set('Sin salas libres en ese horario.');
          return;
        }
        roomId = free;
      }
      const duration = this.catalog.find(draft.movieId)?.duration ?? 0;
      if (this.store.conflicts(roomId, { date: draft.date, time: draft.time, durationMin: duration }, id, durationOf)) {
        this.submitError.set('La sala está ocupada en ese horario (30 min entre funciones).');
        return;
      }
      if (id !== undefined) this.store.update(id, { ...draft, roomId });
      else this.store.add({ ...draft, roomId });
      await this.router.navigate(['/admin/funciones']);
    } finally {
      this.saving.set(false);
    }
  }
}
