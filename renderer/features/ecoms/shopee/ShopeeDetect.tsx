import ProductList from '@/features/products/ProductList';
import ProductListDetail from '@/features/products/ProductListDetail';
import { deleteProduct, productsRef, updateProduct } from '@/features/products/common/database';
import { ProductType } from '@/features/products/common/types';
import { Button, TextInput } from 'flowbite-react';
import { useFormik } from 'formik';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { initialValues } from './common/formik';
import { onValue } from 'firebase/database';
import { objectToArray } from '@/core/commonFuncs';

const apiSyncCart = '/api/ecoms/shopee/cart/sync';
const apiProducts = '/api/ecoms/shopee/products';
const apiScanProducts = '/api/ecoms/shopee/products/scan';

export default function ShopeeDetect() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [productKeySelected, setProductKeySelected] = useState<string | null>(null);

  useEffect(() => {
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val() || [];
      const products = objectToArray(data).reverse();      
      setProducts(products);
      setPagination((prev) => ({ ...prev, total: products.length }));
    });
  }, []);

  const { page, limit } = pagination;

  const formikBag = useFormik({
    initialValues,
    onSubmit: () => {},
  });

  const { values, setFieldValue } = formikBag;

  const onSyncCart = useCallback(() => {
    fetch(apiSyncCart, { method: 'POST' }).then((res) => {
      console.log(res);
    });
  }, []);

  const onScanProducts = useCallback(() => {
    fetch(apiScanProducts, { method: 'PATCH' }).then((res) => {
      console.log(res);
    });
  }, []);

  const onAddProduct = useCallback(async () => {
    const { path } = values;
    setFieldValue('path', '');

    const rootPath = path.split('?')[0];
    const splitRootPath = rootPath.split('.');
    const itemid = Number(splitRootPath.pop() || 0);
    const shopid = Number(splitRootPath.pop() || 0);

    await updateProduct({ itemid, shopid, status: 'pending' });
  }, [values, setFieldValue]);

  const onViewProduct = useCallback((key: string) => {
    setProductKeySelected(key);
  }, []);

  const onDeleteProduct = useCallback((key: string) => {
    deleteProduct(key);
  }, []);

  const onPageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const productSelected = useMemo(
    () => products.find((product) => product.key === productKeySelected),
    [products, productKeySelected],
  );

  const onFollowProductModel = useCallback(
    (model: string) => {
      if (!productSelected) return;

      const { key, models = [] } = productSelected || {};
      const findModeIndex = models.findIndex((selected) => selected.name === model);
      if (findModeIndex === -1) return;

      if (!models[findModeIndex].isFollow) {
        models[findModeIndex].isFollow = true;
        updateProduct({ key, models, status: 'success' });
      }
    },
    [productSelected],
  );

  const onUnFollowProductModel = useCallback(
    (model: string) => {
      if (!productSelected) return;

      const { key, models = [] } = productSelected || {};
      const findModeIndex = models.findIndex((selected) => selected.name === model);

      if (findModeIndex === -1) return;

      if (models[findModeIndex].isFollow) {
        models[findModeIndex].isFollow = false;
        updateProduct({ key, models, status: 'success' });
      }
    },
    [productSelected],
  );

  const productsData = useMemo(() => {
    const paginateProducts = products.slice((page - 1) * limit, page * limit);
    return paginateProducts;
  }, [products, page, limit]);

  return (
    <div className="flex flex-col gap-4">
      <form className="flex justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onSyncCart}>Sync Cart</Button>
          <Button onClick={onScanProducts}>Scan Products</Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <TextInput
              type="text"
              name="path"
              value={formikBag.values.path}
              onChange={formikBag.handleChange}
              placeholder="Link Product..."
            />
            <Button size="sm" onClick={onAddProduct}>
              Add Product
            </Button>
          </div>
        </div>
      </form>
      <ProductList
        products={productsData}
        pagination={pagination}
        onView={onViewProduct}
        onDelete={onDeleteProduct}
        onPageChange={onPageChange}
      />
      <ProductListDetail
        product={productSelected}
        onClose={() => setProductKeySelected(null)}
        onFollowProductModel={onFollowProductModel}
        onUnFollowProductModel={onUnFollowProductModel}
      />
    </div>
  );
}
