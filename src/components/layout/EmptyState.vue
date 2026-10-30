
<template>
  <div
    class="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm"
  >
    <div class="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
      <i class="pi pi-users text-2xl" />
    </div>
    <h2 class="text-base font-semibold text-slate-900">{{textHeader}}</h2>
    <p v-if="canCreate" class="max-w-xs text-sm text-slate-500">
      {{canCreateText}}
    </p>
    <Button
      v-if="canCreate"
      label="Создать"
      icon="pi pi-plus-circle"
      class="mt-2"
      @click="emit('create')"
    />
  </div>
</template>

<script setup lang="ts">
    import Button from 'primevue/button'
    
    defineProps<{ canCreate: boolean, canCreateText: string, textHeader:string }>()
    const emit = defineEmits<{ (e: 'create'): void }>()
</script>