import { RoleCreateREQ } from '@/types/REQS';
import api from './index';
import {  RoleDetailResponse } from '@/types/RES';

const path = '/api/roles';
export const RoleApi = {
    
    getRoles: () => api.get<RoleDetailResponse[]>(path),
    create: (data:RoleCreateREQ) => api.post<RoleDetailResponse>(path,data),

};