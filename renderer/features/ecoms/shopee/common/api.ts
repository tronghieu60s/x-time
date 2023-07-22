import { getProducts, updateProduct } from '@/features/products/common/database';
import { ProductType } from '@/features/products/common/types';
import _ from 'lodash';
import puppeteer, { Browser } from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';
import { getProductInfoFromResponse, getPromotionInfoFromResponse } from '.';
import { getProductCart, getProductDetail, isLogin } from './crawler';
import { getSettings } from './database';

const {
  SHOPEE_URL = 'https://shopee.vn',
  SHOPEE_LOGIN_URL = 'https://shopee.vn/buyer/login',
  SHOPEE_PROMOTIONS_URL = 'https://shopee.vn/api/v4/flash_sale/get_all_sessions',
  SHOPEE_PROMOTIONS_ALL_ITEMS_API_URL = 'https://shopee.vn/api/v4/flash_sale/get_all_itemids',
  SHOPEE_PROMOTIONS_GET_PRODUCTS_API_URL = 'https://shopee.vn/api/v4/flash_sale/flash_sale_batch_get_items',
} = process.env;

const LOGIN_ALERT = 'Please login to Shopee. Using scan QR code to login for security.';

export const testLogin = async () => {
  const settings = await getSettings();

  const browser = await puppeteer.launch({
    headless: settings.chromeHeadless,
    executablePath: settings.chromePath,
    defaultViewport: null,
    userDataDir: 'full/user/data/shopee',
  });

  const page = await browser.newPage();
  await page.goto(SHOPEE_URL);

  let success = false;
  do {
    const login = await isLogin(page);
    if (login) {
      success = true;
      break;
    }

    const currentUrl = await page.evaluate(() => document.location.href);
    if (!currentUrl.includes(SHOPEE_LOGIN_URL)) {
      await page.goto(SHOPEE_LOGIN_URL);
      await page.evaluate((message) => alert(message), LOGIN_ALERT);
    }

    await page.waitForNavigation();
  } while (!success);

  await browser.close();

  return success;
};

export const syncCartProducts = async () => {
  const settings = await getSettings();

  const browser = await puppeteer.launch({
    headless: settings.chromeHeadless,
    executablePath: settings.chromePath,
    defaultViewport: null,
    userDataDir: 'full/user/data/shopee',
  });

  const products = await getProductCart(browser);
  if (products) {
    const updateProducts = products.map((product) =>
      updateProduct({ ...product, status: 'success' }),
    );
    await Promise.all(updateProducts);
  }

  await browser.close();
};

export const scanProductsDetail = async (product: ProductType, browser: Browser) => {
  const { key, itemid, shopid, models: modelsDetail = [] } = product;
  let { lowestPrice = 0, highestPrice = 0 } = product;
  const path = `${SHOPEE_URL}/A-i.${shopid}.${itemid}`;

  updateProduct({ key, status: 'processing' });

  try {
    const productDetail = await getProductDetail(path, browser);
    if (!productDetail) {
      updateProduct({
        key,
        status: 'failure',
        logs: `${new Date().toLocaleString()}\nProduct not found. Please try again later.`,
      });
      return;
    }

    const {
      itemid,
      name,
      price,
      stock,
      models: newModels,
      variations,
      ratingStars,
      jsonData,
    } = productDetail;

    const models = newModels?.map((model) => {
      const { modelid, name, price, stock } = model;
      const findModel = modelsDetail.find((model) => model.modelid === modelid);
      let { lowestPrice = 0, highestPrice = 0 } = findModel || {};

      if (!lowestPrice || price < lowestPrice) lowestPrice = price;
      if (!highestPrice || price > highestPrice) highestPrice = price;

      return {
        modelid,
        name,
        price,
        stock,
        lowestPrice,
        highestPrice,
      };
    });

    if (!lowestPrice || price < lowestPrice) lowestPrice = price;
    if (!highestPrice || price > highestPrice) highestPrice = price;

    updateProduct({
      key,
      itemid,
      name,
      price,
      stock,
      models,
      variations,
      lowestPrice,
      highestPrice,
      ratingStars,
      status: 'success',
      jsonData,
    });
  } catch (error) {
    updateProduct({
      key,
      status: 'failure',
      logs: `${new Date().toLocaleString()}\n${error}`,
    });
  }
};

export const scanProductsDetails = async () => {
  const settings = await getSettings();

  const browser = await puppeteer.launch({
    headless: settings.chromeHeadless,
    executablePath: settings.chromePath,
    defaultViewport: null,
    userDataDir: 'full/user/data/shopee',
  });

  const products = await getProducts();

  const productsChunks = _.chunk(products, 5);
  for (const productsChunk of productsChunks) {
    await Promise.all(productsChunk.map((product) => scanProductsDetail(product, browser)));
  }

  await browser.close();
};

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
