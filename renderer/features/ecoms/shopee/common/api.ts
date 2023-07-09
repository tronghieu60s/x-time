import {
  getProducts,
  updateProduct,
} from "@/features/products/common/database";
import puppeteer from "puppeteer";
import { getProductCart, getProductDetail, isLogin } from "./crawler";
import _ from "lodash";

const {
  SHOPEE_URL = "https://shopee.vn",
  SHOPEE_LOGIN_URL = "https://shopee.vn/buyer/login",
} = process.env;

const LOGIN_ALERT =
  "Please login to Shopee. Using scan QR code to login for security.";

const browserShopee = puppeteer.launch({
  headless: false,
  defaultViewport: null,
  userDataDir: "full/user/data/shopee",
});

export const testLogin = async () => {
  const browser = await browserShopee;
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
  const browser = await browserShopee;

  const products = await getProductCart(browser);
  if (products) {
    const updateProducts = products.map((product) =>
      updateProduct({ ...product, status: "success" })
    );
    await Promise.all(updateProducts);
  }

  await browser.close();
};

export const updateProductsDetail = async () => {
  const browser = await browserShopee;

  const products = await getProducts();

  const productsChunks = _.chunk(products, 5);
  for (const productsChunk of productsChunks) {
    await Promise.all(
      productsChunk.map(async (product) => {
        if (!browser) {
          return null;
        }
        const { key, itemid, shopid, models: modelsDetail } = product;
        let { lowestPrice = 0, highestPrice = 0 } = product;
        const path = `${SHOPEE_URL}/A-i.${shopid}.${itemid}`;

        updateProduct({ key, status: "processing" });

        try {
          const productDetail = await getProductDetail(path, browser);

          if (!productDetail) {
            updateProduct({
              key,
              status: "failure",
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

          const models = newModels.map((model) => {
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
            status: "success",
            jsonData,
          });
        } catch (error) {
          updateProduct({
            key,
            status: "failure",
            logs: `${new Date().toLocaleString()}\n${error}`,
          });
        }
      })
    );
  }

  await browser.close();
};
