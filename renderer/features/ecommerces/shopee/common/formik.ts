import { FilterType } from '@/core/types';

export type FormFilter = {
  filters: FilterType[];
};

export const initialValuesFilter: FormFilter = {
  filters: [],
};
