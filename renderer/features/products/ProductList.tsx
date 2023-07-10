import { formatCurrency } from "@/core/commonFuncs";
import { Badge, Button, Table } from "flowbite-react";
import { getColorFromStatus, getTextFromStatus } from "./common";
import { ProductType } from "./common/types";

type Props = {
  products: ProductType[];
  onView: (key: string) => void;
  onDelete: (key: string) => void;
};

export default function ProductList(props: Props) {
  const { products, onView, onDelete } = props;

  return (
    <Table striped>
      <Table.Head>
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Stock</Table.HeadCell>
        <Table.HeadCell>Price</Table.HeadCell>
        <Table.HeadCell>Lowest Price</Table.HeadCell>
        <Table.HeadCell>Highest Price</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
        <Table.HeadCell>Action</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {products?.map((product) => (
          <Table.Row
            key={product.itemid}
            className="bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <Table.Cell className="whitespace-normal font-medium text-gray-900 dark:text-white">
              {product.name || "--- Unknown ---"}
            </Table.Cell>
            <Table.Cell>{product.stock || 0}</Table.Cell>
            <Table.Cell>{formatCurrency(product.price || 0)}</Table.Cell>
            <Table.Cell>
              {formatCurrency(product.lowestPrice || product.price || 0)}
            </Table.Cell>
            <Table.Cell>
              {formatCurrency(product.highestPrice || product.price || 0)}
            </Table.Cell>
            <Table.Cell>
              <div>
                <Badge
                  color={getColorFromStatus(product.status)}
                  className="inline font-bold"
                >
                  {getTextFromStatus(product.status)}
                </Badge>
              </div>
            </Table.Cell>
            <Table.Cell>
              <div className="flex gap-2">
                <Button
                  size="xs"
                  gradientDuoTone="purpleToBlue"
                  onClick={() => onView(product.key)}
                >
                  View
                </Button>
                <Button
                  size="xs"
                  gradientDuoTone="pinkToOrange"
                  onClick={() => onDelete(product.key)}
                >
                  Delete
                </Button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
