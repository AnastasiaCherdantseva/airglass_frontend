import { ProductStatus } from "../enums"

export interface ProductAtribute{
    id:string
    name:string
    type:string
    value:string
}

export interface Product {
    id:string,
    name:string,
    categoryId?:string
    unitId:string
    isActive:boolean
    status: ProductStatus
    attributeIds:string[]
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