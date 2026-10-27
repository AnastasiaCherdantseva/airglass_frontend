export interface UserCreateRequest {
  email: string
  name: string
  password: string
  role_ids: string[]
}