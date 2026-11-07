import { Media } from "./media"

export interface Category{
    id:string
    parentId:string | null
    name:string
    code: string
    description:string|null
    sortOrder?:number
    isActive:boolean
    createdAt: Date
    updatedAt: Date
    attributeIds:string[]
    usageRoleIds:string[]
    mediaData:Media| null
}