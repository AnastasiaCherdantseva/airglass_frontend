import api from './index';
import { MeResponse, UserResponse } from '@/types/RES';
import { AuthLoginEmailRequest } from '@/types/REQS';

const path = '/api/auth';

export const AuthApi = {
    
    // Авторизация через почту
    loginByEmail: (data:AuthLoginEmailRequest) => api.post<UserResponse>(`${path}/login/email`,
        data
    ),
    getMe: () => api.get<MeResponse>(`${path}/me`),

};