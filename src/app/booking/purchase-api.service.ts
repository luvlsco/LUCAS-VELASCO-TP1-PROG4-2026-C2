import { Injectable } from '@angular/core';
import { supabase } from '../services/supabase.client';

export interface PurchaseInput {
  userId: string | null;
  screeningId: number;
  seats: { id: string; price: number }[];
  total: number;
  couponPct: number;
  items: { label: string; price: number }[];
  creditUsed: number;
}

@Injectable({ providedIn: 'root' })
export class PurchaseApi {
  async create(input: PurchaseInput): Promise<number> {
    const { data, error } = await supabase.rpc('create_purchase', {
      p_user_id: input.userId,
      p_screening_id: input.screeningId,
      p_seats: input.seats.map((s) => s.id),
      p_prices: input.seats.map((s) => s.price),
      p_total: input.total,
      p_coupon_pct: input.couponPct,
    });
    if (error) throw new Error(error.message);
    if (input.items.length > 0) {
      const { error: itemsError } = await supabase.from('purchase_items').insert(
        input.items.map((item) => ({ purchase_id: data, label: item.label, price: item.price })),
      );
      if (itemsError) throw new Error(itemsError.message);
    }
    if (input.userId && input.creditUsed > 0) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('credit')
        .eq('id', input.userId)
        .single();
      const current = (profile as { credit: number } | null)?.credit ?? 0;
      await supabase
        .from('profiles')
        .update({ credit: Math.max(0, current - input.creditUsed) })
        .eq('id', input.userId);
    }
    return data as number;
  }
}
