import { ResponseShopeeProduct, ResponseShopeePromotion } from './types';

export const getProductInfoFromPath = (path: string) => {
  const [rootPath] = path.split('?');
  const pathParts = rootPath.split('.');

  const itemid = Number(pathParts.pop());
  const shopId = Number(pathParts.pop());

  return { itemid, shopId };
};

export const getProductInfoFromResponse = (response: ResponseShopeeProduct) => {
  const itemid = response.itemid;
  const shopid = response?.shopid;
  const image = response?.image;
  const name = response.name;
  const price = response.price / 100000;
  const priceHidden = response?.hidden_price_display || '';
  const stock = response.stock;
  const models = response.models?.map((model: any) => ({
    modelid: model.modelid,
    name: model.name,
    price: model.price / 100000,
    stock: model.stock,
  }));
  const variations = response.tier_variations?.map((variation: any) => ({
    name: variation.name,
    options: variation.options,
  }));
  const ratingStars = Number(response.item_rating?.rating_star?.toFixed(2) || 0);
  const jsonData = JSON.stringify(response, null, 2);

  return {
    itemid,
    shopid,
    image,
    name,
    price,
    priceHidden,
    stock,
    models,
    variations,
    ratingStars,
    jsonData,
  };
};

export const getPromotionInfoFromResponse = (response: ResponseShopeePromotion) => {
  const endTime = response.current_session_end_time;
  const sessions = response.sessions.map((session) => ({
    promotionid: session.promotionid,
    name: session.name,
    endTime: session.end_time,
    startTime: session.start_time,
    jsonData: JSON.stringify(session, null, 2),
  }));
  return { endTime, sessions };
};