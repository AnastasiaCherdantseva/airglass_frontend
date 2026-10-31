

export interface RoleCreateREQ{
    name:string;
    description: string | null
    is_active: boolean
    condition_ids:string[]
}
