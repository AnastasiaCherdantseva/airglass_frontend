import { defineStore } from 'pinia';
import { OrganizationApi } from '@/api/oranizations';
import { Organization, OrganizationCreate } from '@/types/models';
import {  mapOrganizationRES2Organization } from '@/mappers';


export const useOrganizationStore = defineStore('organization', {
    state: () => ({
        organizations: [] as Organization[],
    }),
    actions: {
        async get() : Promise<Organization[]>{
            if(this.organizations.length!==0){
                return this.organizations
            }
            try {
                const res = await OrganizationApi.get();
                if(res.status!==200) {
                    throw new Error(`getOrganization failed: status - ${res.status}. ${res.statusText ?? ''}`.trim());
                }
                const organizations = res.data.map(r=> mapOrganizationRES2Organization(r))
                this.organizations = organizations
                return this.organizations
            } catch (error) {
                if (error instanceof Error) {
                    console.error('getOrganization failed:', error);
                }
                throw error;
            }
        },
        async create(data:OrganizationCreate) : Promise<Organization>{
            try {
                const res = await OrganizationApi.create(data);
                if(res.status!==201) {
                    throw new Error(`create Organization failed: status - ${res.status}. ${res.statusText ?? ''}`.trim());
                }
                const organization = mapOrganizationRES2Organization(res.data)
                this.organizations.push(organization)
                return organization
            } catch (error) {
                if (error instanceof Error) {
                    console.error('createOrganization failed:', error);
                }
                throw error;
            }
        },
        async delete(id: string):Promise<void>{
            try{
                const res = await OrganizationApi.delete(id);
                if(res.status!==204) {
                    const msg = res.statusText ?? '';
                    throw new Error(`deleteOrganization failed: status - ${res.status}. ${msg}`.trim());
                }
                this.organizations = this.organizations.filter(u=> u.id!==id)
            } catch (error) {
                if (error instanceof Error) {
                    console.error('deleteOrganization failed:', error.message);
                }
                throw error;
            }
        }
    },
    getters:{
        getById: (state) => (id: string) =>{
            return state.organizations.find(r=> r.id==id)
        },
    }
   
})