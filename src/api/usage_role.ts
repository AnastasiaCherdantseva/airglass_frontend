import api from './index';
import { UsageRole } from '@/types/models';

const path = '/api/usage_roles';
export const UsageRoleApi = {
    get: () => api.get<UsageRole[]>(path),
};