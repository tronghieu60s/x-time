import { ResponseCookyProduct, ResponseCookyProfile } from './types';

export const getProfileInfoFromResponse = (response: ResponseCookyProfile) => {
  const profileid = response.id;
  const username = response.username;
  const signature = response.signature;
  const displayName = response.display_name;
  const jsonData = JSON.stringify(response, null, 2);

  return { profileid, username, signature, displayName, jsonData };
};

export const getProductInfoFromResponse = (response: ResponseCookyProduct) => {
  const itemid = response.id;
  const image = response?.photos[0][3].url;
  const name = response.name;
  const price = response.price.unit_price;
  const jsonData = JSON.stringify(response, null, 2);

  return { itemid, image, name, price, jsonData };
};