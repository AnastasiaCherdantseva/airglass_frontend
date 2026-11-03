import { Organization } from "@/types/models";
import { OrganizationRES } from "@/types/RES";

export function mapOrganizationRES2Organization(data:OrganizationRES):Organization{
    return{
        id:data.id,
        name:data.name,
        inn:data.inn,
        address:data.address,
        ownerId:data.owner_id,
        createdAt:data.created_at,
        updatedAt:data.updated_at,
    }
}
