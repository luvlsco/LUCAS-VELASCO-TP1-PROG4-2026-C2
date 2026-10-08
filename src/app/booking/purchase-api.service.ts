import { Injectable } from '@angular/core';
import { supabase } from '../services/supabase.client';

export interface PurchaseInput {
  userId: string | null;
  screeningId: number;
  seats: { id: string; price: number }[];
  total: number;
  couponPct: number;
}

@Injectable({ providedIn: 'root' })
export class PurchaseApi {
  async create(input: PurchaseInput): Promise<number> {
    const { data: purchase, error } = await supabase
      .from('purchases')
      .insert({
        user_id: input.userId,
        screening_id: input.screeningId,
        total: input.total,
        coupon_pct: input.couponPct,
      })
      .select('id')
      .single();
    if (error || !purchase) throw new Error(error?.message ?? 'No se pudo crear la compra');
    const { error: ticketsError } = await supabase.from('tickets').insert(
      input.seats.map((s) => ({
        purchase_id: purchase.id,
        screening_id: input.screeningId,
        seat: s.id,
        price: s.price,
      })),
    );
    if (ticketsError) throw new Error(ticketsError.message);
    if (input.userId && input.couponPct > 0) {
      await supabase.from('profiles').update({ first_coupon_used: true }).eq('id', input.userId);
    }
    return purchase.id as number;
  }
}
