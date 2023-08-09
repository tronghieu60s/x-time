export type CookyProductType = {
  key: string;
  itemid: number;
  image?: string;
  name: string;
  price: number;
  stock: number;
  jsonData: string;
};

export type ResponseCookyProfile = {
  id: number;
  username: string;
  signature: string;
  display_name: string;
};

export type ResponseCookyMarketProduct = {
  id: number;
  name: string;
  price: {
    unit_price: number;
  };
  photos: {
    url: string;
  }[][];
  short_description: string;
  options: {
    items: {
      id: number;
      name: string;
      is_default: boolean;
      unit_price: number;
      quantity: number;
    }[];
  }[];
  recipe_steps: {
    title: string;
    description: string;
  }[];
  product_combos: {
    id: number;
    name: string;
    price: {
      unit_price: number;
    };
  }[];
};

export type ResponseCookyRecipeProduct = {
  Id: number;
  Img: string;
  Name: string;
};
