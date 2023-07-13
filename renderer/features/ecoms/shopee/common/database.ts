import { database } from '@/core/lib/firebase';
import { get, ref, update } from 'firebase/database';
import { ShopeeSettingType } from './types';

export const shopeeSettingRef = ref(database, 'settings/shopee');

export const getSettings = async (): Promise<ShopeeSettingType> => {
  return new Promise(async (resolve) => {
    get(shopeeSettingRef).then((snapshot) => {
      if (snapshot.exists()) {
        resolve(snapshot.val());
        return;
      }
      resolve({});
    });
  });
};

export const updateSetting = async (settings) => {
  return new Promise(async (resolve) => {
    update(shopeeSettingRef, settings);
    resolve(true);
  });
};
