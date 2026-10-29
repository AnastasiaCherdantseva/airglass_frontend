
<template>

          <!-- Ошибка -->
          <Message v-if="error" severity="error">
            <div class="flex items-center gap-4">
              <span>{{ error }}</span>
              <Button label="Повторить" size="small" severity="secondary" outlined @click="loadUsers" />
            </div>
          </Message>

          <!-- Скелетон -->
          <div
            v-else-if="showSkeleton"
            class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
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
          <UsersEmptyState v-else-if="isEmpty" :can-create="canCreate" @create="openDrawer" />

          <!-- Контент -->
          <template v-else-if="showContent">
            <div class="flex w-full justify-between pb-2">
              <div class="flex justify-start">
                <SelectButton
                v-model="viewMode"
                size="small"
                :options="viewOptions"
                option-label="label"
                option-value="value"
                :allow-empty="false"
                aria-label="Режим отображения"
                  >
                    <template #option="{ option }">
                      <span class="flex items-center gap-2 text-sm">
                        <i :class="option.icon" />
                        {{ option.label }}
                      </span>
                    </template>
                </SelectButton>
              </div>
              <div class="flex justify-end">
                <Button
                  v-if="canCreate && !isEmpty"
                  label="Создать пользователя"
                  icon="pi pi-plus-circle"
                  size="small"
                  @click="openDrawer"
                />
              </div>

            </div>

            <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <!-- Таблица -->
              <DataTable
                v-if="viewMode === 'table'"
                :value="users"
                data-key="id"
                :loading="loading"
                class="text-sm"
              >
                <Column field="user" header="Пользователь">
                  <template #body="{ data }">
                    <UserIdentity :user="data" />
                  </template>
                </Column>
                <Column field="roles" header="Роли">
                  <template #body="{ data }">
                    <UserRoleTags :role-ids="data.roleIds" :roles="roles" />
                  </template>
                </Column>
                <Column field="status" header="Статус">
                  <template #body="{ data }">
                    <UserStatusBadge :status="getUserStatus(data)" />
                  </template>
                </Column>
                <Column field="children" header="Подчинённые">
                  <template #body="{ data }">
                    <span class="inline-flex items-center gap-1.5 text-slate-700">
                      <i class="pi pi-user text-slate-400" />
                      {{ data.children_count }}
                    </span>
                  </template>
                </Column>
                <Column field="actions" header="Действия" header-class="w-32">
                  <template #body="{ data }">
                    <UserActions
                      :can-delete="canDelete"
                      :delete-disabled="deletingId !== null"
                      :deleting="deletingId === data.id"
                      @delete="confirmDelete(data)"
                    />
                  </template>
                </Column>
              </DataTable>

              <!-- Карточки -->
              <div v-else class="grid gap-4 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
                <UserCard
                  v-for="user in users"
                  :key="user.id"
                  :user="user"
                  :roles="roles"
                  :can-delete="canDelete"
                  :deleting="deletingId === user.id"
                  @delete="confirmDelete(user)"
                />
              </div>

              <UsersPagination
                :page="page"
                :limit="limit"
                :count="users.length"
                :has-next="hasNext"
                :loading="loading"
                @update:page="setPage"
                @update:limit="setLimit"
              />
            </div>
          </template>
    <CreateUserDrawer
      v-model:visible="drawerVisible"
      :roles="roles"
      :roles-loading="rolesLoading"
      :submitting="submitting"
      :server-error="serverError"
      @submit="handleCreate"
    />
</template>
<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue'
    import {
      Button,
      Column,
      DataTable,
      Message,
      SelectButton,
      Skeleton,
    } from 'primevue';
    import { useConfirm, useToast } from 'primevue'
    import CreateUserDrawer from '@/components/users/CreateUserDrawer.vue'
    import UserActions from '@/components/users/UserActions.vue'
    import UserCard from '@/components/users/UserCard.vue'
    import UserIdentity from '@/components/users/UserIdentity.vue'
    import UserRoleTags from '@/components/users/UserRoleTags.vue'
    import UsersEmptyState from '@/components/users/UsersEmptyState.vue'
    import UsersPagination from '@/components/users/UsersPagination.vue'
    import UserStatusBadge from '@/components/users/UserStatusBadge.vue'
    import { useRoles } from '@/composables/useRoles'
    import { useUsers } from '@/composables/useUsers'
    import { useAuthStore } from '@/stores/authStore'
    import type { UserCreate, UserFull } from '@/types/models'
    import { getUserStatus } from '@/utils/user'
    
    type ViewMode = 'table' | 'cards'
    
    const auth = useAuthStore()
    const toast = useToast()
    const confirm = useConfirm()
    const {
        users,
        loading,
        loaded,
        error,
        page,
        limit,
        hasNext,
        deletingId,
        load: loadUsers,
        setPage,
        setLimit,
        create,
        remove,
    } = useUsers(10)
    
    const { roles, loading: rolesLoading, load: loadRoles } = useRoles()
    
    const viewMode = ref<ViewMode>('table')
    const viewOptions: { label: string; value: ViewMode; icon: string }[] = [
    { label: 'Таблица', value: 'table', icon: 'pi pi-table' },
    { label: 'Карточки', value: 'cards', icon: 'pi pi-th-large' },
    ]
    
    const drawerVisible = ref(false)
    const submitting = ref(false)
    const serverError = ref<string | null>(null)
    
    const canCreate = computed(() => auth.can('USERS.CREATE'))
    const canDelete = computed(() => auth.can('USERS.DELETE'))
    
    const isEmpty = computed(
    () => loaded.value && !error.value && page.value === 1 && users.value.length === 0,
    )
    const showSkeleton = computed(() => loading.value && !loaded.value)
    const showContent = computed(() => loaded.value && !error.value && users.value.length > 0)
    
   
    function openDrawer(): void {
        serverError.value = null
        drawerVisible.value = true
    }
    
    async function handleCreate(payload: UserCreate): Promise<void> {
        submitting.value = true
        serverError.value = null
        try {
            await create(payload)
            drawerVisible.value = false
            toast.add({ severity: 'success', summary: 'Пользователь создан', life: 3000 })
        } catch (e) {
            serverError.value = 'Не удалось создать пользователя'
        } finally {
            submitting.value = false
        }
    }
    
    function confirmDelete(user: UserFull): void {
        confirm.require({
            header: 'Удалить пользователя?',
            message: `Пользователь «${user.name}» (${user.email}) и все его поддерево (пользователей: ${user.childrenCount? user.childrenCount : 0} ) будут удалены.`,
            rejectProps: { label: 'Отмена', severity: 'secondary', outlined: true },
            acceptProps: { label: 'Удалить', severity: 'danger' },
            accept: async () => {
            try {
                if(user.id){
                    await remove(user.id)
                    toast.add({ severity: 'success', summary: 'Пользователь удалён', life: 3000 })
                }
                else throw new Error()
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
      emit('needAccess', 'USERS.READ')
      await Promise.all([loadUsers(), loadRoles()])
    })
</script>