import { ShopeeFilterType } from './types';

export const initialValues = {
  path: '',
};

export type FormFilter = {
  filters: ShopeeFilterType[];
};

export const initialValuesFilter: FormFilter = {
  filters: [
    {
      name: 'Filter 1',
      values: [
        {
          field: 'name',
          condition: 'extends',
          value: 'Filter 1',
        },
      ],
    },
  ],
};

export const initialValuesSetting = {
  chromePath: '',
  chromeHeadless: true,
};
