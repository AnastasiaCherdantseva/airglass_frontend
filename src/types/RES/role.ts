import { PermissionWithConditionsRES } from "./permission";

interface RoleBase{
    name:string;
    description: string | null
    is_active: boolean
    owner_id: string
}

export interface RoleResponse extends RoleBase{
    id:string;
    is_system:boolean;
}
export interface RoleDetailResponse extends RoleResponse{
    permissions: PermissionWithConditionsRES[]
    created_at:Date;
    updated_at:Date;
}
