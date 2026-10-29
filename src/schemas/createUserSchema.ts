import { UserCreate } from "@/types/models"


export interface createUserFormErrors {
  email?: { message: string }[]
  name?: { message: string }[]
  password?: { message: string }[]
  roleIds?: { message: string }[]
}

export const resolver= (options: { values: Record<string, any> }) => {
  const values = options.values as UserCreate
  const errors: createUserFormErrors = {}

  if (!values.email || values.email.length<6) {
    errors.email = [{ message: 'Некорректный email' }];
  }
  if (!values.password || values.password.length<8) {
    errors.password = [{ message: 'Минимум 8 символов' }];
  }
  if (!values.roleIds || values.password.length<1) {
    errors.roleIds = [{ message: 'Выберите хотя бы одну роль' }];
  }
  if (!values.name) {
    errors.name = [{ message: 'Введите имя' }];
  }
  return { values, errors };
};