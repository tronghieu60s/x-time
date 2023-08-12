import { database } from '@/core/firebase';
import { child, get, ref, update } from 'firebase/database';

const cookyCacheMarketRef = ref(database, 'caches/cooky');

export const getCacheProductsMarket = async (id: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      get(child(cookyCacheMarketRef, `market/${id}`)).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const { timestamp, resources } = data || {};
          const diff = new Date().getTime() - timestamp;
          const diffInMinutes = Math.round(diff / 60000);
          resolve(diffInMinutes > 30 ? null : resources);
        }
        resolve(null);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const setCacheProductsMarket = async (id: number, resources: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = { timestamp: new Date().getTime(), resources };
      await update(child(cookyCacheMarketRef, `market/${id}`), data);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

export const getCacheProductsRecipe = async (id: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      get(child(cookyCacheMarketRef, `recipe/${id}`)).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const { timestamp, resources } = data || {};
          const diff = new Date().getTime() - timestamp;
          const diffInMinutes = Math.round(diff / 60000);
          resolve(diffInMinutes > 30 ? null : resources);
        }
        resolve(null);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const setCacheProductsRecipe = async (id: number, resources: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = { timestamp: new Date().getTime(), resources };
      await update(child(cookyCacheMarketRef, `recipe/${id}`), data);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};
