import type {  CategoryMedia } from '@/types/models'
import { CategoryMediaRes } from '@/types/RES'

export function mapCategoryMediaRes2CategoryMedia(
  res: CategoryMediaRes,
): CategoryMedia {
  return {
    id: res.id,
    storageKey: res.storage_key,
    originalFilename: res.original_filename,
    mimeType: res.mime_type,
    fileSize: res.file_size,
    width: res.width,
    height: res.height,
    createdBy: res.created_by,
    createdAt: new Date(res.created_at), 
    updatedAt: new Date(res.updated_at),
  }
}