export type ProductStatusType =
  | "pending"
  | "processing"
  | "success"
  | "failure";

export type ProductModelType = {
  modelid: number;
  name: string;
  price: number;
  stock: number;
  lowestPrice?: number;
  highestPrice?: number;
  isFollow?: boolean;
};

export type ProductVariationType = {
  name: string;
  options: string[];
};

export type ProductType = {
  key: string;
  itemid: number;
  shopid: number;
  name: string;
  price: number;
  stock: number;
  models: ProductModelType[];
  variations: ProductVariationType[];
  lowestPrice?: number;
  highestPrice?: number;
  ratingStars: number;
  status: ProductStatusType;
  logs: string;
  jsonData: string;
};

export type CreateProductType = {
  itemid: number;
  shopid: number;
  name?: string;
  price?: number;
  stock?: number;
  models?: ProductModelType[];
  variations?: ProductVariationType[];
  lowestPrice?: number;
  highestPrice?: number;
  ratingStars?: number;
  status: ProductStatusType;
  logs?: string;
  jsonData?: string;
};

export type UpdateProductType = {
  name?: string;
  price?: number;
  stock?: number;
  models?: ProductModelType[];
  variations?: ProductVariationType[];
  lowestPrice?: number;
  highestPrice?: number;
  ratingStars?: number;
  status: ProductStatusType;
  logs?: string;
  jsonData?: string;
};
