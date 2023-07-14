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

export const mapUniqueArray = (arr: any[]) => {
  return arr.filter((item, pos) => arr.indexOf(item) === pos);
};

export const filterByConditions = (arr: any[], conditions: any[]) => {
  let newArr = [...arr];
  do {
    const { field, condition, value } = conditions.shift();
    newArr = newArr.filter((item) => {
      if (condition === 'includes') if (item[field] && item[field].includes(value)) return true;
      if (condition === 'excludes') if (item[field] && !item[field].includes(value)) return true;
      return false;
    });
  } while (conditions.length > 0);

  return newArr;
};
