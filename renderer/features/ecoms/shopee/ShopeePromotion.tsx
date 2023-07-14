import { countdownTimer } from '@/core/commonFuncs';
import ProductList from '@/features/products/ProductList';
import { ProductType, PromotionType } from '@/features/products/common/types';
import { Button, Label, ListGroup, Radio, Select } from 'flowbite-react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const apiPromotions = '/api/ecoms/shopee/promotions';
const apiPromotionProducts = '/api/ecoms/shopee/promotions/products';

export default function ShopeePromotion() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [promotions, setPromotions] = useState<PromotionType[]>([]);
  const [promotionEndTime, setPromotionEndTime] = useState(0);
  const [promotionSelected, setPromotionSelected] = useState(0);

  const { page, limit } = pagination;

  useEffect(() => {
    const timer = setInterval(() => {
      setPromotionEndTime((prev) => prev - 1);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch(apiPromotions)
      .then((res) => res.json())
      .then((res) => {
        if (!res.data) return;
        const { endTime, sessions } = res.data;
        const promotionSelected = sessions[0].promotionid;
        setPromotions(sessions);
        setPromotionEndTime(endTime);
        setPromotionSelected(promotionSelected);
      });
  }, []);

  useEffect(() => {
    if (!promotionSelected) return;

    fetch(`${apiPromotionProducts}?page=${page}&limit=${limit}&promotionid=${promotionSelected}`)
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
  }, [page, limit, promotionSelected]);

  const onPageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const onViewProduct = useCallback(
    (key: string) => {
      const findProduct = products.find((product) => product.key === key);
      if (!findProduct) return;

      const { itemid, shopid } = findProduct;
      router.push(`https://shopee.vn/A-i.${shopid}.${itemid}`);
    },
    [products, router],
  );

  const onSwitchPromotion = useCallback((id: number) => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setPromotionSelected(id);
  }, []);

  const countdown = useMemo(() => {
    if(!promotionEndTime) return '00:00:00';
    const timer = countdownTimer(promotionEndTime * 1000);
    return `${timer.hours}:${timer.minutes}:${timer.seconds}`;
  }, [promotionEndTime]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-2">
        <div className="flex items-center gap-4"></div>
        <div className="flex items-center gap-4">
          <Button gradientDuoTone="purpleToBlue">Flash Sale: {countdown}</Button>
        </div>
      </div>
      <div className="flex gap-2">
        {promotions.map((promotion) => (
          <Button
            key={promotion.promotionid}
            outline={promotion.promotionid !== promotionSelected}
            onClick={() => onSwitchPromotion(promotion.promotionid)}
            className="basis-1/5"
            gradientDuoTone="purpleToBlue"
          >
            <p>{promotion.name.replace('Flash Sale', '').replace('Key Push', '')}</p>
          </Button>
        ))}
      </div>
      <ProductList
        products={products}
        pagination={pagination}
        showLowestPrice={false}
        showHighestPrice={false}
        showStatus={false}
        onView={onViewProduct}
        onPageChange={onPageChange}
      />
    </div>
  );
}
