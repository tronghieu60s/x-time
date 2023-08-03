import { filterByConditions } from '@/core/commonFuncs';
import { getStorageByKey, setStorageByKey } from '@/core/storage';
import ProductList from '@/features/products/ProductList';
import { ProductType } from '@/features/products/common/types';
import { Button, Label, Modal, Select, TextInput } from 'flowbite-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Zap, ZapOff } from 'react-feather';
import { useDebouncedCallback } from 'use-debounce';
import { ShopeeFilterType } from '../shopee/common/types';
import CookyFilter from './CookyFilter';

const filterAll = {
  id: 0,
  name: 'Tất Cả Sản Phẩm',
  values: [],
  isReadOnly: true,
};

const apiProfileProducts = '/api/ecoms/cooky/profile/products';

export default function CookyFood() {
  const [search, setSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [forceRandom, setForceRandom] = useState(0);

  const [filters, setFilters] = useState<ShopeeFilterType[]>([]);
  const [filterSelected, setFilterSelected] = useState(0);
  const [isShowFilter, setIsShowFilter] = useState(false);

  const [products, setProducts] = useState<ProductType[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  const { page, limit } = pagination;

  useEffect(() => {
    const filters = getStorageByKey('filters/cooky-foods') || [];
    const isHasFilterAll = filters?.some((filter: any) => filter.id === 0);
    setFilters(isHasFilterAll ? filters : [filterAll, ...filters]);
  }, []);

  useEffect(() => {
    setLoading(true);

    fetch(`${apiProfileProducts}?id=51`)
      .then((res) => res.json())
      .then((res) => {
        if (!res.data) return;
        setProducts(res.data);
        setPagination((prev) => ({ ...prev, total: res.data.length }));
      })
      .finally(() => setLoading(false));
  }, []);

  const onSaveFilter = useCallback((values) => {
    const filters = values.filters.map((filter, index) => ({ ...filter, id: index }));
    setFilters(filters);
    setStorageByKey('filters/cooky-foods', filters);
  }, []);

  const onFilterChange = useCallback((index: number) => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setForceRandom(0);
    setFilterSelected(index);
  }, []);

  const onViewProduct = useCallback(
    (key: string) => {
      const findProduct = products.find((product) => product.key === key);
      if (!findProduct) return;

      const { itemid } = findProduct;
      window.open(`https://www.cooky.vn/market/A-${itemid}`, '_blank');
    },
    [products],
  );

  const onChangeSearch = useDebouncedCallback((value) => {
    const search: any = [];
    const searchString = value.split(';');
    const [name, price] = searchString;

    if (name) search.push({ field: 'name', condition: 'includes', value: name });
    if (price && !isNaN(Number(price)))
      search.push({ field: 'price', condition: 'equal', value: Number(price) });

    setSearch(search);
  }, 300);

  const productsData = useMemo(() => {
    let filteredProducts = products;

    if (search.length > 0) {
      filteredProducts = filterByConditions(filteredProducts, search);
    } else if (filterSelected > -1) {
      const { values = [] } = filters[filterSelected] || {};
      filteredProducts = filterByConditions(filteredProducts, values);
    }

    if (forceRandom > 0) {
      filteredProducts = filteredProducts.sort(() => Math.random() - 0.5);
    }
    const paginateProducts = filteredProducts.slice((page - 1) * limit, page * limit);

    setPagination((prev) => ({ ...prev, total: filteredProducts.length }));

    return paginateProducts;
  }, [products, forceRandom, search, filterSelected, page, limit, filters]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-between items-end">
        <div className="w-full md:w-1/2 flex gap-2">
          <Button gradientDuoTone="greenToBlue" onClick={() => setIsShowFilter(true)}>
            Lọc Món Ăn
          </Button>
          <Button gradientDuoTone="greenToBlue" onClick={() => setForceRandom(Math.random())}>
            Món Ăn Ngẫu Nhiên
          </Button>
        </div>
        <div className="w-full md:w-1/2 flex justify-end items-end gap-2">
          <div className="w-1/2 flex justify-end">
            <Select value={filterSelected} onChange={(e) => onFilterChange(Number(e.target.value))}>
              {filters.map((filter, index) => (
                <option key={index} value={index}>
                  {filter.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="w-1/2">
            <div className="mb-2 block">
              <Label htmlFor="search" value="Tìm Kiếm Món Ăn" />
            </div>
            <TextInput
              id="search"
              sizing="md"
              type="text"
              placeholder="Name;Price"
              onChange={(e) => onChangeSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <ProductList
        loading={loading}
        products={productsData}
        pagination={pagination}
        showImage
        onView={onViewProduct}
        onPageChange={(page: number) => {
          setPagination((prev) => ({ ...prev, page }));
        }}
      />
      <Modal size="4xl" show={isShowFilter} dismissible onClose={() => setIsShowFilter(false)}>
        <Modal.Header>Lọc Món Ăn</Modal.Header>
        <Modal.Body>
          <CookyFilter
            filters={filters}
            onSave={onSaveFilter}
            onClose={() => setIsShowFilter(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
