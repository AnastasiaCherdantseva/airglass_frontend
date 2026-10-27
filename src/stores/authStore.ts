import { defineStore } from 'pinia';
import { AuthApi } from '@/api/auth';
import { User } from '@/types/models';
import { AuthLoginEmailRequest } from '@/types/REQS';
import { PermissionWithConditions } from '@/types/models/permission';
import { mapPermissionWithConditionsRES2Model } from '@/mappers';
import { ConditionType } from "@/types/enums";
export const useAuthStore = defineStore('auth', {
    state: () => ({
        me: null as User | null,
        permissions: [] as PermissionWithConditions[],
        permissionCodes : new Set() as Set<string>,
        hasAdminAccess: false,
        isAuthenticated: false,
    }),
    actions: {
        async AuthByLoginEmail(data:AuthLoginEmailRequest) {
            try {
                const res = await AuthApi.loginByEmail(data);
                if(res.status!==200) return false
                const authRes = await this.checkAuth();
                if (authRes) return true
                return false
            } catch {
                return false;
            }
        },
        async checkAuth(){
            try {
                const res = await AuthApi.getMe();
                if (res.status==200){
                    this.me = {
                        id:res.data.id,
                        name:res.data.name,
                        email:res.data.email,
                        isActive:res.data.is_active,
                        emailVerified: res.data.email_verified
                    }
                    this.hasAdminAccess = res.data.has_admin_access
                    this.permissions = res.data.permissions.map(p=> mapPermissionWithConditionsRES2Model(p))  
                    this.permissionCodes =  new Set(this.permissions.map(p=>p.code))
                    this.isAuthenticated = true
                    return true
                }
                else throw new Error();
            }catch{
                this.me = null 
                this.permissions = []
                this.hasAdminAccess= false
                this.isAuthenticated = false
                return false
            }
        },
        can(code: string): boolean {
            return this.permissionCodes.has(code)
        },
        canWithCondition(code: string, type:ConditionType, UUID:string | null): boolean {
            const can = this.permissionCodes.has(code)
            if (!can) return false
            const perm = this.permissions.find(p=> p.code == code)
            if (perm == undefined) return false 
            switch(type){
                case ConditionType.Category:
                    return perm?.conditions.find(c=>c.categoryId==UUID) !== undefined
                case ConditionType.Role:
                    return perm?.conditions.find(c=>c.roleId==UUID) !== undefined
                case ConditionType.Media:
                    return perm?.conditions.find(c=>c.mediaTypeId==UUID) !== undefined
                default:
                    return false
            }
        },
    }
})