
export type CartItem = {
  productId: string;
  productName: string;
  productImage?: string;     // optional
  quantity?: number;         // optional
  price?: number;            // optional
};

// If used as an array
export type CartItemArray = CartItem[];
