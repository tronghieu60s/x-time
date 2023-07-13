export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

export const objectToArray = (obj: any) => {
  const arr: any = [];
  Object.keys(obj).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      arr.push({ key, ...obj[key] });
    }
  });
  return arr;
};

export const mapUniqueArray = (arr: any[]) => arr.filter((item, pos) => arr.indexOf(item) === pos);
