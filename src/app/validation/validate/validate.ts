import { Component, inject, signal } from '@angular/core';
import { supabase } from '../../services/supabase.client';
import { AuthService } from '../../services/auth.service';
import { BookingStore } from '../../services/booking-store';
import { CatalogStore } from '../../services/catalog-store';

type Concept = 'sala' | 'candy';

interface LoadedTicket {
  id: number;
  seat: string;
  sala_used: boolean;
  candy_used: boolean;
}

@Component({
  selector: 'app-validate',
  imports: [],
  templateUrl: './validate.html',
})
export class Validate {
  protected readonly booking = inject(BookingStore);
  protected readonly catalog = inject(CatalogStore);
  private readonly auth = inject(AuthService);

  protected code = signal('');
  protected purchaseId = signal<number | null>(null);
  protected tickets = signal<LoadedTicket[]>([]);
  protected error = signal<string | null>(null);
  protected message = signal<string | null>(null);
  protected saving = signal(false);

  protected setCode(value: string): void {
    this.code.set(value);
  }

  protected used(concept: Concept): boolean | null {
    const tickets = this.tickets();
    if (tickets.length === 0) return null;
    return tickets.every((t) => (concept === 'sala' ? t.sala_used : t.candy_used));
  }

  protected async lookup(): Promise<void> {
    const match = this.code().trim().match(/^cine:(\d+)$/);
    if (!match) {
      this.error.set('Código inválido. Formato: cine:{id}');
      return;
    }
    const id = Number(match[1]);
    this.error.set(null);
    this.message.set(null);
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('id, seat, sala_used, candy_used')
      .eq('purchase_id', id);
    if (error) {
      this.error.set(error.message);
      return;
    }
    if (!tickets || tickets.length === 0) {
      this.error.set('Sin entradas para ese código.');
      return;
    }
    this.purchaseId.set(id);
    this.tickets.set(tickets as LoadedTicket[]);
  }

  protected async validate(concept: Concept): Promise<void> {
    const purchaseId = this.purchaseId();
    if (purchaseId === null || this.saving()) return;
    const flag = concept === 'sala' ? 'sala_used' : 'candy_used';
    this.saving.set(true);
    this.error.set(null);
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ [flag]: true })
        .eq('purchase_id', purchaseId)
        .eq(flag, false);
      if (error) throw new Error(error.message);
      await supabase.from('validations_log').insert({
        purchase_id: purchaseId,
        concept,
        employee_id: this.auth.session()?.user.id ?? null,
      });
      this.tickets.update((list) => list.map((t) => ({ ...t, [flag]: true })));
      this.message.set(concept === 'sala' ? 'Ingreso validado.' : 'Candy entregado.');
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'No se pudo validar.');
    } finally {
      this.saving.set(false);
    }
  }
}
