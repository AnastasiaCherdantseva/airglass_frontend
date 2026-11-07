
<template>
  <div>
    <ConfirmDialog />
    <Button
      :label="buttonLabel"
      icon="pi pi-folder-open"
      severity="secondary"
      outlined
      @click="openDialog"
      class="w-full"
      />
      
      <Dialog
      v-model:visible="visible"
      modal
      :closable="false"
      :draggable="false"
      :dismissable-mask="false"
      :style="{ width: 'min(1700px, 95vw)' }"
      :breakpoints="{ '768px': '95vw' }"
       :pt="{
          header: {
            class: 'p-2!', // ← ваши классы
          },
          content:{
            class: 'p-2!', // ← ваши классы
          },
        }"
    >
      <template #header>
        <div class="flex flex-col gap-2 w-full pr-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <InputText
              v-model="searchQuery"
              placeholder="Поиск..."
              class="w-full"
              size="small"
              @keydown.esc="searchQuery = ''"
            />
          </div>

          <Breadcrumb
            :model="breadcrumbs"
            class="border-0 p-0! bg-transparent"
          >
            <template #item="{ item }">
              <button
                class="text-sm transition-colors"
                :class="item.current
                  ? 'font-semibold text-surface-900'
                  : 'text-surface-500 hover:text-primary'"
                @click="navigateTo(item.id)"
              >
                {{ item.label }}
              </button>
            </template>
          </Breadcrumb>
        </div>
      </template>

      <Splitter
        class="h-[60vh] min-h-[390px] border-y border-surface-200"
        :gutter-size="8"
      >
        <!-- Дерево категорий -->
        <SplitterPanel
          :size="20"
          :min-size="15"
          class="min-w-0 min-h-0 overflow-hidden p-0"
        >
        <div class="h-full min-h-0 overflow-y-auto overflow-x-hidden p-0">
          <Tree
            v-model:expandedKeys="expandedKeys"
            v-model:selectionKeys="selectionKeys"
            :value="treeNodes"
            selection-mode="single"
            class="border-0 p-0! pr-2!"
            @node-select="onNodeSelect"
          >
            <template #default="{ node }">
              <div class="flex items-center gap-2 min-w-0">
                <i class="pi pi-folder text-blue-500" />
                <span class="truncate">
                  {{ node.label }}
                </span>
              </div>
            </template>
          </Tree>
        </div>
        </SplitterPanel>

        <!-- Карточки категорий -->
        <SplitterPanel
          :size="60"
          :min-size="30"
          class="min-w-0 min-h-0 overflow-hidden"
        >
        <div class="h-full min-h-0 overflow-y-auto overflow-x-hidden p-4">
          <div
            v-if="loading && !loaded"
            class="flex flex-col items-center justify-center gap-3 min-h-64 text-surface-500"
          >
            <ProgressSpinner
              style="width: 36px; height: 36px"
              :stroke-width="4"
            />
            <span>Загрузка категорий...</span>
          </div>

          <Message
            v-else-if="error"
            severity="error"
            :closable="false"
          >
            {{ error }}
          </Message>

          <div
            v-else
            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          >
            <div
              v-for="category in visibleCategories"
              :key="category.id"
              class="flex flex-col items-center gap-2 min-w-0"
            >
              <!-- Квадрат категории -->
              <div class="relative w-full">
                <button
                  class="w-full aspect-square flex items-center justify-center rounded-sm border transition-colors cursor-pointer overflow-hidden bg-cover bg-center bg-no-repeat"
                  :class="selectedId === category.id
                    ? 'border-primary border-2 bg-primary-50'
                    : 'border-surface-200 bg-surface-50 hover:border-primary-300 hover:bg-surface-100'"
                  :style="category.mediaData
                    ? {
                        backgroundImage: `url('${getMediaUrl(category.mediaData.storageKey)}')`,
                        border: '2px solid var(--p-neutral-300)',
                      }
                    : undefined"
                  @dblclick="openCategory(category)"
                >
                  <i
                    v-if="!category.mediaData"
                    class="pi pi-folder text-5xl text-blue-500"
                  />
                </button>

                <Checkbox
                  :model-value="selectedCategories.some(item => item.id === category.id)"
                  binary
                  class="absolute! top-2 right-2 z-10 rounded-sm!"
                  @update:model-value="(checked:boolean) => {
                    if (checked) {
                      selectCategory(category)
                    } else {
                      removeCategory(category.id)
                    }
                  }"
                />
              </div>

              <!-- Название категории -->
              <span
                class="text-sm font-semibold text-surface-900 text-center break-words w-full"
              >
                {{ category.name }}
              </span>

              <!-- Количество подкатегорий -->
              <span
                v-if="hasChildren(category.id)"
                class="text-xs text-surface-500"
              >
                {{ getChildrenCount(category.id) }} подкатегорий
              </span>
            </div>

            <div
              v-if="visibleCategories.length === 0"
              class="col-span-full flex flex-col items-center justify-center gap-3 min-h-64 text-surface-500"
            >
              <i class="pi pi-folder-open text-4xl" />
              <span>
                {{ searchQuery
                  ? 'Категории не найдены'
                  : 'В этой категории нет вложенных папок' }}
              </span>
            </div>
          </div>
        </div>
        </SplitterPanel>
        <!-- Выбранные категории -->
        <SplitterPanel
          :size="20"
          :min-size="15"
          class="min-w-0 min-h-0 overflow-hidden border-l border-surface-200"
        >
          <div class="h-full min-h-0 flex flex-col overflow-hidden p-3">
            <div class="flex items-center justify-end gap-2 mb-3">
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                size="small"
                :disabled="selectedCategories.length === 0"
                v-tooltip.top="'Удалить выбранные категории'"
                @click="confirmDelete"
              />
            </div>

            <div class="flex-1 min-h-0 overflow-y-auto">
              <div
                v-if="selectedCategories.length === 0"
                class="flex flex-col items-center justify-center gap-2 h-full text-surface-400"
              >
                <i class="pi pi-inbox text-3xl" />
                <span class="text-sm text-center">
                  Нет выбранных категорий
                </span>
              </div>

              <div v-else class="flex flex-col gap-2">
                <div
                  v-for="category in selectedCategories"
                  :key="category.id"
                  class="flex items-center  justify-between gap-2 p-2 rounded-lg bg-surface-50 border border-surface-200"
                >
                  <i class="pi pi-folder text-blue-500 shrink-0" />

                  <span class="text-sm text-surface-900 break-words min-w-0">
                    {{ category.name }}
                  </span>
                  <Button iconOnly variant="text" :size="'small'" @click="removeCategory(category.id)"><Minus/></Button>
                </div>
              </div>
            </div>
          </div>
        </SplitterPanel>
      </Splitter>

      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <Button
            label="Отмена"
            severity="secondary"
            outlined
            @click="visible = false"
          />

          <Button
            label="Выбрать"
            icon="pi pi-check"
            :disabled="selectedCategories.length === 0"
            @click="confirmSelection"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">

import { computed, onMounted, ref } from 'vue'
import {
  Breadcrumb,
  Button,
  Dialog,
  InputText,
  Message,
  ProgressSpinner,
  Tree,
  Splitter,
  SplitterPanel,
  ConfirmDialog,
  Checkbox,

} from 'primevue'
import Minus from '@primeicons/vue/minus';
import { useConfirm } from 'primevue/useconfirm'
import type { Category } from '@/types/models'
import { useCategories } from '@/composables/useCategories'
const confirm = useConfirm()
interface FolderNode {
  key: string
  label: string
  data: Category
  children?: FolderNode[]
}

interface BreadcrumbItem {
  label: string
  id: string | null
  current: boolean
}

const props = withDefaults(
  defineProps<{
    buttonLabel?: string
  }>(),
  {
    buttonLabel: 'Категории',
  },
)

const emit = defineEmits<{
   select: [categories: Category[]]
}>()

const selectedCategories = ref<Category[]>([])
const visible = ref(false)
const {
  categories, 
  loading, 
  load, 
  error, 
  loaded,
  setSelected
} = useCategories()

const currentParentId = ref<string | null>(null)
const selectedId = ref<string | null>(null)
const searchQuery = ref('')

const expandedKeys = ref<Record<string, boolean>>({})
const selectionKeys = ref<Record<string, boolean>>({})

/**
 * Builds a hierarchical tree from flat category data.
 *
 * Строит иерархическое дерево из плоского списка категорий.
 */
function buildTree(parentId: string | null): FolderNode[] {
  return categories.value
    .filter(category => category.parentId === parentId)
    .sort((a, b) =>
      (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
      || a.name.localeCompare(b.name, 'ru'),
    )
    .map(category => {
      const children = buildTree(category.id)

      return {
        key: category.id,
        label: category.name,
        data: category,
        ...(children.length ? { children } : {}),
      }
    })
}

/**
 * Returns all descendants of a category.
 *
 * Возвращает всех потомков категории.
 */
function getDescendants(parentId: string | null): Category[] {
  const result: Category[] = []

  for (const category of categories.value) {
    if (category.parentId !== parentId) continue

    result.push(category)
    result.push(...getDescendants(category.id))
  }

  return result
}

const treeNodes = computed(() => buildTree(null))

/**
 * Returns the current navigation path.
 *
 * Возвращает текущий путь навигации.
 */
const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const path: Category[] = []

  let current = categories.value.find(
    category => category.id === currentParentId.value,
  )

  while (current) {
    path.unshift(current)

    const parentId = current.parentId

    current = parentId
      ? categories.value.find(category => category.id === parentId)
      : undefined
  }

  return [
    {
      label: 'Каталог',
      id: null,
      current: path.length === 0,
    },
    ...path.map((category, index) => ({
      label: category.name,
      id: category.id,
      current: index === path.length - 1,
    })),
  ]
})

/**
 * Returns direct children or recursive search results.
 *
 * Возвращает непосредственные дочерние категории либо
 * результаты рекурсивного поиска в текущей ветке.
 */
const visibleCategories = computed(() => {
  const descendants = getDescendants(currentParentId.value)
  const query = searchQuery.value.trim().toLocaleLowerCase('ru')

  if (!query) {
    return descendants.filter(
      category => category.parentId === currentParentId.value,
    )
  }

  return descendants.filter(category =>
    category.name.toLocaleLowerCase('ru').includes(query)
    || category.code.toLocaleLowerCase('ru').includes(query),
  )
})

/**
 * Opens the dialog and loads categories if necessary.
 *
 * Открывает окно и загружает категории при необходимости.
 */
async function openDialog(): Promise<void> {
    visible.value = true
    selectedId.value = null
    selectionKeys.value = {}
    currentParentId.value = null
    expandedKeys.value = {}
    searchQuery.value = ''

    if (categories.value.length > 0) return
}


function selectCategory(category: Category): void {
  selectedId.value = category.id
  selectionKeys.value = { [category.id]: true }

  if (selectedCategories.value.some(item => item.id === category.id)) {
    return
  }

  selectedCategories.value.push(category)
}
function removeCategory(id:string):void{
    selectedCategories.value=selectedCategories.value.filter(c=>c.id!=id)
    
}


function openCategory(category: Category): void {
  if (!hasChildren(category.id)) return

  navigateTo(category.id)
}

/**
 * Переходит к категории по её идентификатору.
 */
function navigateTo(id: string | null): void {
  currentParentId.value = id
  selectedId.value = id
  selectionKeys.value = id ? { [id]: true } : {}
  searchQuery.value = ''

  const expanded: Record<string, boolean> = {}

  let current = categories.value.find(
    category => category.id === id,
  )

  while (current?.parentId) {
    expanded[current.parentId] = true

    current = categories.value.find(
      category => category.id === current!.parentId,
    )
  }

  if (id) {
    expanded[id] = true
  }

  expandedKeys.value = expanded
}

/**
 * Handles category selection in the tree.
 *
 * Обрабатывает выбор категории в дереве.
 */
function onNodeSelect(node: FolderNode): void {
  navigateTo(node.key)
}

/**
 * Checks whether a category has children.
 *
 * Проверяет наличие дочерних категорий.
 */
function hasChildren(parentId: string): boolean {
  return categories.value.some(
    category => category.parentId === parentId,
  )
}

/**
 * Returns the number of direct child categories.
 *
 * Возвращает количество непосредственных дочерних категорий.
 */
function getChildrenCount(parentId: string): number {
  return categories.value.filter(
    category => category.parentId === parentId,
  ).length
}
/**
 * Builds an absolute URL for a category image.
 *
 * Формирует абсолютный URL изображения категории.
 */
function getMediaUrl(storageKey: string): string {
  const apiOrigin = new URL(import.meta.env.VITE_IMAGES_URL).origin
  return `${apiOrigin}/images/${storageKey}`
}

/**
 * Emits the selected category and closes the dialog.
 *
 * Передаёт выбранную категорию и закрывает окно.
 */
function confirmSelection(): void {
   if (selectedCategories.value.length === 0) return
  setSelected(selectedCategories.value)
  emit('select', [...selectedCategories.value])
  visible.value = false
}
function confirmDelete(): void {
  if (selectedCategories.value.length === 0) return

  confirm.require({
    header: 'Удаление категорий',
    message: `Вы действительно хотите удалить выбранные категории (${selectedCategories.value.length})?`,
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Отмена',
    acceptLabel: 'Удалить',
    acceptClass: 'p-button-danger',
    accept: () => {
      window.alert('Метод удаления категорий пока не реализован.')
    },
  })
}

onMounted(async ()=>{
  await load()
})
</script>
