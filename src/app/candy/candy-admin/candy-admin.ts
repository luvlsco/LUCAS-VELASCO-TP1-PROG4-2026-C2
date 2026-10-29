import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormField, FormRoot, form, min, required } from '@angular/forms/signals';
import { supabase } from '../../services/supabase.client';
import { CandyCategory, CandyProduct } from '../candy.model';

@Component({
  selector: 'app-candy-admin',
  imports: [FormField, FormRoot, RouterLink],
  templateUrl: './candy-admin.html',
})
export class CandyAdmin {
  protected categories = signal<CandyCategory[]>([]);
  protected products = signal<CandyProduct[]>([]);
  protected error = signal<string | null>(null);
  protected categoryName = signal('');

  protected draft = signal({ name: '', price: 0, categoryId: 0 });

  protected productForm = form(this.draft, (f) => {
    required(f.name, { message: 'El nombre es obligatorio' });
    min(f.price, 1, { message: 'Mínimo 1' });
  });

  constructor() {
    void this.load();
  }

  protected categoryNameOf(id: number | null): string {
    return this.categories().find((c) => c.id === id)?.name ?? '—';
  }

  protected setField(field: 'name' | 'price' | 'categoryId', value: string): void {
    this.draft.update((d) => ({
      ...d,
      [field]: field === 'name' ? value : Number(value),
    }));
  }

  protected setCategoryName(value: string): void {
    this.categoryName.set(value);
  }

  protected async load(): Promise<void> {
    const [{ data: categories }, { data: products }] = await Promise.all([
      supabase.from('candy_categories').select('id, name').order('name'),
      supabase.from('candy_products').select('id, name, price, category_id').order('name'),
    ]);
    this.categories.set((categories as CandyCategory[]) ?? []);
    this.products.set((products as CandyProduct[]) ?? []);
  }

  protected async addCategory(): Promise<void> {
    const name = this.categoryName().trim();
    if (!name) return;
    const { error } = await supabase.from('candy_categories').insert({ name });
    if (error) this.error.set(error.message);
    else {
      this.categoryName.set('');
      await this.load();
    }
  }

  protected async addProduct(): Promise<void> {
    if (!this.productForm().valid()) return;
    const d = this.draft();
    const { error } = await supabase
      .from('candy_products')
      .insert({ name: d.name, price: d.price, category_id: d.categoryId || null });
    if (error) this.error.set(error.message);
    else {
      this.draft.set({ name: '', price: 0, categoryId: 0 });
      await this.load();
    }
  }

  protected async removeProduct(id: number): Promise<void> {
    const { error } = await supabase.from('candy_products').delete().eq('id', id);
    if (error) this.error.set(error.message);
    else await this.load();
  }
}
