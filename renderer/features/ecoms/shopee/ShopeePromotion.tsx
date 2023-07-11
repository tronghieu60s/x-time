import ProductList from "@/features/products/ProductList";
import { ProductType } from "@/features/products/common/types";
import React, { useCallback, useEffect, useState } from "react";

export default function ShopeePromotion() {
  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    (async () => {
      const products = await fetch("/api/ecoms/shopee/products/promotion").then((res) =>
        res.json()
      );
      setProducts(products.data);
    })();
  }, []);

  const onViewProduct = useCallback((key: string) => {}, []);

  console.log(products);

  return (
    <div className="flex flex-col gap-4">
      <ProductList products={products} onView={onViewProduct} />
    </div>
  );
}
