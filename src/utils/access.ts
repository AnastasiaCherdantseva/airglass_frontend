
import {PermissionAction, PermissionActionRUS, PermissionResource, PermissionResourceRUS} from '@/types/enums'

export function getAccessTags(codes: Set<string>): any {
    return Array.from(codes).map((code) => {
        const [resourceCode, actionCode] = code.split('.');
        const resource = resourceCode as PermissionResource;
        const action = actionCode as PermissionAction;
        const resourceName = PermissionResourceRUS[resource] ?? resourceCode;
        const actionName = PermissionActionRUS[action] ?? actionCode;
        return {
                name: `${resourceName}. ${actionName}`,
                style: 'Primary', 
        }
  });
}