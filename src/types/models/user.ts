export interface User {
    id: string;
    name: string;
    email:string;
    isActive:boolean
    emailVerified: boolean
}
export interface UserFull extends User {
    parentId:string | null;
    roleIds: string[];
    childrenCount: number | null
}
export interface UserCreate {
    email: string
    name: string
    password: string
    roleIds: string[]
}