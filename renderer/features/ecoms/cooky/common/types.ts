export type CookyFilterType = {
  id: number;
  name: string;
  values?: {
    field: string;
    condition: string;
    value: string;
  }[];
  isReadOnly?: boolean;
};

export type ResponseCookyProfile = {
  id: number;
  username: string;
  signature: string;
  display_name: string;
};

export type ResponseCookyProduct = {
  id: number;
  name: string;
  price: {
    unit_price: number;
  };
  photos: {
    url: string;
  }[][];
};
