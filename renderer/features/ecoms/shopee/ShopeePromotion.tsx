import CountdownTimer from '@/app/components/CountdownTimer';
import { getStorageByKey, setStorageByKey } from '@/core/storage';
import { PromotionType } from '@/features/products/common/types';
import { Button, CustomFlowbiteTheme, Modal, Select, Spinner, Tabs } from 'flowbite-react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import ShopeeFilter from './ShopeeFilter';
import ShopeePromotionDetail from './ShopeePromotionDetail';
import { ShopeeFilterType } from './common/types';

const customTabTheme: CustomFlowbiteTheme['tab'] = {
  tablist: {
    tabitem: {
      styles: {
        fullWidth: {
          base: 'ml-0 w-1/2 md:w-full last:w-full rounded-none flex',
        },
      },
    },
  },
};

const filterAll = {
  id: 0,
  name: 'Tất Cả Sản Phẩm',
  values: [],
  isReadOnly: true,
};

const apiPromotions = '/api/ecoms/shopee/promotions';

export default function ShopeePromotion() {
  const [loading, setLoading] = useState(false);
  const [tabSelected, setTabSelected] = useState([0]);

  const [filters, setFilters] = useState<ShopeeFilterType[]>([]);
  const [filterSelected, setFilterSelected] = useState(-1);
  const [isShowFilter, setIsShowFilter] = useState(false);

  const [promotions, setPromotions] = useState<PromotionType[]>([]);
  const [promotionEndTime, setPromotionEndTime] = useState(0);
  const [numOfProducts, setNumOfProducts] = useState<number[]>([]);

  useEffect(() => {
    const filters = getStorageByKey('filters/shopee-promotions') || [];
    const isHasFilterAll = filters?.some((filter: any) => filter.id === 0);
    setFilters(isHasFilterAll ? filters : [filterAll, ...filters]);
  }, []);

  const getPromotions = useCallback(() => {
    setLoading(true);
    fetch(apiPromotions)
      .then((res) => res.json())
      .then((res) => {
        if (!res.data) return;
        const { endTime, sessions } = res.data;
        setPromotions(sessions);
        setPromotionEndTime(endTime);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => getPromotions(), [getPromotions]);

  const onEndTime = useCallback(() => {
    getPromotions();
    setTabSelected([0]);
  }, [getPromotions]);

  const onSwitchTabs = useCallback((event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    const target = event.target as HTMLDivElement;
    const tabIndexId = target.getAttribute('id');
    if (!tabIndexId) return;

    const tabIndex = Number(tabIndexId.split('-').pop());
    if (isNaN(tabIndex)) return;

    setTabSelected((prev) => {
      const newTabSelected = [...prev];
      if (!newTabSelected.includes(tabIndex)) newTabSelected.push(tabIndex);
      return newTabSelected;
    });
  }, []);

  const onSaveFilter = useCallback((values) => {
    const filters = values.filters.map((filter, index) => ({ ...filter, id: index }));
    setFilters(filters);
    setStorageByKey('filters/shopee-promotions', filters);
  }, []);

  const onSetNumOfProducts = useCallback((index: number, number: number) => {
    setNumOfProducts((prev) => {
      const newNumOfProducts = [...prev];
      newNumOfProducts[index] = number;
      return newNumOfProducts;
    });
  }, []);

  return (
    <div className="flex flex-col justify-center gap-4">
      <div className="flex flex-wrap justify-between items-end gap-y-4">
        <div className="w-full md:w-1/2">
          <Button gradientDuoTone="greenToBlue" onClick={() => setIsShowFilter(true)}>
            Lọc Sản Phẩm
          </Button>
        </div>
        <div className="w-full md:w-1/2 flex justify-end items-center gap-2">
          <div className="w-1/2 flex justify-end">
            <Select
              value={filterSelected}
              onChange={(e) => setFilterSelected(Number(e.target.value))}
              className="w-full md:w-auto"
            >
              {filters.map((filter, index) => (
                <option key={index} value={index}>
                  {filter.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="w-1/2 md:w-auto">
            <Button gradientDuoTone="greenToBlue" className="w-full md:w-auto">
              Sale: <CountdownTimer timer={promotionEndTime} onEnd={onEndTime} />
            </Button>
          </div>
        </div>
      </div>
      <div>
        {loading && (
          <div className="flex justify-center items-center">
            {loading && <Spinner size="sm" aria-label="Default status example" />}
            <div className="mt-1 ml-2">{loading ? 'Đang Tải Dữ Liệu' : 'Không Có Dữ Liệu'}</div>
          </div>
        )}
        <Tabs.Group
          theme={customTabTheme}
          style="fullWidth"
          onClick={onSwitchTabs}
          className="[&>div]:w-full flex flex-wrap md:flex-nowrap"
        >
          {promotions.map((promotion, index) => (
            <Tabs.Item
              key={index}
              title={`${promotion.name.replace('Key Push', '')} (${numOfProducts[index] || 0})`}
            >
              {tabSelected.includes(index) && (
                <ShopeePromotionDetail
                  filters={filters}
                  filterGlobalSelected={filterSelected}
                  promotion={promotion}
                  currentPromotion={index === 0}
                  onSetNumOfProducts={(number) => onSetNumOfProducts(index, number)}
                />
              )}
            </Tabs.Item>
          ))}
        </Tabs.Group>
        <Modal size="4xl" show={isShowFilter} dismissible onClose={() => setIsShowFilter(false)}>
          <Modal.Header>Lọc Sản Phẩm</Modal.Header>
          <Modal.Body>
            <ShopeeFilter
              filters={filters}
              onSave={onSaveFilter}
              onClose={() => setIsShowFilter(false)}
            />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
