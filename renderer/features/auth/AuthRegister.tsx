import { auth } from '@/core/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import { FormikHelpers, useFormik } from 'formik';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { initialValuesRegister } from './common/formik';

type Props = {
  onCancel: () => void;
  onSwitch: () => void;
};

export default function AuthRegister(props: Props) {
  const { onCancel, onSwitch } = props;
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(
    (values, formikHelpers: FormikHelpers<any>) => {
      const { email, password, rePassword } = values;

      if (password !== rePassword) {
        toast.error('Mật khẩu không khớp!');
        return;
      }

      setIsLoading(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          toast.success('Đăng ký thành công!');
          onSwitch();
        })
        .catch((error) => {
          const errorCode = error.code;
          if (errorCode === 'auth/invalid-email') {
            toast.error('Email không hợp lệ!');
          }
          if (errorCode === 'auth/email-already-in-use') {
            toast.error('Email đã được sử dụng!');
          }
          if (errorCode === 'auth/weak-password') {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
          }
        })
        .finally(() => {
          setIsLoading(false);
          formikHelpers.resetForm();
        });
    },
    [onSwitch],
  );

  const formikBag = useFormik({
    initialValues: initialValuesRegister,
    onSubmit,
  });

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        formikBag.handleSubmit(e);
      }}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="email" value="Email:" />
        <TextInput
          id="email"
          type="email"
          value={formikBag.values.email}
          onChange={formikBag.handleChange}
          placeholder="Email..."
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password" value="Mật khẩu:" />
        <TextInput
          id="password"
          type="password"
          value={formikBag.values.password}
          onChange={formikBag.handleChange}
          placeholder="Mật khẩu..."
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="rePassword" value="Nhập lại mật khẩu:" />
        <TextInput
          id="rePassword"
          type="password"
          value={formikBag.values.rePassword}
          onChange={formikBag.handleChange}
          placeholder="Nhập lại mật khẩu..."
          required
        />
      </div>
      <div className="w-full flex justify-between items-center pt-4">
        <p className="text-blue-600 underline cursor-pointer" onClick={onSwitch}>
          Bạn đã có tài khoản?
        </p>
        <div className="flex gap-2">
          <Button type="submit">
            {isLoading && <Spinner size="sm" />}
            {!isLoading && <span>Đăng Ký</span>}
          </Button>
          <Button color="gray" onClick={onCancel}>
            Huỷ
          </Button>
        </div>
      </div>
    </form>
  );
}
