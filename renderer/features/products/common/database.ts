import { objectToArray } from "@/core/commonFuncs";
import { database } from "@/core/lib/firebase";
import {
  child,
  equalTo,
  get,
  orderByChild,
  push,
  query,
  ref,
  set,
  update,
} from "firebase/database";
import { ProductType, UpdateProductType } from "./types";

export const productsRef = ref(database, "products");

export const getProducts = async (): Promise<ProductType[]> => {
  return new Promise(async (resolve) => {
    const products = await get(productsRef);
    if (!products.exists()) {
      resolve([]);
      return;
    }

    const data = objectToArray(products.val() || {});
    resolve(data.reverse());
  });
};

export const updateProduct = async (product: UpdateProductType) => {
  const { key } = product;
  return new Promise(async (resolve) => {
    if (key) {
      update(child(productsRef, key), product);
      resolve(true);
      return;
    }

    const { itemid } = product;
    if (itemid) {
      const productRef = await get(
        query(productsRef, orderByChild("itemid"), equalTo(itemid))
      );
      if (productRef.exists()) {
        resolve(false);
        return;
      }

      push(productsRef, product);
      resolve(true);
      return;
    }

    resolve(false);
  });
};

export const deleteProduct = async (key: string) => {
  return new Promise((resolve) => {
    set(child(productsRef, key), null);
    resolve(true);
  });
};
