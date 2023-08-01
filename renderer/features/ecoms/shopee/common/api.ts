import { ProductType } from '@/features/products/common/types';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { getProductInfoFromResponse, getPromotionInfoFromResponse } from '.';

const {
  SHOPEE_PROMOTIONS_URL = 'https://shopee.vn/api/v4/flash_sale/get_all_sessions',
  SHOPEE_PROMOTIONS_ALL_ITEMS_API_URL = 'https://shopee.vn/api/v4/flash_sale/get_all_itemids',
  SHOPEE_PROMOTIONS_GET_PRODUCTS_API_URL = 'https://shopee.vn/api/v4/flash_sale/flash_sale_batch_get_items',
} = process.env;


export const getPromotions = async () => {
  const promotions = await fetch(SHOPEE_PROMOTIONS_URL).then(
    async (res) => (await res.json()).data,
  );
  return getPromotionInfoFromResponse(promotions);
};

export const getProductsPromotion = async (promotionid: number) => {
  const apiPromotion = `${SHOPEE_PROMOTIONS_ALL_ITEMS_API_URL}?promotionid=${promotionid}&sort_soldout=true`;
  const promotion = await fetch(apiPromotion).then(async (res) => (await res.json()).data);

  const productIds = promotion.item_brief_list.map((item) => item.itemid);
  const productIdsChunks = _.chunk(productIds, 50);

  let products = await Promise.all(
    productIdsChunks.map(async (productIdsChunk) => {
      const body = {
        limit: 50,
        itemids: productIdsChunk,
        promotionid,
        with_dp_items: true,
      };

      const init = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      };
      const products = await fetch(SHOPEE_PROMOTIONS_GET_PRODUCTS_API_URL, init).then(
        async (res) => (await res.json()).data,
      );

      return products.items;
    }),
  );
  products = _.flatten(products);
  products = products.map((product) => ({
    key: uuidv4(),
    ...getProductInfoFromResponse(product),
    status: 'success',
  }));

  return products;
};
