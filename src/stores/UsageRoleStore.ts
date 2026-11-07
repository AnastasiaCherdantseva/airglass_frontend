import { defineStore } from 'pinia';
import { UsageRole,  } from '@/types/models';
import { UsageRoleApi } from '@/api/usage_role';


export const useUsageRoleStore = defineStore('usageRoles', {
    state: () => ({
        usageRoles: [] as UsageRole[],
    }),
    actions: {
        async get() : Promise<UsageRole[]>{
            try {
                const res = await UsageRoleApi.get();
                if(res.status!==200) {
                    throw new Error(`getUsageRoles failed: status - ${res.status}. ${res.statusText ?? ''}`.trim());
                }
                this.usageRoles = res.data
                return this.usageRoles
            } catch (error) {
                if (error instanceof Error) {
                    console.error('getUsageRoles failed:', error);
                }
                throw error;
            }
        },
    },
    getters:{
    }
   
})