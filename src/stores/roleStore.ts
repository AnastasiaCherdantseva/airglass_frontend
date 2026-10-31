import { defineStore } from 'pinia';
import { RoleApi } from '@/api/role';
import {  newRole, RoleFull, } from '@/types/models';
import {  mapNewRole2RoleCreateREQ, mapRoleResponse2RoleFull } from '@/mappers';


export const useRoleStore = defineStore('role', {
    state: () => ({
        roles: [] as RoleFull[],
    }),
    actions: {
        async getRoles() : Promise<RoleFull[]>{
            if(this.roles.length!==0){
                return this.roles
            }
            try {
                const res = await RoleApi.getRoles();
                if(res.status!==200) {
                    throw new Error(`getRoles failed: status - ${res.status}. ${res.statusText ?? ''}`.trim());
                }
                const roles = res.data.map(r=> mapRoleResponse2RoleFull(r))
                this.roles = roles
                return this.roles
            } catch (error) {
                if (error instanceof Error) {
                    console.error('getRoles failed:', error);
                }
                throw error;
            }
        },
        async create(data:newRole) : Promise<RoleFull>{
            try {
                const res = await RoleApi.create(mapNewRole2RoleCreateREQ(data));
                if(res.status!==201) {
                    throw new Error(`create role failed: status - ${res.status}. ${res.statusText ?? ''}`.trim());
                }
                const newRole = mapRoleResponse2RoleFull(res.data)
                this.roles.push(newRole)
                return newRole
            } catch (error) {
                if (error instanceof Error) {
                    console.error('create role failed:', error);
                }
                throw error;
            }
        },
    },
    getters:{
        getByIds: (state) => (ids: string[]) =>{
            if(ids.length===0) return []
            const idSet = new Set(ids);
            return state.roles.filter(r=> idSet.has(r.id))
        }
    }
})