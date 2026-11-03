import { OrganizationCreate } from "@/types/models"

export interface createFormErrors {
  name?: { message: string }[]
  inn?: { message: string }[]
  address?: { message: string }[]
}

export const resolver = (options: { values: Record<string, any> }) => {
  const values = options.values as OrganizationCreate
  const errors: createFormErrors = {}

  if (!values.name || !String(values.name).trim()) {
    errors.name = [{ message: 'Введите название организации' }]
  }
  if (!values.inn || !String(values.inn).trim() ) {
    errors.inn = [{ message: 'Введите ИНН' }]
  }
  else if((values.inn).trim().length!==12)(
    errors.inn = [{ message: 'ИНН состоит из 12 цифр' }]
  )
  return { values, errors }
}