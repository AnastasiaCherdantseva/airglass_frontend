
import { useOrganizationStore } from '@/stores/organizationStore';
import { useRoleStore } from '@/stores/roleStore';
import {ConditionType, PermissionAction, PermissionActionRUS, PermissionResource, PermissionResourceRUS} from '@/types/enums'
import { PermissionConditionAll } from '@/types/models';

export function accessActionTranslater(action:string): string{
    const actionCode = action as PermissionAction;
    return PermissionActionRUS[actionCode] ?? 'Error';
}
export function accessResourseTranslater(resource:string): string{
    const resourceCode = resource as PermissionResource;
    return PermissionResourceRUS[resourceCode] ?? 'Error';
}
export function accessCodeTranslater(name:string, condition:PermissionConditionAll|null = null): string{
    if(condition==null) return name
    const conditionType = condition.type as ConditionType
    const {roles} = useRoleStore()
    const {organizations} = useOrganizationStore()

    switch(conditionType){
        case ConditionType.Category:
            return name
        case ConditionType.Role:
            const role = roles.find(o=>o.id==condition.roleId!);
            return `${name} с ролью "${role?.name}"`
        case ConditionType.Media:
            return name
        case ConditionType.Organization:
            const org = organizations.find(o=>o.id==condition.organizationId!);
            return `${name} ("${org?.name}")`
        case ConditionType.Creator:
            return `${name} (собственные)`
        case ConditionType.Subtree:
            return `${name} (Свое поддерево)`
        default:
            return name

    }
}
export function getAccessTags(codes: Set<string>): any {
    return Array.from(codes).map((code) => {
        return {
                name: accessCodeTranslater(code),
                style: 'Primary', 
        }
  });
}