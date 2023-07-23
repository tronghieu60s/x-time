import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { useFormik } from 'formik';
import { useCallback, useEffect } from 'react';
import { initialValuesSetting } from './common/formik';
import { updateSetting } from './common/database';
import { onValue } from 'firebase/database';
import { shopeeSettingRef } from './common/database';

type Props = {
  onClose: () => void;
};

export default function ShopeeSetting(props: Props) {
  const { onClose } = props;

  const onSubmit = useCallback((values) => {
    updateSetting(values);
  }, []);

  const formikBag = useFormik({
    initialValues: initialValuesSetting,
    onSubmit,
  });

  useEffect(() => {
    onValue(shopeeSettingRef, async (snapshot) => {
      formikBag.setValues(snapshot.val() || initialValuesSetting);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        formikBag.handleSubmit(e);
      }}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="email" value="Chrome Path:" />
        <TextInput
          name="chromePath"
          value={formikBag.values.chromePath}
          onChange={formikBag.handleChange}
          placeholder="Chrome Path..."
          required
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="chromeHeadless"
          name="chromeHeadless"
          checked={formikBag.values.chromeHeadless}
          onChange={() => formikBag.setFieldValue('chromeHeadless', !formikBag.values.chromeHeadless)}
        />
        <Label htmlFor="chromeHeadless">Chrome Headless</Label>
      </div>
      <div className="w-full flex justify-between pt-4">
        <div></div>
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
