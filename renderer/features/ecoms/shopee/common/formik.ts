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
      id: 0,
      name: 'Filter 1',
      values: [
        {
          field: 'name',
          condition: 'equal',
          value: 'Filter 1',
        },
      ],
      children: [],
      isReadOnly: false,
    },
  ],
};

export const initialValuesSetting = {
  chromePath: '',
  chromeHeadless: true,
};
