export type ResponseShopeeProduct = {
  itemid: number;
  name: string;
  price: number;
  stock: number;
  models: {
    modelid: number;
    name: string;
    price: number;
    stock: number;
  }[];
  tier_variations: {
    name: string;
    options: string[];
  }[];
  item_rating?: {
    rating_star: number;
  };
};

export type ResponseShopeeShopOrder = {
  shop: {
    shopid: number;
  };
  items: ResponseShopeeProduct[];
};

export type ResponseShopeeCart = {
  shop_orders: ResponseShopeeShopOrder[];
};
