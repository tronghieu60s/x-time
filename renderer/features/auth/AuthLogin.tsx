import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useFormik } from 'formik';
import { initialValues } from './common/formik';
import { useCallback, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/core/lib/firebase';

type Props = {
  onCancel: () => void;
};

export default function AuthLogin(props: Props) {
  const { onCancel } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const onSubmit = useCallback(
    (values) => {
      const { email, password, rePassword } = values;

      setIsLoading(true);

      if (isRegister) {
        if (password !== rePassword) {
          return;
        }

        createUserWithEmailAndPassword(auth, email, password)
          .then(() => {
            alert('Register success!');
          })
          .catch((error) => {
            alert(error.message);
          });
        setIsLoading(false);
        return;
      }

      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          alert('Login success!');
        })
        .catch((error) => {
          alert(error.message);
        });
      setIsLoading(false);
    },
    [isRegister],
  );

  const formikBag = useFormik({
    initialValues,
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
          value={formikBag.values.email}
          onChange={formikBag.handleChange}
          placeholder="Your email..."
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password" value="Password:" />
        <TextInput
          id="password"
          type="password"
          value={formikBag.values.password}
          onChange={formikBag.handleChange}
          placeholder="Your password..."
          required
        />
      </div>
      {isRegister && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="re-password" value="Re-Password:" />
          <TextInput
            id="rePassword"
            type="password"
            value={formikBag.values.rePassword}
            onChange={formikBag.handleChange}
            placeholder="Your re-password..."
            required
          />
        </div>
      )}
      <div className="w-full flex justify-between pt-4">
        <div>
          <Button onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Login' : 'Register'}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button type="submit">
            {isLoading && <Spinner size="sm" />}
            {!isLoading && <span>{isRegister ? 'Register' : 'Login'}</span>}
          </Button>
          <Button color="gray" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
