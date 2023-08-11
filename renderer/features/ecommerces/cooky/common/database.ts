import { database } from '@/core/firebase';
import { get, ref, update } from 'firebase/database';

const cookyCacheMarketRef = ref(database, 'caches/cooky/market');

export const getCookyCacheMarket = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      get(cookyCacheMarketRef).then((snapshot) => {
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

export const setCookyCacheMarket = async (resources) => {
  console.log(resources);
  
  return new Promise(async (resolve, reject) => {
    try {
      const data = { timestamp: new Date().getTime(), resources };
      await update(cookyCacheMarketRef, data);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};
