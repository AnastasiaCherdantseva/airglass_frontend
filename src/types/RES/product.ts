import { ProductStatus } from "../enums"
import { MediaRes } from "./media"

export interface ProductRes {
    id:string,
    name:string,
    category_id:string
    unit_id:string
    description:string|null
    usage_role_ids:string[]
    supplier_ids:string[]
    variants_count: number
    min_price:number | null
    is_active:boolean
    status: ProductStatus
    mediaData:MediaRes| null
}