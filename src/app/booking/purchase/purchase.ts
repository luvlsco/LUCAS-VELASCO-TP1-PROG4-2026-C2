import { Component, computed, effect, inject, input, numberAttribute, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { supabase } from '../../services/supabase.client';
import { AuthService } from '../../services/auth.service';
import { BookingStore } from '../../services/booking-store';
import { CatalogStore } from '../../services/catalog-store';
import { PurchaseApi } from '../purchase-api.service';
import { QrService } from '../qr.service';
import { areContiguous, buildRoomSeats, seatPrice, seatId } from '../seat.model';

interface SeniorCoupon {
  id: number;
  pct: number;
  min_age: number;
}

@Component({
  selector: 'app-purchase',
  imports: [RouterLink],
  templateUrl: './purchase.html',
})
export class Purchase {
  protected readonly booking = inject(BookingStore);
  protected readonly catalog = inject(CatalogStore);
  protected readonly auth = inject(AuthService);
  private readonly api = inject(PurchaseApi);
  private readonly qr = inject(QrService);

  screeningId = input<number | undefined, unknown>(undefined, {
    transform: (value) =>
      value === undefined || value === null || value === '' ? undefined : numberAttribute(value),
  });

  protected screening = computed(() => {
    const id = this.screeningId();
    return id === undefined ? undefined : this.booking.screenings().find((s) => s.id === id);
  });

  protected movie = computed(() => {
    const s = this.screening();
    return s ? this.catalog.find(s.movieId) : undefined;
  });

  protected seats = computed(() => {
    const s = this.screening();
    const m = this.movie();
    if (!s || !m) return [];
    const base = this.catalog.precioVigente(m);
    return this.booking.selected().map((id) => {
      const seat = buildRoomSeats().find((x) => seatId(x) === id);
      return { id, price: seat ? seatPrice(seat, base) : base };
    });
  });

  protected subtotal = computed(() => this.seats().reduce((acc, s) => acc + s.price, 0));
  protected validSelection = computed(() => {
    const ids = this.booking.selected();
    return ids.length > 0 && areContiguous(ids);
  });

  protected couponPct = signal(0);
  protected firstCouponPct = signal(0);
  protected seniorCoupons = signal<SeniorCoupon[]>([]);
  protected saving = signal(false);
  protected error = signal<string | null>(null);
  protected purchaseId = signal<number | null>(null);
  protected qrUrl = signal<string | null>(null);

  protected total = computed(() => Math.round(this.subtotal() * (1 - this.couponPct() / 100)));

  constructor() {
    effect(() => {
      const userId = this.auth.session()?.user.id;
      if (!userId) return;
      void supabase
        .from('profiles')
        .select('coupon_pct, first_coupon_used, birthdate')
        .eq('id', userId)
        .single()
        .then(({ data }) => {
          if (data && !data.first_coupon_used) this.firstCouponPct.set(data.coupon_pct ?? 0);
          if (data?.birthdate) {
            const age =
              (Date.now() - new Date(data.birthdate).getTime()) / (365.25 * 86400000);
            void supabase
              .from('coupons')
              .select('id, pct, min_age')
              .lte('min_age', Math.floor(age))
              .then(({ data: coupons }) => this.seniorCoupons.set((coupons as SeniorCoupon[]) ?? []));
          }
        });
    });
  }

  protected useFirstCoupon(): void {
    this.couponPct.set(this.firstCouponPct());
  }

  protected async downloadPdf(): Promise<void> {
    const s = this.screening();
    const m = this.movie();
    const qrUrl = this.qrUrl();
    const id = this.purchaseId();
    if (!s || !m || !qrUrl || id === null) return;
    await this.qr.ticketPdf(
      {
        purchaseId: id,
        movie: m.title,
        date: s.date,
        time: s.time,
        room: this.booking.roomName(s.roomId),
        format: s.format,
        seats: this.confirmedSeats(),
        total: this.confirmedTotal(),
      },
      qrUrl,
    );
  }

  private confirmedSeats(): { id: string; price: number }[] {
    return this.lastSeats;
  }

  private lastSeats: { id: string; price: number }[] = [];
  private lastTotal = 0;

  protected confirmedTotal(): number {
    return this.lastTotal;
  }

  protected useSeniorCoupon(pct: number): void {
    this.couponPct.set(pct);
  }

  protected async confirm(): Promise<void> {
    const s = this.screening();
    if (!s || !this.validSelection()) return;
    this.saving.set(true);
    this.error.set(null);
    try {
      this.lastSeats = this.seats();
      this.lastTotal = this.total();
      const id = await this.api.create({
        userId: this.auth.session()?.user.id ?? null,
        screeningId: s.id,
        seats: this.lastSeats,
        total: this.lastTotal,
        couponPct: this.couponPct(),
      });
      this.booking.clearSelection();
      this.purchaseId.set(id);
      this.qrUrl.set(await this.qr.toDataUrl(this.qr.code(id)));
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'No se pudo confirmar la compra.');
    } finally {
      this.saving.set(false);
    }
  }
}
