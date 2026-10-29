import { defineStore } from 'pinia';
import { UserApi } from '@/api/users';
import {  UserCreate, UserFull } from '@/types/models';
import {  mapUserFullResponse2UserFull, mapUserCreate2UserCreateRequest } from '@/mappers';


export const useUserStore = defineStore('user', {
    state: () => ({
        users: [] as UserFull[],
        total: 0 as number,
    }),
    actions: {
        async getUsers(limit:number, page:number) : Promise<UserFull[]>{
            try {
                if(page<1 || limit <1 )  throw new Error('Некорректные значения пагинации.');
                const start = limit*(page-1)
                let end = limit*page
                if(this.users.length >= end){
                    return this.users.slice(start,end)
                }
                if (end>this.total){
                    if(start>this.total) return []
                    if (this.users.length >= end) {
                        end = this.total
                        return this.users.slice(start, end);
                    }
                }
                const res = await UserApi.getUsers(limit,page);
                if(res.status!==200) {
                    throw new Error(`getUsers failed: status - ${res.status}. ${res.statusText ?? ''}`.trim());
                }
                const existingIds = new Set(this.users.map(u => u.id));
                const newUsers = res.data.items.filter(u => !existingIds.has(u.id));
                const newUsersMapped = newUsers.map(nu=>mapUserFullResponse2UserFull(nu))
                this.users.push(...newUsersMapped)
                return this.users.slice(start,end)
            } catch (error) {
                if (error instanceof Error) {
                    console.error('getUsers failed:', error.message);
                }
                throw error;
            }
        },
        async createUser(payload: UserCreate):Promise<UserFull>{
            try{
                const res = await UserApi.createUser(mapUserCreate2UserCreateRequest(payload));
                if(res.status!==201) {
                    const msg = res.statusText ?? '';
                    throw new Error(`createUser failed: status - ${res.status}. ${msg}`.trim());
                }
                const newUser = mapUserFullResponse2UserFull(res.data)
                this.users.push(newUser)
                this.total++
                return newUser
            } catch (error) {
                if (error instanceof Error) {
                    console.error('createUser failed:', error.message);
                }
                throw error;
            }
        },
        async deleteUser(id: string):Promise<void>{
            try{
                const res = await UserApi.deleteUser(id);
                if(res.status!==204) {
                    const msg = res.statusText ?? '';
                    throw new Error(`deleteUser failed: status - ${res.status}. ${msg}`.trim());
                }
                this.users = this.users.filter(u=> u.id!==id)
                this.total--
            } catch (error) {
                if (error instanceof Error) {
                    console.error('deleteUser failed:', error.message);
                }
                throw error;
            }
        }
        
    }
})