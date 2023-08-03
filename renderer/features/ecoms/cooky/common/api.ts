import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { getProductInfoFromResponse, getProfileInfoFromResponse } from '.';
import * as cheerio from 'cheerio';

const {
  COOKIE_PROFILE_URL = 'https://app-api.cooky.vn/api/user/get_public_profile',
  COOKIE_PROFILE_PRODUCTS_URL = 'https://app-api.cooky.vn/api/product/get_basic_infos',
  COOKIE_PROFILE_PRODUCTS_ID_URL = 'https://app-api.cooky.vn/api/product/browse_ids',
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
  const profile = await fetch(COOKIE_PROFILE_URL, init).then(
    async (res) => (await res.json()).reply,
  );

  return getProfileInfoFromResponse(profile);
};

export const getProductsProfile = async (id: number) => {
  const body = { designer_id: id };
  const init = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      ...headers,
      'x-cooky-seller': '4',
    },
  };
  const productIds = await fetch(COOKIE_PROFILE_PRODUCTS_ID_URL, init).then(
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
      const products = await fetch(COOKIE_PROFILE_PRODUCTS_URL, init).then(
        async (res) => (await res.json()).reply,
      );
      return products.product_infos;
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

export const getProductsMarketDetail = async (id: number) => {
  const product = await fetch(`https://cooky.vn/market/A-${id}`).then((res) => res.text());
  const $cheerio = cheerio.load(product);
  const productText = $cheerio($cheerio('script')[5]).text();
  const productJsonText = productText.substring(
    productText.indexOf('{'),
    productText.lastIndexOf('}') + 1,
  );
  const productJson = JSON.parse(productJsonText) || {};
  return getProductInfoFromResponse(productJson);
};
