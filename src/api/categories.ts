import api from './index';
import {  CategoryRes} from '@/types/RES';

const path = '/api/categories';
export const CategoryApi = {
    
    get: () => api.get<CategoryRes[]>(path),
    // create: (data:OrganizationCreateREQ) => api.post<OrganizationRES>(path,data),
    // delete: (id:string) => api.delete<void>(`${path}/${id}`),
    // patch: (id:string, data:OrganizationPatchREQ) => api.patch<OrganizationRES>(`${path}/${id}`, data),

};