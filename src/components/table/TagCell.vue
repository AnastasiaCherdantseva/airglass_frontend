<template>
  <div 
    ref="containerRef" 
    class="flex flex-nowrap gap-1 overflow-hidden"
    @mouseenter="showPopover($event)"
    @mouseleave="hidePopover"
  >
    <!-- Рендерим только теги, которые поместились -->
    <Tag
      v-for="tag in visibleTags"
      :key="tag.name"
      :value="tag.name"
      :severity="tag.style.toLowerCase()"
      :icon="tag.icon"
      class="shrink-0 text-xs px-2 py-0.5"
    />
    
    <!-- Тег с количеством скрытых -->
    <Tag 
      v-if="hiddenCount > 0" 
      :value="`+${hiddenCount}`" 
      severity="secondary"
      class="shrink-0 text-xs px-2 py-0.5 ml-1"
    />
  </div>

  <!-- Скрытый контейнер для измерения ширин всех тегов -->
  <div 
    ref="measureRef"
    class="absolute invisible pointer-events-none flex gap-1 -z-10"
    aria-hidden="true"
  >
    <Tag
      v-for="tag in tags"
      :key="'m-' + tag.name"
      :value="tag.name"
      :severity="tag.style.toLowerCase()"
      :icon="tag.icon"
      class="shrink-0 text-xs px-2 py-0.5"
    />
    <!-- Измеряем ширину тега "+99" -->
    <Tag value="+99" severity="secondary" class="shrink-0 text-xs px-2 py-0.5" />
  </div>
  <Popover ref="popoverRef" class="sm:!w-[560px]">
    <Tag
      v-for="tag in unvisibleTags"
      :key="tag.name"
      :value="tag.name"
      :severity="tag.style.toLowerCase()"
      :icon="tag.icon"
      class="shrink-0 text-xs px-2 py-0.5"
    />
</Popover>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import Popover from 'primevue/popover'
import Tag from 'primevue/tag'

interface TagItem {
  name: string
  style: 'Primary' | 'Secondary' | 'Success' | 'Info' | 'Warn' | 'Danger' | 'Contrast' | 'Transparent'
  icon?: string
}

const props = defineProps<{
  tags: TagItem[]
}>()

const containerRef = ref<HTMLElement | null>(null)
const measureRef = ref<HTMLElement | null>(null)

const containerWidth = ref(0)
const tagWidths = ref<number[]>([])
const plusTagWidth = ref(0)

const popoverRef = ref<InstanceType<typeof Popover> | null>(null)

// Индексы тегов, которые поместились
const visibleIndices = ref<number[]>([])

// Следим за шириной видимого контейнера
useResizeObserver(containerRef, (entries) => {
  const entry = entries[0]
  if (entry) {
    containerWidth.value = entry.contentRect.width
    calculateVisible()
  }
})

watch(
  () => props.tags.map(t => t.name).join('|'), // ← стабильный ключ
  async () => {
    await nextTick()
    measureTags()
    calculateVisible()
  },
  { immediate: true },
)

function measureTags() {
  if (!measureRef.value) return
  const children = Array.from(measureRef.value.children) as HTMLElement[]
  if (children.length === 0) return

  const tagElements = children.slice(0, -1) // все, кроме "+99"
  const plusElement = children[children.length - 1]

  tagWidths.value = tagElements.map(el => el.getBoundingClientRect().width)
  plusTagWidth.value = plusElement.getBoundingClientRect().width + 4 // + gap
}

function calculateVisible() {
  if (containerWidth.value === 0 || tagWidths.value.length === 0) return

  const gap = 4 // gap-1 = 4px
  const usedIndices = new Set<number>()
  let currentWidth = 0

  // Жадный алгоритм: идём по массиву, если тег помещается — берем
  for (let i = 0; i < tagWidths.value.length; i++) {
    const w = tagWidths.value[i] + gap
    if (currentWidth + w + plusTagWidth.value + gap <= containerWidth.value) {
      usedIndices.add(i)
      currentWidth += w
    }
  }

  // Проверяем, есть ли скрытые. Если да — пересчитываем с учетом "+N"
  const hiddenCount = props.tags.length - usedIndices.size
  if (hiddenCount > 0) {
    // Если места под "+N" не хватило, убираем последний добавленный
    if (currentWidth + plusTagWidth.value + gap > containerWidth.value) {
      // Удаляем последний добавленный индекс
      const last = Array.from(usedIndices).pop()
      if (last !== undefined) {
        usedIndices.delete(last)
        currentWidth -= tagWidths.value[last] + gap
      }
    }
  }

  visibleIndices.value = Array.from(usedIndices).sort((a, b) => a - b)
}

const visibleTags = computed(() => visibleIndices.value.map(i => props.tags[i]))
const hiddenCount = computed(() => props.tags.length - visibleIndices.value.length)
const unvisibleTags = computed(() => {
  const visibleSet = new Set(visibleIndices.value)
  return props.tags.filter((_, index) => !visibleSet.has(index))
})

function showPopover(event: MouseEvent) {
  if (hiddenCount.value === 0) return // не показываем, если всё поместилось
  popoverRef.value?.show(event)
}

function hidePopover() {
  popoverRef.value?.hide()
}
</script>