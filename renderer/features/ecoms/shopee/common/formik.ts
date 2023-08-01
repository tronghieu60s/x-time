import { ShopeeFilterType } from './types';

export const initialValues = {
  path: '',
};

export type FormFilter = {
  filters: ShopeeFilterType[];
};

export const initialValuesFilter: FormFilter = {
  filters: [],
};

