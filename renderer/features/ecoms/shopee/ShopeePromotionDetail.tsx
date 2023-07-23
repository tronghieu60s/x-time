import ProductList from '@/features/products/ProductList';
import { ProductType, PromotionType } from '@/features/products/common/types';
import { Button, Select } from 'flowbite-react';
import { useCallback, useEffect, useState } from 'react';
import { ShopeeFilterType } from './common/types';
import CountdownTimer from '@/app/components/CountdownTimer';

type Props = {
  filters: ShopeeFilterType[];
  filterGlobalSelected: number;
  promotion: PromotionType;
  currentPromotion: boolean;
};

const apiPromotionProducts = '/api/ecoms/shopee/promotions/products';

export default function ShopeePromotionDetail(props: Props) {
  const { filters, filterGlobalSelected, promotion, currentPromotion } = props;

  const [products, setProducts] = useState<ProductType[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  const [filterSelected, setFilterSelected] = useState(-1);
  const [promotionEndTime, setPromotionEndTime] = useState(0);
  const [promotionStartTime, setPromotionStartTime] = useState(0);

  const { page, limit } = pagination;

  useEffect(() => {
    setFilterSelected(filterGlobalSelected);
  }, [filterGlobalSelected]);

  const getProducts = useCallback(() => {
    const filterChildren =
      filters[filterSelected]?.children?.map((child) => filters[child]?.values) || [];
    const filterProducts = JSON.stringify([
      ...(filters[filterSelected]?.values || []),
      ...filterChildren.flat(),
    ]);
    const apiProducts = `${apiPromotionProducts}?page=${page}&limit=${limit}&promotionid=${promotion.promotionid}&filter=${filterProducts}`;
    fetch(apiProducts)
      .then((res) => res.json())
      .then((res) => {
        if (!res.data) return;
        const {
          products,
          pagination: { total },
        } = res.data;
        setProducts(products);
        setPagination((prev) => ({ ...prev, total }));
      });
  }, [filterSelected, filters, limit, page, promotion]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

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
        products={products}
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

