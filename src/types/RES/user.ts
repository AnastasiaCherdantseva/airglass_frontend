import { PermissionWithConditionsRES } from "./permission";

interface UserBase{
    email:string;
    name:string;
    email_verified: boolean
}

export interface UserResponse extends UserBase{
    id:string;
}
export interface MeResponse extends UserBase{
    id:string;
    is_active:boolean;
    has_admin_access:boolean;
    permissions: PermissionWithConditionsRES[]
}

export interface UserFullResponse extends UserResponse {
  parent_id: string | null
  is_active: boolean
  children_count?: number
  role_ids: string[]
}

export interface UsersFullResponse {
  items: UserFullResponse[]
  limit: number
  total: number
  page: number
}