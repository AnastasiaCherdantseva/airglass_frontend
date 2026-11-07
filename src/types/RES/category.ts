import { MediaRes } from "./media"

export interface CategoryRes{
    id: string
    parent_id: string | null
    name: string
    code: string
    description: string | null
    sort_order: number
    is_active: boolean
    created_at: Date
    updated_at: Date
    attributes_ids: string[]
    usage_role_ids: string[]
    media_data: MediaRes | null
}