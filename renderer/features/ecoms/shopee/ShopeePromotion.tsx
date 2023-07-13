import ProductList from '@/features/products/ProductList';
import { ProductType } from '@/features/products/common/types';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

const apiPromotionProducts = '/api/ecoms/shopee/promotions/products';

export default function ShopeePromotion() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const { page, limit } = pagination;

  useEffect(() => {
    const api = `${apiPromotionProducts}?page=${page}&limit=${limit}`;
    fetch(api)
      .then((res) => res.json())
      .then((res) => {
        const {
          products,
          pagination: { total },
        } = res.data;
        setProducts(products);
        setPagination((prev) => ({ ...prev, total }));
      });
  }, [page, limit]);

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

  return (
    <div className="flex flex-col gap-4">
      <ProductList
        products={products}
        pagination={pagination}
        onView={onViewProduct}
        onPageChange={onPageChange}
      />
    </div>
  );
}
