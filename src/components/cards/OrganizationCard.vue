
<template>
  <div class="flex flex-col gap-3 rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
  <div class="flex flex-col">
      <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-3">
              <div class="min-w-0">
                  <span class="text-sm font-semibold text-slate-900">{{ org.name }}</span>
              </div>
            </div>
            <TableActions
            :can-delete="canDelete"
            :can-change="canChange"
            :delete-disabled="deleting"
            :deleting="deleting"
            @delete="emit('delete')"
            />
        </div>
        <div class="min-w-0">
            <span class="text-sm font-semibold text-slate-900">ИНН: {{ org.inn }}</span>
        </div>
        <div class="flex-1" >
            <span class="text-xs text-gray-400">{{ org.address!=null && org.address!=undefined? org.address :'Без адреса' }}</span>
        </div>
  </div>
  </div>
</template>
    
<script setup lang="ts">
import TableActions from '@/components/table/TableActions.vue'
    import type { Organization} from '@/types/models'
    defineProps<{
      org: Organization
      canDelete: boolean
      canChange: boolean
      deleting: boolean
    }>()
    
    const emit = defineEmits<{ (e: 'delete'): void }>()
</script>