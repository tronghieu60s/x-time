import Drawer from '@/app/components/Drawer';
import { Spinner } from 'flowbite-react';
import React, { useEffect, useMemo, useState } from 'react';
import { CookyProductType, ResponseCookyProduct } from './common/types';

type Props = {
  api: string;
  productSelected: CookyProductType | null;
  onClose: () => void;
};

export default function CookyFoodDetail(props: Props) {
  const { api, productSelected, onClose } = props;
  const [product, setProduct] = useState<CookyProductType | null>(null);

  useEffect(() => {
    if (!productSelected) return;

    fetch(`${api}?id=${productSelected.itemid}`)
      .then((res) => res.json())
      .then((res) => {
        if (!res.data) return;
        setProduct(res.data);
      });
  }, [api, productSelected]);

  const loading = !product;

  const productData = useMemo(() => {
    if (!product) return null;
    const productData = JSON.parse(product.jsonData) as ResponseCookyProduct;
    const options = productData.options
      .map((option) =>
        option.items
          .filter((item) => item.is_default)
          .map((item) => ({
            id: item.id,
            name: item.name,
            price: item.unit_price,
            quantity: item.quantity,
          })),
      )
      .flat();
    const shortDescription = productData.short_description;
    return { options, shortDescription };
  }, [product]);

  if (!productSelected) return null;

  return (
    <Drawer onClose={onClose} title={productSelected.name}>
      {loading && (
        <div className="flex justify-center items-center">
          {loading && <Spinner size="sm" aria-label="Default status example" />}
          <div className="mt-1 ml-2">{loading ? 'Đang Tải Dữ Liệu' : 'Không Có Dữ Liệu'}</div>
        </div>
      )}
      {productData && <div>{productData.shortDescription}</div>}
    </Drawer>
  );
}
