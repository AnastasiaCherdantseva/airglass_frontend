import {  UserCreate, UserFull } from "@/types/models";
import { UserCreateRequest } from "@/types/REQS";
import {  UserFullResponse } from "@/types/RES";

export function mapUserFullResponse2UserFull(data:UserFullResponse):UserFull{
    return{
        id:data.id,
        name:data.name,
        email:data.email,
        isActive: data.is_active,
        parentId: data.parent_id,
        roleIds:data.role_ids,
        childrenCount:data.children_count?data.children_count:null,
        emailVerified: data.email_verified
    }
}
export function mapUserCreate2UserCreateRequest(data:UserCreate):UserCreateRequest{
    return{
        name:data.name,
        email:data.email,
        role_ids:data.roleIds,
        password:data.password,
    }
}