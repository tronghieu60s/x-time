import { formatCurrency } from '@/core/commonFuncs';
import { PaginationType } from '@/core/types';
import {
  Avatar,
  Badge,
  Button,
  CustomFlowbiteTheme,
  Modal,
  Pagination,
  Spinner,
  Table,
} from 'flowbite-react';
import { useState } from 'react';
import { CookyProductType } from './common/types';

const customTableTheme: CustomFlowbiteTheme['table'] = {
  root: {
    wrapper: 'relative overflow-x-auto',
  },
};

type Props = {
  loading?: boolean;
  products: CookyProductType[];
  pagination?: PaginationType;
  showStock?: boolean;
  showPrice?: boolean;
  showImage?: boolean;
  onView: (key: string) => void;
  onDelete?: (key: string) => void;
  onPageChange?: (page: number) => void;
};

export default function CookyListProduct(props: Props) {
  const {
    loading,
    products,
    pagination,
    showStock = false,
    showPrice = true,
    showImage = false,
    onView,
    onDelete,
    onPageChange,
  } = props;
  const [previewImage, setPreviewImage] = useState('');

  return (
    <div className="flex flex-col gap-4">
      <Table striped theme={customTableTheme}>
        <Table.Head>
          <Table.HeadCell className="w-20" hidden={!showImage}></Table.HeadCell>
          <Table.HeadCell className="w-10">STT</Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell className="w-10" hidden={!showStock}>
            Stock
          </Table.HeadCell>
          <Table.HeadCell className="w-32" hidden={!showPrice}>
            Price
          </Table.HeadCell>
          <Table.HeadCell className="w-20">Action</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {products?.map((product, index) => (
            <Table.Row
              key={product.itemid}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell hidden={!showImage}>
                <Avatar
                  img={product.image}
                  onClick={() => setPreviewImage(product.image || '')}
                  className="w-10"
                />
              </Table.Cell>
              <Table.Cell>
                {pagination ? index + 1 + (pagination.page - 1) * pagination.limit : index + 1}
              </Table.Cell>
              <Table.Cell className="whitespace-normal font-medium text-gray-900 dark:text-white">
                {product.name}
              </Table.Cell>
              <Table.Cell hidden={!showStock}>{product.stock || 0}</Table.Cell>
              <Table.Cell hidden={!showPrice}>{formatCurrency(product.price || 0)}</Table.Cell>
              <Table.Cell>
                <div className="flex gap-2">
                  <Button
                    size="xs"
                    gradientDuoTone="purpleToBlue"
                    onClick={() => onView(product.key)}
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
          {!products.length && (
            <Table.Row>
              <Table.Cell colSpan={10}>
                <div className="flex justify-center items-center">
                  {loading && <Spinner size="sm" aria-label="Default status example" />}
                  <div className="mt-1 ml-2">
                    {loading ? 'Đang Tải Dữ Liệu' : 'Không Có Dữ Liệu'}
                  </div>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      {pagination && (
        <div className="flex justify-between items-center">
          <div>
            <p className="text-base">
              Page: {pagination.page} / {Math.ceil(pagination.total / pagination.limit) || 1}
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
      <Modal show={!!previewImage} dismissible onClose={() => setPreviewImage('')}>
        <Modal.Body>
          <div className="flex justify-center items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewImage} alt="Preview Image" />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
