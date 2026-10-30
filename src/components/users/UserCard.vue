
<template>
  <div
    class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
  >
    <div class="flex items-start justify-between gap-2">
      <UserIdentity :user="user" />
      <TableActions
        :can-delete="canDelete"
        :delete-disabled="deleting"
        :deleting="deleting"
        @delete="emit('delete')"
      />
    </div>
    <UserRoleTags :role-ids="user.roleIds" :roles="roles" />
    <div class="flex items-center justify-between text-sm">
      <StatusBadge :status="getUserStatus(user)" :labels="{ active: 'Активен', pending: 'Ожидает подтверждения', inactive: 'Не активен' }" />
      <span class="inline-flex items-center gap-1.5 text-slate-600" title="Подчинённые">
        <i class="pi pi-user text-slate-400" />
        {{ user.childrenCount }}
      </span>
    </div>
  </div>
</template>
    
<script setup lang="ts">
    import TableActions from '@/components/layout/table/TableActions.vue'
    import UserIdentity from '@/components/users/UserIdentity.vue'
    import UserRoleTags from '@/components/users/UserRoleTags.vue'
    import StatusBadge from '@/components/layout/table/StatusBadge.vue'
    import { getUserStatus } from '@/utils/user'
    import type { Role, UserFull } from '@/types/models'
    
    defineProps<{
      user: UserFull
      roles: Role[]
      canDelete: boolean
      deleting: boolean
    }>()
    
    const emit = defineEmits<{ (e: 'delete'): void }>()
</script>