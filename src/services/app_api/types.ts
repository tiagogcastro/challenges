export type User = {
  name: string;
};

export type SignInData = {
  username: string;
  password: string;
};

export type SignInResponse = {
  name: string;
};

export type GetProductData = {
  query?: {
    page?: number;
    size?: number;
  }
}

export type Ingredient = {
  cost: number;
  id?: number;
  name: string;
  quantity: number;
}

export type Product = {
  id?: number;
  image: string;
  ingredients: Ingredient[];
  name: string;
  price: number;
};

export type GetProductList = {
  content: Product[];

  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean
    };
    unpaged: boolean
  };
  size: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean
  };
  totalElements: number;
  totalPages: number
};

export type SaveProductData = Product;

export type SaveProductResponse = Product;