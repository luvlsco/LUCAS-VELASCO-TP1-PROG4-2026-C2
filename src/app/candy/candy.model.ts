export interface CandyCategory {
  id: number;
  name: string;
}

export interface CandyProduct {
  id: number;
  name: string;
  price: number;
  category_id: number | null;
}

export interface Combo {
  id: number;
  name: string;
  price: number;
  items: string;
}

export function candyTotal(items: { price: number }[]): number {
  return items.reduce((acc, item) => acc + item.price, 0);
}
