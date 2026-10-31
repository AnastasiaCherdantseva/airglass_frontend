<template>
  <span class="inline-flex items-center gap-2 text-xs font-medium" :class="view.text">
    <span class="h-1.5 w-1.5 rounded-full" :class="view.dot" />
    {{ view.label }}
  </span>
</template>

<script setup lang="ts">
    import { computed } from 'vue'
    import type { Status } from '@/types/enums'
    type Triple = {
      active:string,
      pending:string,
      inactive:string,
    };
    const props = defineProps<{ status: Status, labels:Triple }>()
    
    const config: Record<Status, { label: string; dot: string; text: string }> = {
      active: { label: props.labels.active, dot: 'bg-emerald-500', text: 'text-emerald-600' },
      pending: { label: props.labels.pending, dot: 'bg-amber-500', text: 'text-amber-600' },
      inactive: { label: props.labels.inactive, dot: 'bg-slate-400', text: 'text-slate-500' },
    }
    
    const view = computed(() => config[props.status])
</script>