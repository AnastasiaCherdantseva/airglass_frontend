import { PermissionWithConditions } from "./permission"

export interface Role {
    id:string
    name: string
    isActive:boolean
    isSystem:boolean
}

export interface RoleFull extends Role{
    description:string | null
    ownerId:string|null
    createdAt:Date
    updatedAt:Date
    permissions: PermissionWithConditions[]

}