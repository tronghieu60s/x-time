export type ShopeeProductType = {
  key: string;
  itemid: number;
  shopid: number;
  image?: string;
  name: string;
  price: number;
  priceHidden?: string;
  stock: number;
  models?: ProductModelType[];
  variations?: ProductVariationType[];
  ratingStars: number;
  jsonData: string;
};

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

export type PromotionType = {
  promotionid: number;
  name: string;
  startTime: number;
  endTime: number;
};

export type ResponseShopeeProduct = {
  itemid: number;
  shopid?: number;
  image?: string;
  name: string;
  price: number;
  hidden_price_display?: string;
  stock: number;
  models?: {
    modelid: number;
    name: string;
    price: number;
    stock: number;
  }[];
  tier_variations?: {
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

export type ResponseShopeePromotion = {
  sessions: {
    promotionid: number;
    name: string;
    end_time: number;
    start_time: number;
  }[]
  current_session_end_time: number;
};