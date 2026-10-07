import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingStore } from '../../services/booking-store';
import { CatalogStore } from '../../services/catalog-store';

@Component({
  selector: 'app-screening-admin',
  imports: [RouterLink],
  templateUrl: './screening-admin.html',
})
export class ScreeningAdmin {
  protected readonly store = inject(BookingStore);
  protected readonly catalog = inject(CatalogStore);

  protected movieTitle(movieId: number): string {
    return this.catalog.find(movieId)?.title ?? '—';
  }
}
