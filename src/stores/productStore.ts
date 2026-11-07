import { defineStore } from 'pinia';
import { Category, Product,  } from '@/types/models';
import { ProductStatus } from '@/types/enums';


export const useProductStore = defineStore('products', {
    state: () => ({
        products: [] as Product[],
    }),
    actions: {
        async get() : Promise<Product[]>{
           this.products = [{
                id:'sdfsf',
                name:'Тест',
                categoryId:'0a64c938-099b-4985-878a-3bfa789beab7',
                unitId:'02240349-344b-4cb2-8495-0f01214ec9a1',
                description:'Этого стекла нет в БД',
                usageRoleIds:['39e8b8f9-888e-4901-8fce-fcac8799d07a'],
                supplierIds:[],
                variantsCount: 0,
                minPrice:null,
                isActive:true,
                status: ProductStatus.Active,
                mediaData:null
           }]
           return this.products
        },
    },
    getters:{
    }
   
})