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
import { CreateProductType, ProductType, UpdateProductType } from "./types";
import { objectToArray } from "@/core/commonFuncs";

export const productsRef = ref(database, "products");

export const getProducts = async (): Promise<ProductType[]> => {
  return new Promise(async (resolve) => {
    const products = await get(productsRef);
    if (!products.exists()) resolve([]);

    const data = objectToArray(products.val() || {});
    resolve(data.reverse());
  });
};

export const createProduct = async (
  product: CreateProductType
): Promise<boolean> => {
  const { itemid } = product;
  return new Promise(async (resolve) => {
    const productRef = await get(
      query(productsRef, orderByChild("itemid"), equalTo(itemid))
    );
    if (productRef.exists()) resolve(false);

    push(productsRef, product);
    resolve(true);
  });
};

export const updateProduct = async (
  key: string,
  product: UpdateProductType
): Promise<boolean> => {
  return new Promise((resolve) => {
    update(child(productsRef, key), product);
    resolve(true);
  });
};

export const deleteProduct = async (key: string): Promise<boolean> => {
  return new Promise((resolve) => {
    set(child(productsRef, key), null);
    resolve(true);
  });
};
