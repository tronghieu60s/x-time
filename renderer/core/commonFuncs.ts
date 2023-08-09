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

export const objectToQueryParams = (o = {}) => {
  return Object.entries(o)
    .map((p) => `${encodeURIComponent(p[0])}=${encodeURIComponent(String(p[1]))}`)
    .join('&');
};

export const mapUniqueArray = (arr: any[]) => {
  return arr.filter((item, pos) => arr.indexOf(item) === pos);
};

export const countdownTimer = (time: number) => {
  const currentTime = new Date().getTime();
  const distance = time - currentTime;
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return {
    hours: hours < 10 ? `0${hours}` : hours,
    minutes: minutes < 10 ? `0${minutes}` : minutes,
    seconds: seconds < 10 ? `0${seconds}` : seconds,
  };
};

export const filterByConditions = (arr: any[], conditions?: any[]) => {
  if (!conditions || conditions.length === 0) return arr;

  let newArr = [...arr];
  let newConditions = [...conditions];
  do {
    const { field, condition, value } = newConditions.shift();
    newArr = newArr.filter((item) => {
      let fieldValue = item[field];
      let compareValue = value;
      if (condition === 'equal') if (fieldValue && fieldValue === compareValue) return true;
      if (condition === 'not-equal') if (fieldValue && fieldValue !== compareValue) return true;
      if (condition === 'less-than') if (fieldValue && fieldValue < compareValue) return true;
      if (condition === 'less-than-or-equal')
        if (fieldValue && fieldValue <= compareValue) return true;
      if (condition === 'greater-than') if (fieldValue && fieldValue > compareValue) return true;
      if (condition === 'greater-than-or-equal')
        if (fieldValue && fieldValue >= compareValue) return true;
      if (condition === 'includes')
        if (fieldValue && fieldValue.toLowerCase().includes(compareValue.toLowerCase()))
          return true;
      if (condition === 'excludes')
        if (fieldValue && !fieldValue.toLowerCase().includes(compareValue.toLowerCase()))
          return true;
      return false;
    });
  } while (newConditions.length > 0);

  return newArr;
};
