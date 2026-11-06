export interface CategoryMediaRes{
     id: string
    storage_key: string
    original_filename: string
    mime_type: string
    file_size: number
    width: number | null
    height: number | null
    created_by: string | null
    created_at: Date
    updated_at: Date
}