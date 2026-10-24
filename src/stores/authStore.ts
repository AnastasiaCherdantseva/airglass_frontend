import { defineStore } from 'pinia';
import { AuthApi } from '@/api/auth';
import { User } from '@/types/models';
import { AuthLoginEmailRequest } from '@/types/REQS';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        me: null as User | null,
        permissions: [] as User[],
        isAuthenticated: false,
    }),
    actions: {
        async AuthByLoginEmail(data:AuthLoginEmailRequest) {
            try {
                const res = await AuthApi.loginByEmail(data);
                if(res.status==200){
                    this.me = {
                        id:res.data.id,
                        name:res.data.name,
                        email:res.data.email
                    }
                }
                // await this.checkAuth();
                return true;
            } catch {
                return false;
            }
        },
    }
})