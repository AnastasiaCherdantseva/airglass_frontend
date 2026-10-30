
<template>
  <div class="flex items-center gap-1">
    <!-- PATCH /users/{id} пока нет на бэке: кнопка всегда disabled -->
    <span title="Редактирование пока недоступно">
      <Button 
        v-if ="canChange"
        icon="pi pi-pencil" 
        severity="secondary" 
        text 
        rounded 
        size="small" 
        disabled 
        aria-label="Редактировать" />
    </span>
    <Button
      v-if="canDelete"
      icon="pi pi-trash"
      severity="danger"
      text
      rounded
      size="small"
      :disabled="deleteDisabled"
      :loading="deleting"
      aria-label="Удалить"
      @click="emit('delete')"
    />
  </div>
</template>

<script setup lang="ts">
      import Button from 'primevue/button'
      
      defineProps<{
        canDelete: boolean
        canChange?: boolean
        deleteDisabled: boolean
        deleting: boolean
      }>()
      
      const emit = defineEmits<{ (e: 'delete'): void }>()
</script>