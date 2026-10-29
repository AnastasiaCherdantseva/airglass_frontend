<template>
    <Toolbar style=" padding: 0rem 1rem;">
        <template #start>
            
        </template>
        <template #center>
            <template v-if="hasPermission(PermissionResource.Users, PermissionAction.Read)">
                <Button as="router-link"
                        to="/users" 
                        variant="text" 
                        aria-label="Users" 
                        iconOnly rounded 
                >
                    <Users :size="24" />
                </Button>
            </template>
        </template>
        <template #end>
            <div class="flex items-center justify-center gap-4">
                <Avatar image="https://i.pinimg.com/736x/df/f3/ff/dff3ffca86b6309eec5272ae33b02804.jpg" size="small" shape="circle" @click="toggle" />
                <Menu ref="menu" :model="items" popup class="w-40" />
            </div>
        </template>
    </Toolbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Toolbar, Avatar, Menu , Button } from 'primevue';
import {useAuthStore} from '@/stores/authStore';
import {PermissionResource, PermissionAction} from '@/types/enums'
import Users from '@primeicons/vue/users';
const AuthStore=useAuthStore();
const items = ref ([
    {
        label:'Настройки профиля'
    },
    {
        label:'Выход'
    }
])

const menu = ref();
const toggle = (event: MouseEvent) => {
    menu.value.toggle(event);
};

function hasPermission(
  resource: PermissionResource,
  action: PermissionAction,
): boolean {
  const code = `${resource}.${action}`;
  return AuthStore.can(code)
}



</script>