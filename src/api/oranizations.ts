import { OrganizationCreateREQ, OrganizationPatchREQ } from '@/types/REQS';
import api from './index';
import {  OrganizationRES} from '@/types/RES';

const path = '/api/organizations';
export const OrganizationApi = {
    
    get: () => api.get<OrganizationRES[]>(path),
    create: (data:OrganizationCreateREQ) => api.post<OrganizationRES>(path,data),
    delete: (id:string) => api.delete<void>(`${path}/${id}`),
    patch: (id:string, data:OrganizationPatchREQ) => api.patch<OrganizationRES>(`${path}/${id}`, data),

};