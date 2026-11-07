import { defineStore } from 'pinia';
import {  Unit,  } from '@/types/models';
import { UnitApi } from '@/api/unit';


export const useUnitStore = defineStore('units', {
    state: () => ({
        units: [] as Unit[],
    }),
    actions: {
        async get() : Promise<Unit[]>{
            try {
                const res = await UnitApi.get();
                if(res.status!==200) {
                    throw new Error(`getUnits failed: status - ${res.status}. ${res.statusText ?? ''}`.trim());
                }
                this.units = res.data
                return this.units
            } catch (error) {
                if (error instanceof Error) {
                    console.error('getUnits failed:', error);
                }
                throw error;
            }
        },
    },
    getters:{
    }
   
})