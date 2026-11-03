import { computed, nextTick, ref } from 'vue'
import type { Organization, OrganizationCreate} from '@/types/models'
import { getErrorMessage } from '@/utils/errors'
import { useOrganizationStore } from '@/stores/organizationStore'

export function useOrganizations(initialLimit = 10) {
  const organizations = ref<Organization[]>([])
  const loading = ref(false)
  const loaded = ref(false)
  const error = ref<string | null>(null)
  const page = ref(1)
  const limit = ref(initialLimit)
  const deletingId = ref<string | null>(null)
  const useOrg = useOrganizationStore()
  const total = computed(()=>useOrg.organizations.length)
  let requestId = 0

  const hasNext = computed(() => organizations.value.length === limit.value && page.value * limit.value < total.value)
  async function setPage(value: number): Promise<void> {
    page.value = Math.max(1, value)
    await load()
  }

  async function setLimit(value: number): Promise<void> {
    limit.value = value
    page.value = 1
    await load()
  }
  async function create (data:OrganizationCreate) : Promise<void> {
    try{
      const created = await useOrg.create(data)
      if(!created){
        error.value = 'Не удалось создать организацию';
        return;
      }
      await load()
    } catch (e){
      error.value = getErrorMessage(e, 'Не удалось создать организацию');
    }
  }
  async function remove(id: string): Promise<void> {
    deletingId.value = id
    error.value = null
    try {
      await useOrg.delete(id)
      organizations.value = organizations.value.filter(u => u.id !== id)
      if (organizations.value.length === 0 && page.value > 1) {
        page.value -= 1
    }
      await load()
    } catch (e) {
        error.value = getErrorMessage(e, 'Не удалось удалить роль');
    }finally {
      deletingId.value = null
    }
  }

  async function load(): Promise<void> {
    const current = ++requestId
    loading.value = true
    error.value = null
    try {
        const result = await useOrg.get()
        if (current !== requestId) return
        organizations.value = result
    } catch (e) {
      if (current !== requestId) return
      error.value = getErrorMessage(e, 'Не удалось загрузить организации')
    }finally {
      await nextTick()
      if (current === requestId) {
        loading.value = false
        loaded.value = true
      }
    }
  }

  return { 
    organizations, 
    loading, 
    load, 
    create, 
    setPage,
    setLimit,
    remove,
    hasNext, 
    error, 
    loaded,
    page,
    limit,
    deletingId,
     }
}