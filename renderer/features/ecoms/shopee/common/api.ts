import puppeteer from "puppeteer";
import { getProductCart } from "./crawler";
import { createProduct } from "@/features/products/common/database";

export const syncCartProducts = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "full/user/data/shopee",
  });

  const products = await getProductCart(browser);
  if (products) {
    await Promise.all(
      products.map((product) => {
        createProduct({ ...product, status: "success" });
      })
    );
  }

  await browser.close();
};
