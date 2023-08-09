import { objectToArray } from '@/core/commonFuncs';
import { Button, Label, Select, Table, Tabs, TabsRef, TextInput } from 'flowbite-react';
import { useFormik } from 'formik';
import { useCallback, useEffect, useRef } from 'react';
import { FormFilter, initialValuesFilter } from './common/formik';
import { FilterType } from '@/core/types';

type Props = {
  filters: FilterType[];
  onSave: (values: FormFilter) => void;
  onClose: () => void;
};

const filteredFields = {
  name: {
    type: 'text',
    label: 'Name',
  },
  stock: {
    type: 'number',
    label: 'Stock',
  },
  price: {
    type: 'number',
    label: 'Price',
  },
  priceHidden: {
    type: 'text',
    label: 'Price Hidden',
  },
};

const filteredCondition = {
  equal: {
    label: 'Equal',
    fields: ['text', 'number'],
  },
  'not-equal': {
    label: 'Not Equal',
    fields: ['text', 'number'],
  },
  'less-than': {
    label: 'Less Than',
    fields: ['number'],
  },
  'less-than-or-equal': {
    label: 'Less Than Or Equal',
    fields: ['number'],
  },
  'greater-than': {
    label: 'Greater Than',
    fields: ['number'],
  },
  'greater-than-or-equal': {
    label: 'Greater Than Or Equal',
    fields: ['number'],
  },
  includes: {
    label: 'Includes',
    fields: ['text'],
  },
  excludes: {
    label: 'Excludes',
    fields: ['text'],
  },
};

export default function ShopeeFilter(props: Props) {
  const { filters, onSave, onClose } = props;
  const tabsRef = useRef<TabsRef>(null);

  useEffect(() => {
    if (!filters) return;
    formikBag.setFieldValue('filters', filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const formikBag = useFormik({
    initialValues: initialValuesFilter,
    onSubmit: onSave,
  });

  const { values, handleChange, setFieldValue } = formikBag;

  const onNewFilter = useCallback(() => {
    const filters = values.filters || [];
    filters.push({ id: 0, name: `Bộ Lọc ${filters.length + 1}`, values: [] });
    setFieldValue('filters', filters);
    tabsRef.current?.setActiveTab(filters.length - 1);
  }, [setFieldValue, values.filters]);

  const onDeleteFilter = useCallback(
    (index: number) => {
      const filters = values.filters.filter((_, jIndex) => index !== jIndex);
      setFieldValue('filters', filters);
      tabsRef.current?.setActiveTab(0);
    },
    [setFieldValue, values.filters],
  );

  const onAddFilter = useCallback(
    (index: number) => {
      const filter = values.filters[index].values || [];
      filter.push({ field: 'name', condition: 'equal', value: '' });
      values.filters[index].values = filter;
      setFieldValue('filters', values.filters);
    },
    [setFieldValue, values.filters],
  );

  const onDeleteFilterRow = useCallback(
    (index: number, jIndex: number) => {
      const filter = values.filters[index].values || [];
      filter.splice(jIndex, 1);
      values.filters[index].values = filter;
      setFieldValue('filters', values.filters);
    },
    [setFieldValue, values.filters],
  );

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        formikBag.handleSubmit(e);
      }}
    >
      <Tabs.Group ref={tabsRef} style="default">
        {values.filters.map((filter, index) => (
          <Tabs.Item key={index} title={filter.name}>
            <div className="flex flex-col gap-4">
              <div className="flex items-end gap-2">
                <div className="flex flex-col gap-2">
                  <Label>Tên Bộ Lọc</Label>
                  <TextInput
                    name={`filters[${index}].name`}
                    value={values.filters[index].name}
                    onChange={handleChange}
                    disabled={filter.isReadOnly}
                  />
                </div>
              </div>
              <Table>
                <Table.Head>
                  <Table.HeadCell style={{ width: 200 }}>Field</Table.HeadCell>
                  <Table.HeadCell style={{ width: 200 }}>Condition</Table.HeadCell>
                  <Table.HeadCell>Value</Table.HeadCell>
                  <Table.HeadCell style={{ width: 150 }}>Action</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {filter.values?.map((value, jIndex) => {
                    const name = `filters[${index}].values[${jIndex}]`;
                    const type = filteredFields[value.field].type;
                    return (
                      <Table.Row
                        key={jIndex}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell>
                          <Select
                            name={`${name}.field`}
                            value={value.field}
                            onChange={(event) => {
                              handleChange(event);
                              setFieldValue(`${name}.value`, '');
                            }}
                          >
                            {objectToArray(filteredFields).map((item, index) => (
                              <option key={index} value={item.key}>
                                {item.label}
                              </option>
                            ))}
                          </Select>
                        </Table.Cell>
                        <Table.Cell>
                          <Select
                            name={`${name}.condition`}
                            value={value.condition}
                            onChange={handleChange}
                          >
                            {objectToArray(filteredCondition)
                              .filter((item) => item.fields.indexOf(type) > -1)
                              .map((item, index) => (
                                <option key={index} value={item.key}>
                                  {item.label}
                                </option>
                              ))}
                          </Select>
                        </Table.Cell>
                        <Table.Cell>
                          {type === 'text' && (
                            <TextInput
                              value={value.value}
                              onChange={handleChange}
                              name={`${name}.value`}
                            />
                          )}
                          {type === 'number' && (
                            <TextInput
                              type="number"
                              value={value.value}
                              onChange={handleChange}
                              name={`${name}.value`}
                            />
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          <Button
                            size="xs"
                            gradientDuoTone="pinkToOrange"
                            onClick={() => onDeleteFilterRow(index, jIndex)}
                          >
                            Xoá
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                  {!filter.values?.length && (
                    <Table.Row>
                      <Table.Cell colSpan={10}>
                        <div className="flex justify-center">Không Có Dữ Liệu</div>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
              {!filter.isReadOnly && (
                <div className="flex justify-between gap-2">
                  <div></div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => onAddFilter(index)}>
                      Thêm Bộ Lọc
                    </Button>
                    <Button size="sm" color="failure" onClick={() => onDeleteFilter(index)}>
                      Xoá Bộ Lọc
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Tabs.Item>
        ))}
      </Tabs.Group>
      <div className="w-full flex justify-between pt-4">
        <div className="flex gap-2">
          <Button onClick={onNewFilter}>Tạo Bộ Lọc</Button>
        </div>
        <div className="flex gap-2">
          <Button type="submit">Lưu Bộ Lọc</Button>
          <Button color="gray" onClick={onClose}>
            Huỷ
          </Button>
        </div>
      </div>
    </form>
  );
}
