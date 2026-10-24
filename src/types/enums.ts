
export enum PermissionResource {
  USERS = 'users',
  ROLES = 'roles',
  PRODUCTS = 'products',
  CATEGORIES = 'categories',
  TEMPLATES = 'templates',
  PROJECTS = 'projects',
  CUSTOMERS = 'customers',
  SUPPLIERS = 'suppliers',
  MEDIA = 'media',
  CALCULATOR = 'calculator',
  SETTINGS = 'settings',
  AUDIT_LOG = 'audit_log',
}

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  ARCHIVE = 'archive',
  EXPORT = 'export',
  IMPORT = 'import',
}

export enum PermissionZone {
  PUBLIC = 'public',
  ADMIN = 'admin',
}



export enum ConditionType {
  ALL = 'all',
  CATEGORY = 'category',
  ROLE = 'role',
  CREATOR = 'creator',
  SUBTREE = 'subtree',
  MEDIA = 'media',
}

export enum PermissionEffect {
  ALLOW = 'allow',
  DENY = 'deny',
}