
<template>
  <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm text-slate-500">
    <span>Показано {{ from }}–{{ to }}</span>

    <div class="flex items-center gap-2">
      <Button
        icon="pi pi-chevron-left"
        severity="secondary"
        text
        size="small"
        :disabled="page === 1 || loading"
        aria-label="Предыдущая страница"
        @click="emit('update:page', page - 1 )"
      />
      <span class="min-w-20 text-center font-medium text-slate-700">Страница {{ page  }}</span>
      <Button
        icon="pi pi-chevron-right"
        severity="secondary"
        text
        size="small"
        :disabled="!hasNext || loading"
        aria-label="Следующая страница"
        @click="emit('update:page', page + 1 )"
      />
    </div>

    <Select
      :model-value="limit"
      :options="limitOptions"
      option-label="label"
      option-value="value"
      size="small"
      :disabled="loading"
      @update:model-value="(v: number) => emit('update:limit', v)"
    />
  </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue'
    import Button from 'primevue/button'
    import Select from 'primevue/select'
    
    const props = defineProps<{
      page: number
      limit: number
      count: number
      hasNext: boolean
      loading: boolean
    }>()
    
    const emit = defineEmits<{
      (e: 'update:page', value: number): void
      (e: 'update:limit', value: number): void
    }>()
    
    const limitOptions = [10, 25, 50].map((value) => ({ value, label: `На страницу ${value}` }))
    
    const from = computed(() => (props.count === 0 ? 0 : props.page ))
    const to = computed(() => props.page * props.limit )
</script>