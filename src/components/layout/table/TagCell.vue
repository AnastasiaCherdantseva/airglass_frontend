<template>
  <!-- Контейнер, который измеряет директор -->
  <div 
    v-fit-children="{ 
      offsetNeededInPx: 60, 
      gap: 4 
    }"
    class="flex flex-nowrap gap-1 overflow-hidden"
    @fit-children-updated="onUpdate"

  >
    <!-- Теги для отображения -->
    <Tag
      v-for="tag in tags"
      :key="tag.name"
      :value="tag.name"
      :severity="tag.style.toLowerCase()"
      :icon="tag.icon"
      class="shrink-0 text-xs px-2 py-0.5" 
    />
    
    <Tag 
      v-if="hiddenCount > 0" 
      :value="`+${hiddenCount}`" 
      severity="secondary"
      data-v-fit-keep
      class="shrink-0 text-xs px-2 py-0.5 ml-1"
    />
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Tag from 'primevue/tag'
// Импортируем тип для события, чтобы TS не ругался
import type { FitChildrenEventDetail } from '@ozjsey/v-fit-children' 

interface TagItem {
  name: string
  style: 'Primary' | 'Secondary' | 'Success' | 'Info' | 'Warn' | 'Danger' | 'Contrast' | 'Transparent'
  icon?: string
}

defineProps<{
  tags: TagItem[]
}>()

// Сюда будет записываться количество скрытых тегов
const hiddenCount = ref(0)

function onUpdate(e: CustomEvent<FitChildrenEventDetail>) {
  hiddenCount.value = e.detail.hiddenChildrenCount
}
</script>