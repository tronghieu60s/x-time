import { database } from '@/core/lib/firebase';
import { child, get, ref, update } from 'firebase/database';
import { ShopeeFilterType, ShopeeSettingType } from './types';

export const shopeeSettingRef = ref(database, 'settings/shopee');
export const filterSettingRef = ref(database, 'settings/shopee/filters');

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

export const getFilters = async (key: string): Promise<ShopeeFilterType> => {
  return new Promise(async (resolve) => {
    get(child(filterSettingRef, key)).then((snapshot) => {
      if (snapshot.exists()) {
        resolve(snapshot.val());
        return;
      }
      resolve({} as ShopeeFilterType);
    });
  });
};

export const updateFilters = async (key: string, filters: ShopeeFilterType[]) => {
  return new Promise(async (resolve) => {
    update(filterSettingRef, { [key]: filters });
    resolve(true);
  });
};

