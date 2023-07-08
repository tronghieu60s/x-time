import { objectToArray } from '@/core/commonFuncs';
import ProductList from '@/features/products/ProductList'
import { deleteProduct, productsRef } from '@/features/products/common/database';
import { ProductType } from '@/features/products/common/types';
import { onValue } from 'firebase/database';
import React, { useCallback, useEffect, useState } from 'react'

export default function ShopeeHome() {
  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    onValue(productsRef, async (snapshot) => {
      const data = objectToArray(snapshot.val() || {});
      setProducts(data.reverse());
    });
  }, []);

  const onDeleteProduct = useCallback((key: string) => {
    deleteProduct(key);
  }, []);

  return (
    <div>
      <ProductList products={products} onDelete={onDeleteProduct} />
    </div>
  )
}
