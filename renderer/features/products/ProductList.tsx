import { formatCurrency } from '@/core/commonFuncs';
import { Badge, Button, Pagination, Table } from 'flowbite-react';
import { getColorFromStatus, getTextFromStatus } from './common';
import { ProductType } from './common/types';
import { PaginationType } from '@/core/types';

const statusDisabled = ['pending', 'processing'];

type Props = {
  products: ProductType[];
  pagination?: PaginationType;
  showPriceHidden?: boolean;
  showLowestPrice?: boolean;
  showHighestPrice?: boolean;
  showStatus?: boolean;
  onView: (key: string) => void;
  onDelete?: (key: string) => void;
  onPageChange?: (page: number) => void;
};

export default function ProductList(props: Props) {
  const {
    products,
    pagination,
    showPriceHidden = false,
    showLowestPrice = true,
    showHighestPrice = true,
    showStatus = true,
    onView,
    onDelete,
    onPageChange,
  } = props;

  return (
    <div className="flex flex-col gap-4 w-full">
      <Table striped>
        <Table.Head>
          <Table.HeadCell style={{ width: 50 }}>STT</Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell style={{ width: 150 }}>Stock</Table.HeadCell>
          <Table.HeadCell style={{ width: 150 }}>Price</Table.HeadCell>
          <Table.HeadCell style={{ width: 150 }} hidden={!showPriceHidden}>
            Price Hidden
          </Table.HeadCell>
          <Table.HeadCell style={{ width: 150 }} hidden={!showLowestPrice}>
            Lowest Price
          </Table.HeadCell>
          <Table.HeadCell style={{ width: 150 }} hidden={!showHighestPrice}>
            Highest Price
          </Table.HeadCell>
          <Table.HeadCell style={{ width: 150 }} hidden={!showStatus}>
            Status
          </Table.HeadCell>
          <Table.HeadCell style={{ width: 150 }}>Action</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {products?.map((product, index) => (
            <Table.Row
              key={product.itemid}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell>
                {pagination ? index + 1 + (pagination.page - 1) * pagination.limit : index + 1}
              </Table.Cell>
              <Table.Cell className="whitespace-normal font-medium text-gray-900 dark:text-white">
                {product.name || '--- Unknown ---'}
              </Table.Cell>
              <Table.Cell>{product.stock || 0}</Table.Cell>
              <Table.Cell>
                {product?.priceHidden
                  ? `~ ${product.priceHidden.replaceAll('?', '9')} ₫`
                  : formatCurrency(product.price || 0)}
              </Table.Cell>
              <Table.Cell hidden={!showPriceHidden}>{product?.priceHidden || '—'} ₫</Table.Cell>
              <Table.Cell hidden={!showLowestPrice}>
                {formatCurrency(product.lowestPrice || product.price || 0)}
              </Table.Cell>
              <Table.Cell hidden={!showHighestPrice}>
                {formatCurrency(product.highestPrice || product.price || 0)}
              </Table.Cell>
              <Table.Cell hidden={!showStatus}>
                <div>
                  <Badge color={getColorFromStatus(product.status)} className="inline font-bold">
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
                    disabled={statusDisabled.includes(product.status)}
                  >
                    View
                  </Button>
                  {onDelete && (
                    <Button
                      size="xs"
                      gradientDuoTone="pinkToOrange"
                      onClick={() => onDelete(product.key)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {pagination && (
        <div className="flex justify-between items-center">
          <div>
            <p>
              Page: {pagination.page} / {pagination.total}
            </p>
          </div>
          <Pagination
            layout="navigation"
            totalPages={pagination.total}
            currentPage={pagination.page}
            onPageChange={(page) => onPageChange && onPageChange(page)}
          />
        </div>
      )}
    </div>
  );
}
