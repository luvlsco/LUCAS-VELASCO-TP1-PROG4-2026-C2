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
