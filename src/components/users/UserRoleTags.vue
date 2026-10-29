<template>
  <div v-if="names.length > 0" class="flex flex-wrap items-center gap-1.5">
    <Tag v-for="(name, i) in visible" :key="`${name}-${i}`" :value="name" severity="secondary" rounded />
    <Tag v-if="hiddenCount > 0" :value="`+${hiddenCount}`" severity="secondary" rounded />
  </div>
  <span v-else class="text-slate-400">—</span>
</template>

<script setup lang="ts">
    import { computed } from 'vue'
    import Tag from 'primevue/tag'
    import type { Role } from '@/types/models'

    const props = withDefaults(
    defineProps<{
        roleIds: string[]
        roles: Role[]
        maxVisible?: number
    }>(),
    { maxVisible: 2 },
    )

    // Пока нет GET /roles, показываем сокращённый id (названия ролей неизвестны).
    const names = computed<string[]>(() =>
    props.roleIds.map((id) => props.roles.find((r) => r.id === id)?.name ?? id.slice(0, 8)),
    )
    const visible = computed(() => names.value.slice(0, props.maxVisible))
    const hiddenCount = computed(() => Math.max(0, names.value.length - props.maxVisible))
</script>
