export type Product = {
  productId: string;
  productName: string;
  productImage?: string;
  quantity?: number;
  price?: number;
};

export type OrderProps = {
  name: string;
  address: string;
  phone: string;
  note?: string;
  status?: string;
  products: Product[];
  createdAt?: Date;
  updatedAt?: Date;
};
