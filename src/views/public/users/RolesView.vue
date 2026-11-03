<template>
    <Message v-if="error" severity="error">
        <div class="flex items-center gap-4">
            <span>{{ error }}</span>
            <Button label="Повторить" size="small" severity="secondary" outlined @click="loadRoles" />
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
    <!-- Пустое состояние -->
    <EmptyState v-else-if="isEmpty && !canCreate"
        :can-create="canCreate"
        :textHeader="'Пока нет доступных к показу ролей.'"
        :canCreateText="''"
        @create=""
    />
    <EmptyState v-else-if="isEmpty && canCreate"
        :can-create="canCreate"
        :textHeader="'Собственных ролей пока нет.'"
        :canCreateText="'Создайте свою первую роль.'"
        @create="openDrawer"
    />
<template v-else-if="showContent">
        <div class="flex w-full justify-between pb-2">
            <div class="flex justify-start">
                <ViewMode :default="viewMode" @update:modelValue="(val:ViewModeType) => viewMode=val"/>
            </div>
            <div class="flex justify-end">
                <Button
                  v-if="canCreate && !isEmpty"
                  label="Добавить"
                  icon="pi pi-plus"
                  size="small"
                  class="px-5! py-0!"
                   @click="openDrawer"
                />
            </div>
        </div>
        <div class="flex flex-col w-full min-w-0">
            <div class="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
                <DataTable
                    v-if="viewMode === 'table'"
                    :value="rolesWithTags"
                    data-key="id"
                    :loading="rolesLoading"
                    class="text-sm"
                    tableStyle="table-layout: fixed; width: 100%"
                  >
                    <Column field="user" header="Роль" style="width: 300px">
                      <template #body="{ data }">
                        <div class="flex items-center gap-2">
                            <span class="truncate text-sm font-semibold text-slate-900">{{ data.name }}</span>
                        </div>
                      </template>
                    </Column>
                    <Column field="owner" header="Владелец" style="width: 100px">
                      <template #body="{ data }">
                        <div class="truncate text-xs text-slate-500 font-medium">{{ data.ownerId === auth.me?.id? 'Вы': "Система" }}</div>
                      </template>
                    </Column>
                    <Column field="owner" header="Статус" style="width: 100px">
                      <template #body="{ data }">
                        <StatusBadge 
                        :status="data.isActive? Status.Active : Status.Inactive"
                        :labels="{ active: 'Активна', pending: 'Ошибка', inactive: 'Не активна' }" />
                      </template>
                    </Column>
                    <Column field="accesses" header="Права"  >
                      <template #body="{ data }">
                            <TagCell :tags="data.tags" />
                        </template>
                    </Column>
                    <Column field="actions" header="Действия" style="width: 100px">
                      <template #body="{ data }">
                        <TableActions
                          :can-change="canUpdate(data)"
                          :can-delete="canDelete(data)"
                          :delete-disabled="false"
                          :deleting="deletingId === data.id"
                          @delete="confirmDelete(data)"
                        />
                      </template>
                    </Column>
                </DataTable>
                <div v-else class="grid gap-4 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
                    <RoleCard
                    v-for="role in rolesWithTags"
                    :key="role.id"
                    :role="role"
                    :accesses="role.tags"
                    :roles="roles"
                    :can-delete="canDelete(role)"
                    :deleting="deletingId === role.id"
                    @delete="confirmDelete(role)"
                    />
                </div>
                <Pagination
                    :page="page"
                    :limit="limit"
                    :count="roles.length"
                    :has-next="hasNext"
                    :loading="rolesLoading"
                    @update:page="setPage"
                    @update:limit="setLimit"
                />
            </div>

        </div>
    </template>
    <CreateRoleDrawer
        v-model:visible="drawerVisible"
        :submitting="submitting"
        :server-error="serverError"
        @submit="handleCreate"
    />
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { useRoles } from '@/composables/useRoles'
    import { useOrganizations } from '@/composables/useOrganizations'
    import { useConfirm, useToast } from 'primevue'
    import {
      Button,
      Column,
      DataTable,
      Message,
      Skeleton,
    } from 'primevue';
    import StatusBadge from '@/components/table/StatusBadge.vue'
    import TagCell from '@/components/table/TagCell.vue'
    import { ConditionType, Status } from '@/types/enums'
    import EmptyState from '@/components/layout/EmptyState.vue'
    import RoleCard from '@/components/cards/RoleCard.vue'
    import ViewMode from '@/components/buttons/ViewMode.vue'
    import TableActions from '@/components/table/TableActions.vue'
    import Pagination from '@/components/table/Pagination.vue'
    import type {ViewModeType} from '@/components/buttons/ViewMode.vue'
    import { useAuthStore } from '@/stores/authStore';
    import { RoleFull,newRole } from '@/types/models';
    import CreateRoleDrawer from '@/components/forms/CreateRoleDrawer.vue'
    import { getErrorMessage } from '@/utils/errors';
    
    const toast = useToast()
    const confirm = useConfirm()
    const auth = useAuthStore()
    
    const viewMode = ref<ViewModeType>('table')
    const canCreate = computed(() => auth.can('ROLES.CREATE'))
    const canUpdate = computed(() => {
        return (role: Pick<RoleFull, 'id' | 'ownerId'>) => {
            if (auth.me?.id === role.ownerId) return auth.canWithCondition('ROLES.UPDATE',ConditionType.Creator)
            return auth.canWithCondition('ROLES.UPDATE',ConditionType.Role, role.id)
        }
    })
    const canDelete = computed(() => {
        return (role: Pick<RoleFull, 'id' | 'ownerId'>) => {
            if (auth.me?.id === role.ownerId) return auth.canWithCondition('ROLES.DELETE',ConditionType.Creator)
            return auth.canWithCondition('ROLES.DELETE',ConditionType.Role, role.id)
        }
    })
    const drawerVisible = ref(false)
    const submitting = ref(false)
    const serverError = ref<string | null>(null)
    const {load: loadOrgs} = useOrganizations()
    const { roles, 
        loading: rolesLoading, 
        load: loadRoles, 
        setPage,
        setLimit,
        create,
        remove,
        error, 
        loaded,
        page,
        limit,
        hasNext, 
        rolesWithTags,
        deletingId,} = useRoles()
    
    const showSkeleton = computed(() => rolesLoading.value && !loaded.value)
    const isEmpty = computed(
        () => loaded.value && !error.value && roles.value.length === 0,
    )
    const showContent = computed(() => loaded.value && !error.value && roles.value.length > 0)
        function openDrawer(): void {
        serverError.value = null
        drawerVisible.value = true
    }
    async function handleCreate(payload: newRole): Promise<void> {
        submitting.value = true
        serverError.value = null
        try {
            // TODO: заменить на create(payload) из useRoles, когда будет API
            await create(payload)
            drawerVisible.value = false
            if(!error.value){
                toast.add({ severity: 'success', summary: 'Роль создана', life: 3000 })
            }
        } catch (e) {
            serverError.value = getErrorMessage(e, 'Не удалось создать роль')
        } finally {
            submitting.value = false
        }
    }

    function confirmDelete(role: RoleFull): void {
        confirm.require({
            header: 'Удалить роль?',
            message: `Роль «${role.name}» будет удалена и все пользователи, назначенные на нее потеряют права, которые она дает. `,
            rejectProps: { label: 'Отмена', severity: 'secondary', outlined: true },
            acceptProps: { label: 'Удалить', severity: 'danger' },
            accept: async () => {
            try {
                if(role.id){
                    await remove(role.id)
                    toast.add({ severity: 'success', summary: 'Роль удалена', life: 3000 })

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
        emit('needAccess', 'ROLES.READ')
        await Promise.all([loadRoles(), loadOrgs()])
        })
</script>