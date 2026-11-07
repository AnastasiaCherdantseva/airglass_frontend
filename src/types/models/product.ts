import { ProductStatus } from "../enums"
import { Media } from "./media"

export interface ProductAtribute{
    id:string
    name:string
    type:string
    value:string
}

export interface Product {
    id:string,
    name:string,
    categoryId:string
    unitId:string
    description:string|null
    usageRoleIds:string[]
    supplierIds:string[]
    variantsCount: number
    minPrice:number | null
    isActive:boolean
    status: ProductStatus
    mediaData:Media| null
}

export interface ProductVariant{
    id:string
    productId:string
    colorId:string
    materialId:string
    internalSku:string
    nameOverride:string
    isActive:string
    status:ProductStatus
    attributes:ProductAtribute[]
}