import ProductList from '@/features/products/ProductList';
import { ProductType, PromotionType } from '@/features/products/common/types';
import { Button, Label, Select, TextInput } from 'flowbite-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ShopeeFilterType } from './common/types';
import CountdownTimer from '@/app/components/CountdownTimer';
import { filterByConditions } from '@/core/commonFuncs';
import { useDebouncedCallback } from 'use-debounce';

type Props = {
  filters: ShopeeFilterType[];
  filterGlobalSelected: number;
  promotion: PromotionType;
  currentPromotion: boolean;
  onSetNumOfProducts: (numOfProducts: number) => void;
};

const apiPromotionProducts = '/api/ecoms/shopee/promotions/products';

export default function ShopeePromotionDetail(props: Props) {
  const { filters, filterGlobalSelected, promotion, currentPromotion, onSetNumOfProducts } = props;

  const [search, setSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [filterSelected, setFilterSelected] = useState(0);

  const [products, setProducts] = useState<ProductType[]>([]);
  const [promotionEndTime, setPromotionEndTime] = useState(0);
  const [promotionStartTime, setPromotionStartTime] = useState(0);

  const { page, limit } = pagination;

  useEffect(() => {
    if (filterGlobalSelected > -1) {
      setFilterSelected(filterGlobalSelected);
    }
  }, [filterGlobalSelected]);

  useEffect(() => {
    setLoading(true);

    fetch(`${apiPromotionProducts}?promotionid=${promotion.promotionid}`)
      .then((res) => res.json())
      .then((res) => {
        if (!res.data) return;
        setProducts(res.data);
        setPagination((prev) => ({ ...prev, total: res.data.length }));
      })
      .finally(() => setLoading(false));
  }, [promotion.promotionid]);

  useEffect(() => {
    setPromotionEndTime(promotion.endTime);
    setPromotionStartTime(promotion.startTime);
  }, [promotion]);

  const onPageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const onFilterChange = useCallback((index: number) => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setFilterSelected(index);
  }, []);

  const onViewProduct = useCallback(
    (key: string) => {
      const findProduct = products.find((product) => product.key === key);
      if (!findProduct) return;

      const { itemid, shopid } = findProduct;
      window.open(`https://shopee.vn/A-i.${shopid}.${itemid}`, '_blank');
    },
    [products],
  );

  const onChangeSearch = useDebouncedCallback((value) => {
    const search: any = [];
    const searchString = value.split(';');
    const [name, stock, price, priceHidden] = searchString;

    if (name) search.push({ field: 'name', condition: 'includes', value: name });
    if (stock && !isNaN(Number(stock)))
      search.push({ field: 'stock', condition: 'equal', value: Number(stock) });
    if (price && !isNaN(Number(price)))
      search.push({ field: 'price', condition: 'equal', value: Number(price) });
    if (priceHidden) search.push({ field: 'priceHidden', condition: 'equal', value: priceHidden });

    setSearch(search);
  }, 300);

  const productsData = useMemo(() => {
    let filteredProducts = products;
    if (search.length > 0) {
      filteredProducts = filterByConditions(products, search);
    } else if (filterSelected > -1) {
      const { values = [], children = [] } = filters[filterSelected] || {};
      const filterChildren = children.map((child) => filters[child].values) || [];
      filteredProducts = filterByConditions(products, [...values, ...filterChildren.flat()]);
    }
    const paginateProducts = filteredProducts.slice((page - 1) * limit, page * limit);
    setPagination((prev) => ({ ...prev, total: filteredProducts.length }));
    onSetNumOfProducts(filteredProducts.length);
    return paginateProducts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, search, filterSelected, page, limit, filters]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-between items-end">
        <div className="w-full md:w-1/2 flex">
          <Button outline gradientDuoTone="greenToBlue">
            {currentPromotion ? 'Flash Sale' : 'Upcoming'}:{' '}
            <CountdownTimer timer={currentPromotion ? promotionEndTime : promotionStartTime} />
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
              <Label htmlFor="search" value="Search Products" />
            </div>
            <TextInput
              id="search"
              sizing="md"
              type="text"
              placeholder="Name;Stock;Price;PriceHidden"
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
        showPrice={currentPromotion}
        showPriceHidden={!currentPromotion}
        showLowestPrice={false}
        showHighestPrice={false}
        showStatus={false}
        onView={onViewProduct}
        onPageChange={onPageChange}
      />
    </div>
  );
}

