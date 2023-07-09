import Drawer from "@/app/flowbite/Drawer";
import { formatCurrency } from "@/core/commonFuncs";
import {
  Badge,
  Button,
  CustomFlowbiteTheme,
  Label,
  Radio,
  Table,
  Textarea,
} from "flowbite-react";
import { useFormik } from "formik";
import { getColorFromStatus, getTextFromStatus } from "./common";
import { initialValues } from "./common/formik";
import { ProductType } from "./common/types";
import { useCallback, useEffect } from "react";

const customTableTheme: CustomFlowbiteTheme["table"] = {
  root: {
    shadow: "",
  },
};

type Props = {
  onClose: () => void;
  product?: ProductType;
  onFollowProductModel: (model: string) => void;
  onUnFollowProductModel: (modelid: string) => void;
};

export default function ProductListDetail(props: Props) {
  const { product, onClose, onFollowProductModel, onUnFollowProductModel } = props;

  const formikBag = useFormik({
    initialValues,
    onSubmit: () => {},
  });

  useEffect(() => {
    if (product?.models) {
      formikBag.setFieldValue("model", []);
    }
  }, [product?.models]);

  const onFollowModel = useCallback(() => {
    const { model } = formikBag.values;
    if (model.length !== product?.variations.length) return;

    onFollowProductModel(model.join(","));
  }, [formikBag.values]);

  const onUnFollowModel = useCallback((model: string) => {
    onUnFollowProductModel(model);
  }, []);

  if (!product) return null;

  return (
    <Drawer open={!!product} onClose={onClose} title="Product Information">
      <form className="grid grid-cols-2 gap-4 mb-6 text-base text-gray-800">
        <div>
          <div className="mb-3">
            <Badge
              color={getColorFromStatus(product.status)}
              className="inline font-bold"
            >
              {getTextFromStatus(product.status)}
            </Badge>
          </div>
          <div>
            Name: <strong>{product.name || "--- Unknown ---"}</strong>
          </div>
          <div>
            Stock: <strong>{product.stock || 0}</strong>
          </div>
          <div>Rating: {product.ratingStars || 0} ⭐</div>
          <div>Price: {formatCurrency(product.price || 0)}</div>
          <div>
            Lowest Price:{" "}
            {formatCurrency(product.lowestPrice || product.price || 0)}
          </div>
          <div>
            Highest Price:{" "}
            {formatCurrency(product.highestPrice || product.price || 0)}
          </div>
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="logs" value="Logs" />
          </div>
          <Textarea
            id="logs"
            rows={6}
            value={product.logs}
            placeholder="Logs..."
            readOnly
          />
        </div>
        <div className="grid grid-cols-2 gap-4 col-span-2">
          <div className="col-span-2">
            <div className="flex gap-4">
              {product.variations.map((variation, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div>{variation.name}:</div>
                  <div className="flex flex-wrap gap-2">
                    {variation.options.map((option, jIndex) => (
                      <div
                        key={jIndex}
                        className="flex items-center gap-2 mr-4"
                      >
                        <Radio
                          id={`model-${index}-${jIndex}`}
                          name={`model-${index}`}
                          value={formikBag.values.model[`${index}`]}
                          onChange={() => {
                            formikBag.setFieldValue(`model[${index}]`, option);
                          }}
                        />
                        <Label htmlFor={`model-${index}-${jIndex}`}>
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Button
              size="sm"
              gradientDuoTone="purpleToBlue"
              className="mt-5"
              onClick={onFollowModel}
              disabled={product.models.length === 0}
            >
              Add Model
            </Button>
          </div>
          <div className="col-span-2">
            <div className="relative">
              <Table theme={customTableTheme} striped>
                <Table.Head>
                  <Table.HeadCell>Model</Table.HeadCell>
                  <Table.HeadCell>Stock</Table.HeadCell>
                  <Table.HeadCell>Price</Table.HeadCell>
                  <Table.HeadCell>Lowest Price</Table.HeadCell>
                  <Table.HeadCell>Highest Price</Table.HeadCell>
                  <Table.HeadCell>Action</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {product.models
                    ?.filter((model) => model.isFollow)
                    .map((model) => (
                      <Table.Row
                        key={model.modelid}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {model.name || "--- Unknown ---"}
                        </Table.Cell>
                        <Table.Cell>{model.stock || 0}</Table.Cell>
                        <Table.Cell>
                          {formatCurrency(model.price || 0)}
                        </Table.Cell>
                        <Table.Cell>
                          {formatCurrency(
                            model.lowestPrice || model.price || 0
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          {formatCurrency(
                            model.highestPrice || model.price || 0
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex gap-2">
                            <Button
                              size="xs"
                              gradientDuoTone="pinkToOrange"
                              onClick={() => onUnFollowModel(model.name)}
                            >
                              Delete
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </form>
    </Drawer>
  );
}
