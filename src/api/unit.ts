import api from './index';
import { Unit} from '@/types/models';

const path = '/api/units';
export const UnitApi = {
    get: () => api.get<Unit[]>(path),
};