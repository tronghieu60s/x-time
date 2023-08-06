import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { getProductMarketInfoFromResponse, getProductRecipeInfoFromResponse, getProfileInfoFromResponse } from '.';
import * as cheerio from 'cheerio';
import { objectToQueryParams } from '@/core/commonFuncs';

const {
  COOKY_PROFILE_URL = 'https://app-api.cooky.vn/api/user/get_public_profile',
  COOKY_MARKET_PRODUCTS_URL = 'https://app-api.cooky.vn/api/product/get_basic_infos',
  COOKY_MARKET_PRODUCTS_ID_URL = 'https://app-api.cooky.vn/api/product/browse_ids',
  COOKY_RECIPE_PRODUCTS_URL = 'https://www.cooky.vn/member/GetMoreRecipeList',
} = process.env;

const headers = {
  'x-cooky-app-id': '1001',
  'x-cooky-client-id': '0101',
  'x-cooky-client-type': '1',
  'x-cooky-client-version': '5.2',
};

export const getProfile = async (username: string) => {
  const body = { username };
  const init = { method: 'POST', body: JSON.stringify(body), headers };
  const profile = await fetch(COOKY_PROFILE_URL, init).then(
    async (res) => (await res.json()).reply,
  );

  return getProfileInfoFromResponse(profile);
};

export const getProductsMarket = async (id: number) => {
  const body = { designer_id: id };
  const init = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      ...headers,
      'x-cooky-seller': '4',
    },
  };
  const productIds = await fetch(COOKY_MARKET_PRODUCTS_ID_URL, init).then(
    async (res) => (await res.json()).reply.product_ids,
  );
  const productIdsChunks = _.chunk(productIds, 50);

  let products = await Promise.all(
    productIdsChunks.map(async (productIdsChunk) => {
      const body = { ids: productIdsChunk, is_flash_sale: false };
      const init = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          ...headers,
          'x-cooky-seller': '4',
        },
      };
      const products = await fetch(COOKY_MARKET_PRODUCTS_URL, init).then(
        async (res) => (await res.json()).reply,
      );
      return products.product_infos;
    }),
  );
  products = _.flatten(products);
  products = products.map((product) => ({
    key: uuidv4(),
    ...getProductMarketInfoFromResponse(product),
  }));

  return products;
};

export const getProductsMarketDetail = async (id: number) => {
  const product = await fetch(`https://cooky.vn/market/A-${id}`).then((res) => res.text());
  const $cheerio = cheerio.load(product);

  const productText = $cheerio($cheerio('script')[5]).text();
  const productJsonText = productText.substring(
    productText.indexOf('{'),
    productText.lastIndexOf('}') + 1,
  );
  const productJson = JSON.parse(productJsonText) || {};

  return getProductMarketInfoFromResponse(productJson);
};

export const getProductsRecipe = async (id: number) => {
  let lastId = 0;
  let products: any = [];
  do {
    const init = {
      userid: id,
      lastid: lastId,
      requestCount: 500,
    };
    const recipe = await fetch(`${COOKY_RECIPE_PRODUCTS_URL}?${objectToQueryParams(init)}`).then(
      async (res) => (await res.json()).data,
    );
    
    if (lastId === recipe.LastId) break;

    lastId = recipe.LastId;
    const newProducts = recipe.Items.map((product) => ({
      key: uuidv4(),
      ...getProductRecipeInfoFromResponse(product),
    }));
    products = [...products, ...newProducts];
  } while (true);

  return products;
};
