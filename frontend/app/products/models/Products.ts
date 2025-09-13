export type ProductProps = {
  _id : string
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
};

export type ProductResponse = {
  data: {
    data: ProductProps[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
};


export type ProductListResponse = {
  data: {
    product: ProductProps[];
  };
};
