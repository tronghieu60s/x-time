import { STORAGE_LOCAL_STORAGE } from '@/const/storage';

const processInput = (input: any) => {
  if (input instanceof Date) {
    return JSON.stringify(input.getTime());
  }
  return JSON.stringify(input);
};

const processOutput = (output: any) => {
  if (output === null) {
    return output;
  }
  let result;
  try {
    result = JSON.parse(output);
  } catch (e) {
    result = output;
  }
  return result;
};

export const getStorage = () => {
  const result = localStorage.getItem(STORAGE_LOCAL_STORAGE);
  return processOutput(result);
};

export const setStorage = (resource = {}) => {
  const result = processInput(resource);
  localStorage.setItem(STORAGE_LOCAL_STORAGE, result);
};

export const getStorageByKey = (key: string) => {
  const keys = key.split('/');
  const result = getStorage();
  return result && keys.reduce((acc, cur) => acc[cur], result);
};

export const setStorageByKey = (key: string, value: any) => {
  const keys = key.split('/');
  const result = getStorage() || {};
  keys.reduce((acc, cur, index) => {
    if (index === keys.length - 1) {
      acc[cur] = value;
    } else {
      acc[cur] = acc[cur] || {};
    }
    return acc[cur];
  }, result);
  setStorage(result);
};
