import {  newRole, RoleFull, } from "@/types/models";
import {  RoleDetailResponse, } from "@/types/RES";
import { mapPermissionWithConditionsRES2Model } from "./permission";
import { RoleCreateREQ } from "@/types/REQS";

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
export function mapNewRole2RoleCreateREQ(data:newRole):RoleCreateREQ{
    return{
        name:data.name,
        description: data.description,
        is_active: data.isActive,
        condition_ids: data.conditionIds
    }
}