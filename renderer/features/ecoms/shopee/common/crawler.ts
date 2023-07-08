import { Browser } from "puppeteer";
import {
  ResponseShopeeCart,
  ResponseShopeeProduct,
  ResponseShopeeShopOrder,
} from "./types";
import { getProductInfoFromResponse } from ".";

const {
  SHOPEE_URL = "https://shopee.vn",
  SHOPEE_CART_API_URL = "https://shopee.vn/api/v4/cart/get",
} = process.env;

export const getCartDetail = async (browser: Browser) => {
  const page = await browser.newPage();
  await page.goto(SHOPEE_URL);

  const cartDetail: ResponseShopeeCart | null = await page.evaluate(async (apiUrl) => {
    const cartBody = {
      pre_selected_item_list: [],
      updated_time_filter: { start_time: 0 },
      version: 203,
    };
    return await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(cartBody),
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => res.data);
  }, SHOPEE_CART_API_URL);

  await page.close();

  if(!cartDetail) return null;

  return cartDetail;
};

export const getProductCart = async (browser: Browser) => {
  const cartDetail = await getCartDetail(browser);
  if(!cartDetail) return null;

  const shopOrders = cartDetail.shop_orders;
  const products = shopOrders.map((order: ResponseShopeeShopOrder) => {
    const {
      shop: { shopid },
      items,
    } = order;
    return items.map((item: ResponseShopeeProduct) => ({
      shopid,
      ...getProductInfoFromResponse(item),
    }));
  });

  return products.flat();
};

export const getProductDetail = async (path: string, browser: Browser) => {
  const rootPath = path.split("?")[0];
  const splitRootPath = rootPath.split(".");

  const page = await browser.newPage();
  await page.goto(rootPath);

  const itemId = splitRootPath.pop();
  const shopId = splitRootPath.pop();

  const product: ResponseShopeeProduct | null = await new Promise((resolve) => {
    page.on("response", async (response) => {
      const url = response.url();
      if (url.includes(`?shopid=${shopId}&itemid=${itemId}`)) {
        resolve((await response.json()).data);
      }
      setTimeout(() => resolve(null), 5000);
    });
  });

  await page.close();

  if (!product) return null;

  return getProductInfoFromResponse(product);
};
