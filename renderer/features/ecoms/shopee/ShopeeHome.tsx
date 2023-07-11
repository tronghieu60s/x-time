import { objectToArray } from "@/core/commonFuncs";
import ProductList from "@/features/products/ProductList";
import {
  deleteProduct,
  productsRef,
  updateProduct,
} from "@/features/products/common/database";
import { ProductType } from "@/features/products/common/types";
import { onValue } from "firebase/database";
import { Button, Modal, TextInput } from "flowbite-react";
import { useFormik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import { initialValues } from "./common/formik";
import ProductListDetail from "@/features/products/ProductListDetail";
import { Settings } from "react-feather";
import ShopeeSetting from "./ShopeeSetting";

export default function ShopeeHome() {
  const [isLogged, setIsLogged] = useState(false);
  const [isShowSetting, setIsShowSetting] = useState(false);
  const [clickedLogin, setClickedLogin] = useState(false);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [productKeySelected, setProductKeySelected] = useState<string | null>(
    null
  );

  useEffect(() => {
    onValue(productsRef, async (snapshot) => {
      const data = objectToArray(snapshot.val() || {});
      setProducts(data.reverse());
    });
  }, []);

  const formikBag = useFormik({
    initialValues,
    onSubmit: () => {},
  });

  const onSyncCart = useCallback(() => {
    fetch("/api/ecoms/shopee/cart/sync", { method: "POST" }).then((res) => {
      console.log(res);
    });
  }, []);

  const onScanProducts = useCallback(() => {
    fetch("/api/ecoms/shopee/products/scan", { method: "PATCH" }).then(
      (res) => {
        console.log(res);
      }
    );
  }, []);

  const onTestLogin = useCallback(() => {
    fetch("/api/ecoms/shopee/auth/test-login", { method: "POST" })
      .then((res) => res.json())
      .then((res) => {
        const { logged = false } = res;
        setIsLogged(logged);
        setClickedLogin(true);
      });
  }, []);

  const onAddProduct = useCallback(async () => {
    const { path } = formikBag.values;
    formikBag.setFieldValue("path", "");

    const rootPath = path.split("?")[0];
    const splitRootPath = rootPath.split(".");
    const itemid = Number(splitRootPath.pop() || 0);
    const shopid = Number(splitRootPath.pop() || 0);

    await updateProduct({ itemid, shopid, status: "pending" });
  }, [formikBag]);

  const onViewProduct = useCallback((key: string) => {
    setProductKeySelected(key);
  }, []);

  const onDeleteProduct = useCallback((key: string) => {
    deleteProduct(key);
  }, []);

  const productSelected = useMemo(
    () => products.find((product) => product.key === productKeySelected),
    [products, productKeySelected]
  );

  const onFollowProductModel = useCallback(
    (model: string) => {
      if (!productSelected) return;

      const { key, models = [] } = productSelected || {};
      const findModeIndex = models.findIndex(
        (selected) => selected.name === model
      );
      if (findModeIndex === -1) return;

      if (!models[findModeIndex].isFollow) {
        models[findModeIndex].isFollow = true;
        updateProduct({ key, models, status: "success" });
      }
    },
    [productSelected]
  );

  const onUnFollowProductModel = useCallback(
    (model: string) => {
      if (!productSelected) return;

      const { key, models = [] } = productSelected || {};
      const findModeIndex = models.findIndex(
        (selected) => selected.name === model
      );

      if (findModeIndex === -1) return;

      if (models[findModeIndex].isFollow) {
        models[findModeIndex].isFollow = false;
        updateProduct({ key, models, status: "success" });
      }
    },
    [productSelected]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-2">
        <div className="flex items-center gap-4">
          <Button size="sm" onClick={onTestLogin} outline={clickedLogin}>
            {clickedLogin ? (isLogged ? "Logged" : "Not Logged") : "Test Login"}
          </Button>
          <Button size="sm" onClick={onSyncCart}>
            Sync Cart
          </Button>
          <Button size="sm" onClick={onScanProducts}>
            Scan Products
          </Button>
        </div>
        <form className="flex items-center gap-4">
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
            <Button size="sm" onClick={() => setIsShowSetting(true)}>
              <Settings size={20} />
            </Button>
          </div>
        </form>
      </div>
      <ProductList
        products={products}
        onView={onViewProduct}
        onDelete={onDeleteProduct}
      />
      <ProductListDetail
        product={productSelected}
        onClose={() => setProductKeySelected(null)}
        onFollowProductModel={onFollowProductModel}
        onUnFollowProductModel={onUnFollowProductModel}
      />
      <Modal show={isShowSetting} onClose={() => setIsShowSetting(false)}>
        <Modal.Header>Settings</Modal.Header>
        <Modal.Body>
          <ShopeeSetting onClose={() => setIsShowSetting(false)} />
        </Modal.Body>
      </Modal>
    </div>
  );
}
