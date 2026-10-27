import { PermissionWithConditions } from "@/types/models";
import { PermissionWithConditionsRES } from "@/types/RES";

export function mapPermissionWithConditionsRES2Model(data:PermissionWithConditionsRES):PermissionWithConditions{
    return{
        id:data.id,
        code:data.code,
        conditions: data.conditions.map(c=>({
            id:c.id,             
            permissionId:c.permission_id,
            type:c.type,
            // effect: c.effect,
            isActive:c.is_active,
            categoryId:c.category_id,
            mediaTypeId:c.media_type_id,
            roleId:c.role_id
        }))
    }
}