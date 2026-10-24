import { ConditionType, PermissionEffect } from "../enums";



interface PermissionConditionRES {
  id: string;             // UUID
  permission_id: string;  // UUID
  type: ConditionType;
  effect: PermissionEffect;
  is_active: boolean;
}

// "All" — все поля опциональные и могут быть null
export interface PermissionConditionAllRES extends PermissionConditionRES {
  category_id?: string | null;
  media_type_id?: string | null;
  role_id?: string | null;
}

// Узкие условия — одно поле обязательное
export interface PermissionConditionCategoryRES extends PermissionConditionRES {
  category_id: string;     // UUID, обязательное
}

export interface PermissionConditionMediaTypeRES extends PermissionConditionRES {
  media_type_id: string;   // UUID, обязательное
}

export interface PermissionConditionRoleRES extends PermissionConditionRES {
  role_id: string;         // UUID, обязательное
}