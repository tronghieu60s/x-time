import { ResponseCookyMarketProduct, ResponseCookyProfile, ResponseCookyRecipeProduct } from './types';

export const getProfileInfoFromResponse = (response: ResponseCookyProfile) => {
  const profileid = response.id;
  const username = response.username;
  const signature = response.signature;
  const displayName = response.display_name;
  const jsonData = JSON.stringify(response, null, 2);

  return { profileid, username, signature, displayName, jsonData };
};

export const getProductMarketInfoFromResponse = (response: ResponseCookyMarketProduct) => {
  const itemid = response.id;
  const image = response?.photos[0][3].url;
  const name = response.name;
  const price = response.price.unit_price;
  const jsonData = JSON.stringify(response, null, 2);

  return { itemid, image, name, price, jsonData };
};

export const getProductRecipeInfoFromResponse = (response: ResponseCookyRecipeProduct) => {
  const itemid = response.Id;
  const image = response?.Img;
  const name = response.Name;
  const jsonData = JSON.stringify(response, null, 2);

  return { itemid, image, name, jsonData };
};