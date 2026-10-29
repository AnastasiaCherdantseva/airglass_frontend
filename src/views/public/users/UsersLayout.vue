<template>
    <Message v-if="auth.me && !canRead" severity="warn">
        У вас нет доступа к этой странице.
      </Message>
      
      <template v-else>
        <InnerLeftSideBar
          title="Подразделение"
          :items="[
            { icon: 'pi-user', text: 'Пользователи', to: '/users' },
            { icon: 'pi-book', text: 'Роли и права доступа', to: '/roles' },
          ]"
        />
    <router-view v-slot="{ Component }">
        <div class="flex-1  py-2">
            <!-- Оборачиваем компонент и слушаем его события -->
            <component :is="Component" @needAccess="(newCode:string)=> code=newCode" />
        </div>
    </router-view>
        </template>
</template>


<script setup lang="ts">
import {Message,} from 'primevue';
import { watch,computed, ref } from 'vue';
import { useAuthStore } from '@/stores/authStore'
import { useRoute } from 'vue-router'
import InnerLeftSideBar from '@/components/layout/InnerLeftSideBar.vue';

const auth = useAuthStore()
const route = useRoute()

const code = ref<string|null>(null)
watch(
  () => route.fullPath,
  () => {
    code.value = null
  }
)
const canRead = computed(() => {
    if(code.value == null) return true 
    return auth.can(code.value)})
</script>