import type { Category, CategoryMedia } from '@/types/models'
import { CategoryRes } from '@/types/RES'
import { mapCategoryMediaRes2CategoryMedia } from './media'

export function mapCategoryRes2Category(res: CategoryRes): Category {
  return {
    id: res.id,
    parentId: res.parent_id,
    name: res.name,
    code: res.code,
    description: res.description,
    sortOrder: res.sort_order, 
    isActive: res.is_active,
    createdAt: new Date(res.created_at),
    updatedAt: new Date(res.updated_at),
    attributeIds: res.attributes_ids,
    usageRoleIds: res.usage_role_ids,
    mediaData: res.media_data
      ? mapCategoryMediaRes2CategoryMedia(res.media_data)
      : null , 
  }
}