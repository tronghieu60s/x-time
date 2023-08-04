export type FilterType = {
  id: number;
  name: string;
  values?: {
    field: string;
    condition: string;
    value: string;
  }[];
  isReadOnly?: boolean;
};

export type PaginationType = {
  page: number;
  limit: number;
  total: number;
};