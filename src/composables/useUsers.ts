import { computed, ref } from 'vue'
import { UserCreate, UserFull } from '@/types/models'
import { useUserStore } from '@/stores/userStore'

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback
}

export function useUsers(initialLimit = 10) {
  const users = ref<UserFull[]>([])
  const loading = ref(false)
  const loaded = ref(false)
  const error = ref<string | null>(null)
  const page = ref(1)
  const limit = ref(initialLimit)
  const total = ref<number>(0)
  const deletingId = ref<string | null>(null)
  const useUser = useUserStore()
  let requestId = 0

  // Общего количества нет в API: если пришло ровно limit записей — возможно, есть следующая страница.
  const hasNext = computed(() => users.value.length === limit.value && page.value * limit.value < total.value)
  async function load(): Promise<void> {
    const current = ++requestId
    loading.value = true
    error.value = null
    try {
        const result = await useUser.getUsers(limit.value,page.value)
        if (current !== requestId) return
        users.value = result
        total.value = useUser.total
    } catch (e) {
      if (current !== requestId) return
      error.value = getErrorMessage(e, 'Не удалось загрузить пользователей')
    } finally {
      if (current === requestId) {
        loading.value = false
        loaded.value = true
      }
    }
  }

  async function setPage(value: number): Promise<void> {
    page.value = Math.max(1, value)
    await load()
  }

  async function setLimit(value: number): Promise<void> {
    limit.value = value
    page.value = 1
    await load()
  }

  async function create(payload: UserCreate): Promise<void> {
    try{
        const created = await useUser.createUser(payload)
        if (!created) {
            error.value = 'Не удалось создать пользователя';
            return;
        }
        await load()
    }catch (e) {
        error.value = getErrorMessage(e, 'Не удалось создать пользователя');
    }
  }

  async function remove(id: string): Promise<void> {
    deletingId.value = id
    error.value = null
    try {
      await useUser.deleteUser(id)
      users.value = users.value.filter(u => u.id !== id)
      // если удалили последнего на странице — уходим на предыдущую
      if (users.value.length === 0 && page.value > 1) {
        page.value -= 1
    }
      await load()
    } catch (e) {
        error.value = getErrorMessage(e, 'Не удалось удалить пользователя');
    }finally {
      deletingId.value = null
    }
  }

  return {
    users,
    loading,
    loaded,
    error,
    page,
    limit,
    hasNext,
    deletingId,
    load,
    setPage,
    setLimit,
    create,
    remove,
  }
}