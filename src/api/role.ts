import api from './index';
import {  RoleDetailResponse } from '@/types/RES';

const path = '/api/roles';
export const RoleApi = {
    
    getRoles: () => api.get<RoleDetailResponse[]>(path),

};