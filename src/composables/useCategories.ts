import { computed, nextTick, ref } from 'vue'
import type { Category} from '@/types/models'
import { getErrorMessage } from '@/utils/errors'
import { useCategoryStore } from '@/stores/categoryStore'

export function useCategories(initialLimit = 10) {
  const categories = ref<Category[]>([])
  const selectedcategories = ref<Category[]>([])
  const loading = ref(false)
  const loaded = ref(false)
  const error = ref<string | null>(null)
  const page = ref(1)
  const limit = ref(initialLimit)
  const deletingId = ref<string | null>(null)
  const useCats = useCategoryStore()
  const total = computed(()=>useCats.categories.length)
  let requestId = 0

  const hasNext = computed(() => categories.value.length === limit.value && page.value * limit.value < total.value)
  async function setPage(value: number): Promise<void> {
    page.value = Math.max(1, value)
    await load()
  }

  async function setLimit(value: number): Promise<void> {
    limit.value = value
    page.value = 1
    await load()
  }
 
  async function load(): Promise<void> {
    const current = ++requestId
    loading.value = true
    error.value = null
    try {
        const result = await useCats.get()
        if (current !== requestId) return
        categories.value = result
    } catch (e) {
      if (current !== requestId) return
      error.value = getErrorMessage(e, 'Не удалось загрузить категории')
    }finally {
      await nextTick()
      if (current === requestId) {
        loading.value = false
        loaded.value = true
      }
    }
  }
  function setSelected(cats:Category[]){
    selectedcategories.value = cats
  }
  function getSelected(){
    return selectedcategories.value
  }


  return { 
    categories, 
    loading, 
    load, 
    setPage,
    setLimit,
    hasNext, 
    error, 
    loaded,
    page,
    limit,
    deletingId,
    setSelected,
    getSelected
     }
}