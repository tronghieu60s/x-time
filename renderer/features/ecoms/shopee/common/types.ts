export type ShopeeFilterType = {
  name: string;
  values: {
    field: string;
    condition: string;
    value: string;
  }[];
};

export type ShopeeSettingType = {
  chromePath?: string;
  chromeHeadless?: boolean;
};

export type ResponseShopeeProduct = {
  itemid: number;
  shopid?: number;
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