export type FormFilterLogin = {
  email: string;
  password: string;
};

export type FormFilterRegister = FormFilterLogin & {
  rePassword: string;
};

export const initialValuesLogin: FormFilterLogin = {
  email: '',
  password: '',
};

export const initialValuesRegister: FormFilterRegister = {
  email: '',
  password: '',
  rePassword: '',
};
