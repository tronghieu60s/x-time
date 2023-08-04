import { Button, Label, Select, TextInput } from 'flowbite-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CountdownTimer from '@/app/components/CountdownTimer';
import { filterByConditions } from '@/core/commonFuncs';
import { useDebouncedCallback } from 'use-debounce';
import { FilterType } from '@/core/types';
import { PromotionType, ShopeeProductType } from './common/types';
import ShopeeListProduct from './ShopeeListProduct';

type Props = {
  filters: FilterType[];
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
  const [filterSelected, setFilterSelected] = useState(0);

  const [products, setProducts] = useState<ShopeeProductType[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [numOfProducts, setNumOfProducts] = useState(0);

  const [promotionEndTime, setPromotionEndTime] = useState(0);
  const [promotionStartTime, setPromotionStartTime] = useState(0);

  const { page, limit } = pagination;

  useEffect(() => {
    if (numOfProducts) {
      onSetNumOfProducts(numOfProducts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numOfProducts]);

  useEffect(() => {
    if (filterGlobalSelected > -1) {
      setFilterSelected(filterGlobalSelected);
    }
  }, [filterGlobalSelected]);

  useEffect(() => {
    setLoading(true);

    fetch(`${apiPromotionProducts}?id=${promotion.promotionid}`)
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

  const onChangeFilter = useCallback((index: number) => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setFilterSelected(index);
  }, []);

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
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, 300);

  const onViewProduct = useCallback(
    (key: string) => {
      const findProduct = products.find((product) => product.key === key);
      if (!findProduct) return;

      const { itemid, shopid } = findProduct;
      window.open(`https://shopee.vn/A-i.${shopid}.${itemid}`, '_blank');
    },
    [products],
  );

  const productsData = useMemo(() => {
    let filteredProducts = products;

    if (search.length > 0) {
      filteredProducts = filterByConditions(filteredProducts, search);
    } else if (filterSelected > -1) {
      const { values = [] } = filters[filterSelected] || {};
      filteredProducts = filterByConditions(filteredProducts, values);
    }
    const paginateProducts = filteredProducts.slice((page - 1) * limit, page * limit);

    setPagination((prev) => ({ ...prev, total: filteredProducts.length }));
    setNumOfProducts(filteredProducts.length);

    return paginateProducts;
  }, [products, search, filterSelected, page, limit, filters]);

  return (
    <div className="flex flex-col justify-center gap-4">
      <div className="flex flex-wrap justify-between items-end gap-y-4">
        <div className="w-full md:w-1/2">
          <Button outline gradientDuoTone="greenToBlue" className="w-full md:w-auto">
            {currentPromotion ? 'Flash Sale' : 'Upcoming'}:{' '}
            <CountdownTimer timer={currentPromotion ? promotionEndTime : promotionStartTime} />
          </Button>
        </div>
        <div className="w-full md:w-1/2 flex justify-end items-end gap-2">
          <div className="w-1/2 flex justify-end">
            <Select
              value={filterSelected}
              onChange={(e) => onChangeFilter(Number(e.target.value))}
              className="w-full md:w-auto"
            >
              {filters.map((filter, index) => (
                <option key={index} value={index}>
                  {filter.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="w-1/2 flex flex-col gap-2">
            <Label htmlFor="search" value="Tìm Kiếm Sản Phẩm" />
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
      <div>
        <ShopeeListProduct
          loading={loading}
          products={productsData}
          pagination={pagination}
          showStock
          showPrice={currentPromotion}
          showImage
          showPriceHidden={!currentPromotion}
          onView={onViewProduct}
          onPageChange={(page: number) => {
            setPagination((prev) => ({ ...prev, page }));
          }}
        />
      </div>
    </div>
  );
}
