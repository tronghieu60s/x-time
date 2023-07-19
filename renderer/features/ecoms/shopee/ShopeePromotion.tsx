import CountdownTimer from '@/app/components/CountdownTimer';
import ProductList from '@/features/products/ProductList';
import { ProductType, PromotionType } from '@/features/products/common/types';
import { child, onValue } from 'firebase/database';
import { Button, Modal, Select } from 'flowbite-react';
import { useCallback, useEffect, useState } from 'react';
import ShopeeFilter from './ShopeeFilter';
import { filterSettingRef, updateFilters } from './common/database';
import { ShopeeFilterType } from './common/types';

const apiPromotions = '/api/ecoms/shopee/promotions';
const apiPromotionProducts = '/api/ecoms/shopee/promotions/products';

export default function ShopeePromotion() {
  const [filters, setFilters] = useState<ShopeeFilterType[]>([]);
  const [filterSelected, setFilterSelected] = useState(-1);
  const [isShowFilter, setIsShowFilter] = useState(false);

  const [products, setProducts] = useState<ProductType[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [promotions, setPromotions] = useState<PromotionType[]>([]);
  const [promotionEndTime, setPromotionEndTime] = useState(0);
  const [promotionSelected, setPromotionSelected] = useState(0);

  const { page, limit } = pagination;

  useEffect(() => {
    onValue(child(filterSettingRef, 'promotion'), async (snapshot) => {
      setFilters(snapshot.val());
    });
  }, []);

  const getProducts = useCallback(() => {
    if (!promotionSelected) return;

    const filterParams = JSON.stringify(filters[filterSelected]?.values || []);
    const apiProducts = `${apiPromotionProducts}?page=${page}&limit=${limit}&promotionid=${promotionSelected}&filter=${filterParams}`;
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
  }, [filterSelected, filters, limit, page, promotionSelected]);

  const getPromotions = useCallback(() => {
    fetch(apiPromotions)
      .then((res) => res.json())
      .then((res) => {
        if (!res.data) return;
        const { endTime, sessions } = res.data;
        setPromotions(sessions);
        setPromotionEndTime(endTime);
        setPromotionSelected(sessions[0].promotionid);
      });
  }, []);

  useEffect(() => {
    getPromotions();
  }, [getPromotions]);

  useEffect(() => {
    if (!promotionSelected) return;
    getProducts();
  }, [getProducts, promotionSelected]);

  const onSaveFilter = useCallback(
    (values) => {
      updateFilters('promotion', values.filters);
      getProducts();
    },
    [getProducts],
  );

  const onPageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const onFilterChange = useCallback((index: number) => {
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

  const onSwitchPromotion = useCallback((id: number) => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setPromotionSelected(id);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          <Button gradientDuoTone="greenToBlue">
            Sale: <CountdownTimer timer={promotionEndTime} onEnd={getPromotions} />
          </Button>
          {promotions.map((promotion) => (
            <Button
              key={promotion.promotionid}
              outline={promotion.promotionid !== promotionSelected}
              onClick={() => onSwitchPromotion(promotion.promotionid)}
              className="w-60"
              gradientDuoTone="purpleToBlue"
            >
              <p>{promotion.name.replace('Flash Sale', '').replace('Key Push', '')}</p>
            </Button>
          ))}
        </div>
        <div className="flex flex-col gap-4 w-full">
          <form className="flex justify-between gap-2">
            <div className="flex items-center gap-4">
              <Button gradientDuoTone="purpleToPink" onClick={() => setIsShowFilter(true)}>
                Filter Products
              </Button>
              <Select onChange={(e) => onFilterChange(Number(e.target.value))}>
                <option value={-1}>All</option>
                {filters.map((filter, index) => (
                  <option key={index} value={index}>
                    {filter.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"></div>
            </div>
          </form>
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
      </div>
      <Modal size="4xl" show={isShowFilter} onClose={() => setIsShowFilter(false)}>
        <Modal.Header>Filter Products</Modal.Header>
        <Modal.Body>
          <ShopeeFilter
            filters={filters}
            onSave={onSaveFilter}
            onClose={() => setIsShowFilter(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
