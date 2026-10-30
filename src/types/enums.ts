export enum PermissionResource {
  Users = 'USERS',
  Roles = 'ROLES',
  Products = 'PRODUCTS',
  Categories = 'CATEGORIES',
  Templates = 'TEMPLATES',
  Projects = 'PROJECTS',
  Customers = 'CUSTOMERS',
  Suppliers = 'SUPPLIERS',
  Media = 'MEDIA',
  Calculator = 'CALCULATOR',
  Settings = 'SETTINGS',
  AuditLog = 'AUDIT_LOG',
}


export const PermissionResourceRUS: Record<PermissionResource, string> = {
  [PermissionResource.Users]: 'Пользователи',
  [PermissionResource.Roles]: 'Роли',
  [PermissionResource.Products]: 'Товары',
  [PermissionResource.Categories]: 'Категории',
  [PermissionResource.Templates]: 'Шаблоны',
  [PermissionResource.Projects]: 'Проекты',
  [PermissionResource.Customers]: 'Клиенты',
  [PermissionResource.Suppliers]: 'Поставщики',
  [PermissionResource.Media]: 'Медиа',
  [PermissionResource.Calculator]: 'Калькулятор',
  [PermissionResource.Settings]: 'Настройки',
  [PermissionResource.AuditLog]: 'Журнал аудита',
};

export enum PermissionAction {
  Create = 'CREATE',
  Read = 'READ',
  Update = 'UPDATE',
  Delete = 'DELETE',
  Archive = 'ARCHIVE',
  Export = 'EXPORT',
  Import = 'IMPORT',
}
export const PermissionActionRUS: Record<PermissionAction, string> = {
  [PermissionAction.Create]: 'Создание',
  [PermissionAction.Read]: 'Чтение',
  [PermissionAction.Update]: 'Редактирование',
  [PermissionAction.Delete]: 'Удаление',
  [PermissionAction.Archive]: 'Архивирование',
  [PermissionAction.Export]: 'Экспорт данных',
  [PermissionAction.Import]: 'Импорт данных',

}
export enum PermissionZone {
  Public = 'PUBLIC',
  Admin = 'ADMIN',
}

export enum ConditionType {
  All = 'ALL',
  Category = 'CATEGORY',
  Role = 'ROLE',
  Creator = 'CREATOR',
  Subtree = 'SUBTREE',
  Media = 'MEDIA',
}

// export enum PermissionEffect {
//   Allow = 'ALLOW',
//   Deny = 'DENY',
// }
export enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
}
