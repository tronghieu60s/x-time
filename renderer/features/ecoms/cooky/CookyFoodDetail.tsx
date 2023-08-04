import Drawer from '@/app/components/Drawer';
import { CustomFlowbiteTheme, Spinner, Table } from 'flowbite-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CookyProductType, ResponseCookyProduct } from './common/types';
import { formatCurrency } from '@/core/commonFuncs';

const customTableTheme: CustomFlowbiteTheme['table'] = {
  root: {
    shadow: '',
  },
};

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

  const onCloseDrawer = useCallback(() => {
    setProduct(null);
    onClose();
  }, [onClose]);

  const productData = useMemo(() => {
    if (!product) return null;
    const productData = JSON.parse(product.jsonData) as ResponseCookyProduct;

    const price = productData.price.unit_price;
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
    const recipeSteps = productData.recipe_steps.map((step) => ({
      title: step.title,
      description: step.description,
    }));
    const productCombos = productData.product_combos.map((combo) => ({
      id: combo.id,
      name: combo.name,
      price: combo.price.unit_price,
    }));

    return {
      price,
      options,
      shortDescription,
      recipeSteps,
      productCombos,
    };
  }, [product]);

  const loading = !product;
  if (!productSelected) return null;

  return (
    <Drawer title={productSelected.name} onClose={onCloseDrawer}>
      {loading && (
        <div className="flex justify-center items-center">
          {loading && <Spinner size="sm" aria-label="Default status example" />}
          <div className="mt-1 ml-2">{loading ? 'Đang Tải Dữ Liệu' : 'Không Có Dữ Liệu'}</div>
        </div>
      )}
      {productData && (
        <div className="flex flex-col gap-4">
          <div>
            Giá: <strong>{formatCurrency(productData.price || 0)}</strong>
          </div>
          {/* <div className="flex flex-col gap-2">
            {productData.recipeSteps.map((step) => (
              <div key={step.title}>
                <div className="font-bold">{step.title}</div>
                <div>{step.description}</div>
              </div>
            ))}
          </div> */}
          <div hidden={!productData.shortDescription}>{productData.shortDescription}</div>
          <Table theme={customTableTheme} striped hidden={!productData?.options.length}>
            <Table.Head>
              <Table.HeadCell>Model</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>Quantity</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {productData?.options.map((option) => (
                <Table.Row
                  key={option.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {option.name}
                  </Table.Cell>
                  <Table.Cell>{formatCurrency(option.price || 0)}</Table.Cell>
                  <Table.Cell>{option.quantity}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <Table theme={customTableTheme} striped hidden={!productData?.productCombos.length}>
            <Table.Head>
              <Table.HeadCell>Model</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {productData?.productCombos.map((combo) => (
                <Table.Row
                  key={combo.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {combo.name}
                  </Table.Cell>
                  <Table.Cell>{formatCurrency(combo.price || 0)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </Drawer>
  );
}
