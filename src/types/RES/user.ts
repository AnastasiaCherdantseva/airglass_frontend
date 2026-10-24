import { PermissionWithConditions } from "./permission";

interface UserBase{
    email:string;
    name:string;
}

export interface UserResponse extends UserBase{
    id:string;
}
export interface MeResponse extends UserBase{
    id:string;
    is_active:boolean;
    has_admin_access:boolean;
    permissions: PermissionWithConditions[]
}