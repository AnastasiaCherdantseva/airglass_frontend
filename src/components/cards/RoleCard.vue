
<template>
  <div
    class="flex flex-col gap-3 rounded-sm border border-slate-200 bg-white p-4 shadow-sm"
  >
  <div class="flex flex-col">
      <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-3">
              <div class="min-w-0">
                  <span class="text-sm font-semibold text-slate-900">{{ role.name }}</span>
              </div>
              <Tag
                  v-if="role.ownerId===null"
                  :key="role.id"
                  :value="'Системная'"
                  :severity="'info'"
                  class="shrink-0 text-xs px-3! py-0.5!"
                  rounded 
                  />
              <span v-if="role.ownerId ===null"> </span>
          </div>
          <TableActions
          :can-delete="canDelete"
          :delete-disabled="deleting"
          :deleting="deleting"
          @delete="emit('delete')"
          />
      </div>
      <div class="flex-1" v-if="role.description">
          <span class="text-xs text-gray-400">{{ role.description }}</span>
      </div>
  </div>
    <div class="flex items-center justify-between text-sm">
      <StatusBadge :status="role.isActive? Status.Active : Status.Inactive" :labels="{ active: 'Активна', pending: '', inactive: 'Не активна' }" />
    </div>
    <div class="flex items-center justify-between text-sm">
        <TagCell :tags="getAccessTags(accesses)"/>
    </div>
  </div>
</template>
    
<script setup lang="ts">
    import TableActions from '@/components/table/TableActions.vue'
    import StatusBadge from '@/components/table/StatusBadge.vue'
    import Tag from 'primevue/tag'
    import TagCell from '@/components/table/TagCell.vue'
    import type { Role, RoleFull, UserFull } from '@/types/models'
    import { getAccessTags } from '@/utils/access';
    import { Status } from '@/types/enums'
    
    defineProps<{
      role: RoleFull
      canDelete: boolean
      deleting: boolean
      accesses: Set<string>
    }>()
    
    const emit = defineEmits<{ (e: 'delete'): void }>()
</script>