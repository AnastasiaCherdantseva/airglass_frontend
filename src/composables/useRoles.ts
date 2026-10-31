import { computed, nextTick, ref } from 'vue'
import type { Role, RoleFull, newRole } from '@/types/models'
import { useRoleStore } from '@/stores/roleStore'
import { useAuthStore } from '@/stores/authStore'
import { getErrorMessage } from '@/utils/errors'

export function useRoles(initialLimit = 10) {
  const roles = ref<RoleFull[]>([])
  const loading = ref(false)
  const loaded = ref(false)
  const error = ref<string | null>(null)
  const page = ref(1)
  const limit = ref(initialLimit)
  const useRole = useRoleStore()
  const useAuth = useAuthStore()
  const total = computed(()=>useRole.roles.length)
  let requestId = 0

  const rolesWithAssing = computed<Role[]>(()=>{
     const canCreate = useAuth.can('USERS.CREATE');
      if (!canCreate) return [];
      const roleIds: string[] = useAuth.permissions['USERS.CREATE'].conditions.flatMap(
        (c) => (c.roleId != null ? [c.roleId] : []),
      ) ?? [];
      const result = useRole.getByIds(roleIds);
      return result;
  })
  const hasNext = computed(() => roles.value.length === limit.value && page.value * limit.value < total.value)
  async function setPage(value: number): Promise<void> {
    page.value = Math.max(1, value)
    await load()
  }

  async function setLimit(value: number): Promise<void> {
    limit.value = value
    page.value = 1
    await load()
  }
  async function create (data:newRole) : Promise<void> {
    try{
      const created = await useRole.create(data)
      if(!created){
        error.value = 'Не удалось создать роль';
        return;
      }
      await load()
    } catch (e){
      error.value = getErrorMessage(e, 'Не удалось создать роль');
    }
  }
  async function load(): Promise<void> {
    const current = ++requestId
    loading.value = true
    error.value = null
    try {
        const result = await useRole.getRoles()
        if (current !== requestId) return
        roles.value = result
    } catch (e) {
      if (current !== requestId) return
      error.value = getErrorMessage(e, 'Не удалось загрузить пользователей')
    }finally {
      await nextTick()
      if (current === requestId) {
        loading.value = false
        loaded.value = true
      }
    }
  }

  return { 
    roles, 
    loading, 
    rolesWithAssing, 
    load, 
    create, 
    setPage,
    setLimit,
    hasNext, 
    error, 
    loaded,
    page,
    limit,
     }
}