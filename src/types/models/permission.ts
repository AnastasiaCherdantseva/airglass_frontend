import { PermissionConditionAll } from "./permissionCondition";

interface Permission {
  id: string;       
  code: string;      // min_length=1, max_length=150
}

export interface PermissionWithConditions extends Permission {
  conditions: PermissionConditionAll[];
}