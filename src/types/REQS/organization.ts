export interface OrganizationCreateREQ{
    name:string;
    inn: string
    address: string | null
}
export interface OrganizationPatchREQ{
    name:string| null
    inn: string| null
    address: string | null
}
