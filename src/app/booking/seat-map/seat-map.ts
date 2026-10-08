import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingStore } from '../../services/booking-store';
import { CatalogStore } from '../../services/catalog-store';
import { Seat, areContiguous, buildRoomSeats, seatId } from '../seat.model';

@Component({
  selector: 'app-seat-map',
  imports: [RouterLink],
  templateUrl: './seat-map.html',
})
export class SeatMap {
  protected readonly store = inject(BookingStore);
  protected readonly catalog = inject(CatalogStore);

  screeningId = input<number | undefined, unknown>(undefined, {
    transform: (value) =>
      value === undefined || value === null || value === '' ? undefined : numberAttribute(value),
  });

  protected screening = computed(() => {
    const id = this.screeningId();
    return id === undefined ? undefined : this.store.screenings().find((s) => s.id === id);
  });

  protected rows = computed(() => {
    const byRow = new Map<string, Seat[]>();
    for (const seat of buildRoomSeats()) {
      const list = byRow.get(seat.row) ?? [];
      list.push(seat);
      byRow.set(seat.row, list);
    }
    return [...byRow.entries()];
  });

  protected movieTitle(movieId: number): string {
    return this.catalog.find(movieId)?.title ?? '—';
  }

  protected occupied(seat: Seat): boolean {
    return this.store.isOccupied(this.screeningId() ?? -1, seatId(seat));
  }

  protected isSelected(seat: Seat): boolean {
    return this.store.selected().includes(seatId(seat));
  }

  protected toggle(seat: Seat): void {
    this.store.toggleSeat(this.screeningId() ?? -1, seatId(seat));
  }

  protected contiguous(): boolean {
    return areContiguous(this.store.selected());
  }

  protected seatClass(seat: Seat): string {
    const classes = ['seat', seat.kind];
    if (this.occupied(seat)) classes.push('taken');
    if (this.isSelected(seat)) classes.push('selected');
    return classes.join(' ');
  }
}
