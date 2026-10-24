import { PermissionConditionAllRES } from "./permissionConditions";

interface PermissionRES {
  id: string;       
  code: string;      // min_length=1, max_length=150
}

// interface PermissionFull extends PermissionBase {
//   name: string;              // min_length=1, max_length=255
//   description?: string | null;  // str | None = None → опциональное + null
//   resource: PermissionResource;
//   action: PermissionAction;
//   zone: PermissionZone;
// }

// Интерфейс с условиями (соответствует PermissionWithConditions)
export interface PermissionWithConditionsRES extends PermissionRES {
  conditions: PermissionConditionAllRES[];
}