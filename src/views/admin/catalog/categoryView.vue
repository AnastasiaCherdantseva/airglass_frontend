<template>
   
</template>

<script setup lang="ts">
import {Message, SidebarMenuItem,TreeSelect, Button, Breadcrumb, SidebarMenuButton , EmptyState } from 'primevue';
import { useAuthStore } from '@/stores/authStore'
import { useRoute } from 'vue-router'
import { useCategories } from '@/composables/useCategories'
import { computed, onMounted, ref } from 'vue';
import { ViewModeType } from '@/components/buttons/ViewMode.vue';

const auth = useAuthStore()
const route = useRoute()

const serverError = ref<string | null>(null)
const drawerVisible = ref(false)
const { 
    getSelected, 
    loading, 
    load, 
    setPage,
    setLimit,
    error, 
    loaded,
    page,
    limit,
    hasNext, 
    deletingId,
} = useCategories()

const categories = computed(()=>getSelected())
const showSkeleton = computed(() => loading.value && !loaded.value)
const isEmpty = computed(() => loaded.value && !error.value && categories.value.length === 0)
const viewMode = ref<ViewModeType>('table')
const canCreate = computed(() => auth.can('CATEGORIES.CREATE'))
const showContent = computed(() => loaded.value && !error.value && categories.value.length > 0)
// const canUpdate = computed(() => {
//     return (role: Pick<RoleFull, 'id' | 'ownerId'>) => {
//         if (auth.me?.id === role.ownerId) return auth.canWithCondition('ROLES.UPDATE',ConditionType.Creator)
//         return auth.canWithCondition('ROLES.UPDATE',ConditionType.Role, role.id)
//     }
// })
// const canDelete = computed(() => {
//     return (role: Pick<RoleFull, 'id' | 'ownerId'>) => {
//         if (auth.me?.id === role.ownerId) return auth.canWithCondition('ROLES.DELETE',ConditionType.Creator)
//         return auth.canWithCondition('ROLES.DELETE',ConditionType.Role, role.id)
//     }
// })
function openDrawer(): void {
    serverError.value = null
    drawerVisible.value = true
}




const emit = defineEmits<{ currentPage: [
    page: 
    {
        label:string
        name:string
        url:string
        current:boolean
    }, 
    dep:number] }>()
onMounted(async () => {
    emit('currentPage', {
        "label": 'Каталог',
        "name": 'catalog',
        "url": '/admin/catalog/categories',
        "current": true,
    }, 2)
})
</script>