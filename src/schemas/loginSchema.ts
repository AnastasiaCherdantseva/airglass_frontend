interface loginFormValues {
  email: string
  password: string
}

interface loginFormErrors {
  email?: { message: string }[]
  password?: { message: string }[]
}

export const resolver= (options: { values: Record<string, any> }) => {
  const values = options.values as loginFormValues
  const errors: loginFormErrors = {}

  if (!values.email) {
    errors.email = [{ message: 'Email обязателен' }];
  }
  if (!values.password) {
    errors.password = [{ message: 'Пароль обязателен' }];
  }
  // Важно: резолвер должен возвращать объект с values и errors
  return { values, errors };
};