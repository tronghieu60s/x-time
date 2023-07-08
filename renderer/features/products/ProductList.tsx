import { Button, Table } from "flowbite-react";
import React from "react";
import { ProductType } from "./common/types";
import { formatCurrency } from "@/core/commonFuncs";

type Props = {
  products: ProductType[];
  onDelete: (key: string) => void;
};

export default function ProductList(props: Props) {
  const { products, onDelete } = props;

  return (
    <Table>
      <Table.Head>
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Stock</Table.HeadCell>
        <Table.HeadCell>Price</Table.HeadCell>
        <Table.HeadCell>Lowest Price</Table.HeadCell>
        <Table.HeadCell>Highest Price</Table.HeadCell>
        <Table.HeadCell>Action</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {products?.map((product) => (
          <Table.Row
            key={product.itemid}
            className="bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {product.name}
            </Table.Cell>
            <Table.Cell>{product.stock}</Table.Cell>
            <Table.Cell>{formatCurrency(product.price || 0)}</Table.Cell>
            <Table.Cell>
              {formatCurrency(product.lowestPrice || product.price || 0)}
            </Table.Cell>
            <Table.Cell>
              {formatCurrency(product.highestPrice || product.price || 0)}
            </Table.Cell>
            <Table.Cell>
              <div className="flex gap-2">
                <Button size="xs" gradientDuoTone="purpleToBlue">
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
