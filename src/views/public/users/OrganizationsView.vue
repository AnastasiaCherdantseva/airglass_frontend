<template>
    <Message v-if="error" severity="error">
        <div class="flex items-center gap-4">
              <span>{{ error }}</span>
              <Button label="Повторить" size="small" severity="secondary" outlined @click="load" />
        </div>
    </Message>
    <div
        v-else-if="showSkeleton"
        class="flex flex-col gap-4  border border-slate-200 bg-white p-4 shadow-sm"
    >
        <div v-for="i in 5" :key="i" class="flex items-center gap-4">
            <Skeleton shape="circle" size="2.5rem" />
            <div class="flex flex-1 flex-col gap-2">
            <Skeleton width="30%" height="0.9rem" />
            <Skeleton width="45%" height="0.7rem" />
            </div>
            <Skeleton width="5rem" height="1.5rem" />
            <Skeleton width="4rem" height="1rem" />
        </div>
    </div>
    <EmptyState v-else-if="isEmpty && !canCreate"
        :can-create="canCreate"
        :textHeader="'Пока нет доступных к показу организаций.'"
        :canCreateText="''"
        @create=""
    />
    <EmptyState v-else-if="isEmpty && canCreate"
        :can-create="canCreate"
        :textHeader="'Собственных организаций пока нет.'"
        :canCreateText="'Создайте свою первую организацию.'"
        @create="openDrawer"
    />
    <template v-else-if="showContent">
        <div class="flex w-full justify-end pb-2">
            <Button
                v-if="canCreate && !isEmpty"
                label="Добавить"
                icon="pi pi-plus"
                size="small"
                class="px-5! py-0! sm:!h-[38px]"
                @click="openDrawer"
            />
        </div>
        <div class="flex flex-col w-full min-w-0">
            <div class="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
                <div class="grid gap-4 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
                    <OrganizationCard
                    v-for="org in organizations"
                    :key="org.id"
                    :org="org"
                    :can-delete="canDelete(org)"
                    :can-change="canUpdate(org)"
                    :deleting="deletingId === org.id"
                    @delete="confirmDelete(org)"
                    />
                </div>
            </div>
        </div>
    </template>
     <CreateOrganizationDrawer 
        v-model:visible="drawerVisible"
        :submitting="submitting"
        :server-error="serverError"
        @submit="handleCreate"
        />
</template>
<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import {
        Button,
        Column,
        DataTable,
        Message,
        Skeleton,
    } from 'primevue';
    import { useConfirm, useToast } from 'primevue'
    import EmptyState from '@/components/layout/EmptyState.vue'
    import OrganizationCard from '@/components/cards/OrganizationCard.vue'
    import { useOrganizations } from '@/composables/useOrganizations'
    import { useAuthStore } from '@/stores/authStore';
    import { Organization, OrganizationCreate } from '@/types/models';
    import CreateOrganizationDrawer from '@/components/forms/CreateOrganizationDrawer.vue'
import { ConditionType } from '@/types/enums';
import { getErrorMessage } from '@/utils/errors';

    const toast = useToast()
    const confirm = useConfirm()
    const auth = useAuthStore()


    const { 
        organizations, 
        loading, 
        load, 
        setPage,
        setLimit,
        create,
        remove,
        error, 
        loaded,
        page,
        limit,
        hasNext, 
        deletingId
    } = useOrganizations()
    const drawerVisible = ref(false)
    const submitting = ref(false)
    const serverError = ref<string | null>(null)
    const showSkeleton = computed(() => loading.value && !loaded.value)
    const canCreate = computed(() => auth.canWithCondition('ORGANIZATIONS.CREATE',ConditionType.Creator))
     const canUpdate = computed(() => {
        return (role: Pick<Organization, 'id' | 'ownerId'>) => {
            if (auth.me?.id === role.ownerId) return auth.canWithCondition('ORGANIZATIONS.UPDATE',ConditionType.Creator)
            return auth.canWithCondition('ORGANIZATIONS.UPDATE',ConditionType.Organization, role.id)
        }
    })
    const canDelete = computed(() => {
        return (role: Pick<Organization, 'id' | 'ownerId'>) => {
            if (auth.me?.id === role.ownerId) return auth.canWithCondition('ORGANIZATIONS.DELETE',ConditionType.Creator)
            return auth.canWithCondition('ORGANIZATIONS.DELETE',ConditionType.Organization, role.id)
        }
    })
    const isEmpty = computed(
        () => loaded.value && !error.value && organizations.value.length === 0,
    )
    const showContent = computed(() => loaded.value && !error.value && organizations.value.length > 0)

    function openDrawer(): void {
        serverError.value = null
        drawerVisible.value = true
    }
    async function handleCreate(payload: OrganizationCreate): Promise<void> {
        submitting.value = true
        serverError.value = null
        try {
            // TODO: заменить на create(payload) из useRoles, когда будет API
            await create(payload)
            drawerVisible.value = false
            if(!error.value){
                toast.add({ severity: 'success', summary: 'Организация создана', life: 3000 })
            }
        } catch (e) {
            serverError.value = getErrorMessage(e, 'Не удалось создать организацию')
        } finally {
            submitting.value = false
        }
    }
     function confirmDelete(org: Organization): void {
        confirm.require({
            header: `Удалить организацию ${org.name}?`,
            rejectProps: { label: 'Отмена', severity: 'secondary', outlined: true },
            acceptProps: { label: 'Удалить', severity: 'danger' },
            accept: async () => {
            try {
                if(org.id){
                    await remove(org.id)
                    toast.add({ severity: 'success', summary: 'Организация удалена', life: 3000 })

                }
            } catch (e) {
                toast.add({
                severity: 'error',
                summary: 'Не удалось удалить',
                detail:  'Попробуйте ещё раз',
                life: 5000,
                })
            }
            },
        })
    }
    const emit = defineEmits<{ needAccess: [code: string] }>()
        onMounted(async () => {
        emit('needAccess', 'ORGANIZATIONS.READ')
        await Promise.all([load()])
    })
</script>