
<template>
  <div class="flex items-center gap-3">
    <Avatar :label="initials" shape="circle" class="shrink-0 font-semibold"/>
    <div class="min-w-0">
      <div class="flex items-center gap-2">
        <span class="truncate text-sm font-semibold text-slate-900">{{ user.name }}</span>
        
      </div>
      <div class="truncate text-xs text-slate-500">{{ user.email }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue'
    import Avatar from 'primevue/avatar'
    import { getInitials } from '@/utils/user'
    import type { User, UserFull } from '@/types/models'
    
    const props = defineProps<{
      user: Pick<User|UserFull, 'id' | 'name' | 'email'>
    }>()
    
    const initials = computed(() => getInitials(props.user.name))
</script>