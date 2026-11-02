import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { supabase } from '../../services/supabase.client';
import { AuthService } from '../../services/auth.service';
import { BookingStore } from '../../services/booking-store';
import { canCancelAt } from '../screening.model';

interface MyPurchase {
  id: number;
  screening_id: number;
  total: number;
  status: string;
}

@Component({
  selector: 'app-my-purchases',
  imports: [RouterLink],
  templateUrl: './my-purchases.html',
})
export class MyPurchases {
  protected readonly booking = inject(BookingStore);
  private readonly auth = inject(AuthService);
  protected purchases = signal<MyPurchase[]>([]);
  protected error = signal<string | null>(null);

  constructor() {
    const userId = this.auth.session()?.user.id;
    if (!userId) return;
    void supabase
      .from('purchases')
      .select('id, screening_id, total, status')
      .eq('user_id', userId)
      .order('id', { ascending: false })
      .then(({ data }) => this.purchases.set((data as MyPurchase[]) ?? []));
  }

  protected screeningOf(id: number): string {
    const s = this.booking.screenings().find((x) => x.id === id);
    return s ? `${s.date} ${s.time}` : '—';
  }

  protected canCancel(id: number): boolean {
    const s = this.booking.screenings().find((x) => x.id === id);
    return s ? canCancelAt(s.date, s.time, Date.now()) : false;
  }

  protected async cancel(purchase: MyPurchase): Promise<void> {
    this.error.set(null);
    const { error } = await supabase.rpc('cancel_purchase', { p_purchase_id: purchase.id });
    if (error) this.error.set(error.message);
    else {
      this.purchases.update((list) =>
        list.map((p) => (p.id === purchase.id ? { ...p, status: 'cancelada' } : p)),
      );
    }
  }
}
