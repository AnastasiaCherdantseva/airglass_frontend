import {  RoleFull, } from "@/types/models";
import {  RoleDetailResponse, } from "@/types/RES";
import { mapPermissionWithConditionsRES2Model } from "./permission";

export function mapRoleResponse2RoleFull(data:RoleDetailResponse):RoleFull{
    return{
        id:data.id,
        name:data.name,
        description: data.description,
        isActive: data.is_active,
        isSystem: data.is_system,
        ownerId:data.owner_id,
        createdAt:data.created_at,
        updatedAt:data.updated_at,
        permissions: data.permissions.map(p=>mapPermissionWithConditionsRES2Model(p))
    }
}