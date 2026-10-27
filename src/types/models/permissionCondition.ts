import { ConditionType } from "../enums";

interface PermissionCondition {
  id: string;             // UUID
  permissionId: string;  // UUID
  type: ConditionType;
  // effect: PermissionEffect;
  isActive: boolean;
}

// "All" — все поля опциональные и могут быть null
export interface PermissionConditionAll extends PermissionCondition {
  categoryId?: string | null;
  mediaTypeId?: string | null;
  roleId?: string | null;
}

// Узкие условия — одно поле обязательное
export interface PermissionConditionCategory extends PermissionCondition {
  categoryId: string;     // UUID, обязательное
}

export interface PermissionConditionMediaType extends PermissionCondition {
  mediaTypeId: string;    // UUID, обязательное
}

export interface PermissionConditionRole extends PermissionCondition {
  roleId: string;         // UUID, обязательное
}