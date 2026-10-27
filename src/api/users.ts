import api from './index';
import {  UserFullResponse,  UsersFullResponse } from '@/types/RES';
import { UserCreateRequest } from '@/types/REQS';

const path = '/api/users';
export const UserApi = {
    
    getUsers: (limit:number, page:number) => {
        const query = new URLSearchParams({ limit: String(limit), page: String(page) })
        return api.get<UsersFullResponse>(`${path}?${query.toString()}`)
    },
    createUser: (payload: UserCreateRequest) => api.post<UserFullResponse>(path,payload),
    deleteUser: (id: string) => api.delete<void>(`${path}/${id}`),

};