import { newRole } from "@/types/models"

export interface createRoleFormErrors {
  name?: { message: string }[]
  description?: { message: string }[]
}

export const resolver = (options: { values: Record<string, any> }) => {
  const values = options.values as newRole
  const errors: createRoleFormErrors = {}

  if (!values.name || !String(values.name).trim()) {
    errors.name = [{ message: 'Введите название роли' }]
  }
  return { values, errors }
}