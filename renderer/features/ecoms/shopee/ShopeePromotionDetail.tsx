import ProductList from '@/features/products/ProductList';
import { ProductType, PromotionType } from '@/features/products/common/types';
import { Button, Select } from 'flowbite-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ShopeeFilterType } from './common/types';
import CountdownTimer from '@/app/components/CountdownTimer';
import { filterByConditions } from '@/core/commonFuncs';

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

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  const [filterSelected, setFilterSelected] = useState(-1);
  const [promotionEndTime, setPromotionEndTime] = useState(0);
  const [promotionStartTime, setPromotionStartTime] = useState(0);

  const { page, limit } = pagination;

  useEffect(() => {
    setFilterSelected(filterGlobalSelected);
  }, [filterGlobalSelected]);

  useEffect(() => {
    onSetNumOfProducts(pagination.total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.total]);

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

  const productsData = useMemo(() => {
    const paginateProducts = products.slice((page - 1) * limit, page * limit);
    if (filterSelected === -1) return paginateProducts;

    const { values = [], children = [] } = filters[filterSelected] || {};
    const filterChildren = children?.map((child) => filters[child]?.values) || [];
    const filteredProducts = filterByConditions(paginateProducts, [
      ...values,
      ...filterChildren.flat(),
    ]);
    return filteredProducts;
  }, [filters, filterSelected, limit, page, products]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex">
          <Select value={filterSelected} onChange={(e) => onFilterChange(Number(e.target.value))}>
            {filters.map((filter, index) => (
              <option key={index} value={index}>
                {filter.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Button outline gradientDuoTone="greenToBlue">
            {currentPromotion ? 'Flash Sale' : 'Upcoming'}:{' '}
            <CountdownTimer timer={currentPromotion ? promotionEndTime : promotionStartTime} />
          </Button>
        </div>
      </div>
      <ProductList
        loading={loading}
        products={productsData}
        pagination={pagination}
        showPriceHidden
        showLowestPrice={false}
        showHighestPrice={false}
        showStatus={false}
        onView={onViewProduct}
        onPageChange={onPageChange}
      />
    </div>
  );
}
