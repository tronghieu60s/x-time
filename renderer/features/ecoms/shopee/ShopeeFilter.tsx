import { Button, Label, Select, Table, Tabs, TextInput } from 'flowbite-react';
import { useFormik } from 'formik';
import { useCallback, useEffect } from 'react';
import { FormFilter, initialValuesFilter } from './common/formik';

type Props = {
  filters?: FormFilter;
  onSave: (values: FormFilter) => void;
  onClose: () => void;
};

export default function ShopeeFilter(props: Props) {
  const { filters, onSave, onClose } = props;

  useEffect(() => {
    if (!filters) return;
    formikBag.setFieldValue('filters', filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const formikBag = useFormik({
    initialValues: initialValuesFilter,
    onSubmit: onSave,
  });

  const { values, setFieldValue } = formikBag;

  const onNewFilter = useCallback(() => {
    setFieldValue('filters', [
      ...values.filters,
      { name: `Filter ${values.filters.length + 1}`, values: [] },
    ]);
  }, [setFieldValue, values.filters]);

  const onDeleteFilter = useCallback(
    (index: number) => {
      const filters = values.filters.filter((_, jIndex) => index !== jIndex);
      setFieldValue('filters', filters);
    },
    [setFieldValue, values.filters],
  );

  const onAddFilter = useCallback(
    (index: number) => {
      const filter = values.filters[index].values;
      filter.push({ field: 'name', condition: 'extends', value: '' });
      values.filters[index].values = filter;
      setFieldValue('filters', values.filters);
    },
    [setFieldValue, values.filters],
  );

  const onDeleteFilterRow = useCallback(
    (index: number, jIndex: number) => {
      const filter = values.filters[index].values.filter((_, kIndex) => jIndex !== kIndex);
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
      <Tabs.Group aria-label="Pills" style="pills">
        {values.filters.map((filter, index) => (
          <Tabs.Item key={index} title={filter.name}>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                  <Label>Filter Name</Label>
                  <TextInput
                    name={`filters[${index}].name`}
                    value={values.filters[index].name}
                    onChange={formikBag.handleChange}
                  />
                </div>
                <div></div>
              </div>
              <Table>
                <Table.Head>
                  <Table.HeadCell style={{ width: 200 }}>Field</Table.HeadCell>
                  <Table.HeadCell style={{ width: 200 }}>Condition</Table.HeadCell>
                  <Table.HeadCell>Value</Table.HeadCell>
                  <Table.HeadCell style={{ width: 150 }}>Action</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {filter.values.map((value, jIndex) => (
                    <Table.Row
                      key={jIndex}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell>
                        <Select
                          value={value.field}
                          onChange={formikBag.handleChange}
                          name={`filters[${index}].values[${jIndex}].field`}
                        >
                          <option value="name">Name</option>
                          <option value="stock">Stock</option>
                          <option value="price">Price</option>
                        </Select>
                      </Table.Cell>
                      <Table.Cell>
                        <Select
                          value={value.condition}
                          onChange={formikBag.handleChange}
                          name={`filters[${index}].values[${jIndex}].condition`}
                        >
                          <option value="equal">Equal</option>
                          <option value="not-equal">Not Equal</option>
                          <option value="not-equal">Less Than</option>
                          <option value="not-equal">Less Than & Equal</option>
                          <option value="not-equal">Greater Than</option>
                          <option value="not-equal">Greater Than & Equal</option>
                          <option value="includes">Includes</option>
                          <option value="excludes">Excludes</option>
                        </Select>
                      </Table.Cell>
                      <Table.Cell>
                        <TextInput
                          value={value.value}
                          onChange={formikBag.handleChange}
                          name={`filters[${index}].values[${jIndex}].value`}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          size="xs"
                          gradientDuoTone="pinkToOrange"
                          onClick={() => onDeleteFilterRow(index, jIndex)}
                        >
                          Delete
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
              <div className="flex justify-end gap-2">
                <Button size="sm" onClick={() => onAddFilter(index)}>
                  Add Filter
                </Button>
                <Button size="sm" color="failure" onClick={() => onDeleteFilter(index)}>
                  Delete Filter
                </Button>
              </div>
            </div>
          </Tabs.Item>
        ))}
      </Tabs.Group>
      <div className="w-full flex justify-between pt-4">
        <div className="flex gap-2">
          <Button onClick={onNewFilter}>New Filter</Button>
        </div>
        <div className="flex gap-2">
          <Button type="submit">Save</Button>
          <Button color="gray" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
