import { defineStore } from 'pinia';
import { Category,  } from '@/types/models';
import {  mapCategoryRes2Category } from '@/mappers';
import { CategoryApi } from '@/api/categories';


export const useCategoryStore = defineStore('categories', {
    state: () => ({
        categories: [] as Category[],
    }),
    actions: {
        async get() : Promise<Category[]>{
            if(this.categories.length!==0){
                return this.categories
            }
            try {
                const res = await CategoryApi.get();
                if(res.status!==200) {
                    throw new Error(`getCategory failed: status - ${res.status}. ${res.statusText ?? ''}`.trim());
                }
                const categories = res.data.map(r=> mapCategoryRes2Category(r))
                this.categories = categories
                return this.categories
            } catch (error) {
                if (error instanceof Error) {
                    console.error('getCategory failed:', error);
                }
                throw error;
            }
        },
    },
    getters:{
    }
   
})