import CountdownTimer from '@/app/components/CountdownTimer';
import { PromotionType } from '@/features/products/common/types';
import { child, onValue } from 'firebase/database';
import { Button, CustomFlowbiteTheme, Modal, Select, Tabs } from 'flowbite-react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import ShopeeFilter from './ShopeeFilter';
import ShopeePromotionDetail from './ShopeePromotionDetail';
import { filterSettingRef, updateFilters } from './common/database';
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

const filterAll = { id: 0, name: 'All Products', values: [], isReadOnly: true };
const apiPromotions = '/api/ecoms/shopee/promotions';

export default function ShopeePromotion() {
  const [filters, setFilters] = useState<ShopeeFilterType[]>([]);
  const [filterSelected, setFilterSelected] = useState(-1);
  const [isShowFilter, setIsShowFilter] = useState(false);

  const [tabSelected, setTabSelected] = useState([0]);

  const [promotions, setPromotions] = useState<PromotionType[]>([]);
  const [promotionEndTime, setPromotionEndTime] = useState(0);
  const [numOfProducts, setNumOfProducts] = useState<number[]>([]);

  useEffect(() => {
    onValue(child(filterSettingRef, 'promotion'), async (snapshot) => {
      const filters = snapshot.val() || [];
      const isHasFilterAll = filters?.some((filter: any) => filter.id === 0);
      if (!isHasFilterAll) {
        setFilters([filterAll, ...filters]);
        return;
      }
      setFilters(snapshot.val());
    });
  }, []);

  const getPromotions = useCallback(() => {
    fetch(apiPromotions)
      .then((res) => res.json())
      .then((res) => {
        if (!res.data) return;
        const { endTime, sessions } = res.data;
        setPromotions(sessions);
        setPromotionEndTime(endTime);
      });
  }, []);

  useEffect(() => {
    getPromotions();
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
    updateFilters('promotion', filters);
  }, []);

  const onFilterChange = useCallback((index: number) => {
    setFilterSelected(index);
  }, []);

  const onSetNumOfProducts = useCallback((index: number, number: number) => {
    setNumOfProducts((prev) => {
      const newNumOfProducts = [...prev];
      newNumOfProducts[index] = number;
      return newNumOfProducts;
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div>
          <Button gradientDuoTone="purpleToPink" onClick={() => setIsShowFilter(true)}>
            Filter Products
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap justify-between items-end">
        <div className="flex">
          <Select onChange={(e) => onFilterChange(Number(e.target.value))}>
            {filters.map((filter, index) => (
              <option key={index} value={index}>
                {filter.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Button gradientDuoTone="greenToBlue">
            Sale: <CountdownTimer timer={promotionEndTime} onEnd={getPromotions} />
          </Button>
        </div>
      </div>
      <Tabs.Group
        style="fullWidth"
        onClick={onSwitchTabs}
        className="[&>div]:w-full flex flex-wrap md:flex-nowrap"
        theme={customTabTheme}
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

