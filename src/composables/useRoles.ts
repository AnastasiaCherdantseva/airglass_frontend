import { computed, nextTick, ref } from 'vue'
import type { PermissionWithConditions, Role, RoleFull, newRole } from '@/types/models'
import { useRoleStore } from '@/stores/roleStore'
import { useAuthStore } from '@/stores/authStore'
import { getErrorMessage } from '@/utils/errors'
import { accessCodeTranslater } from '@/utils/access'

export function useRoles(initialLimit = 10) {
  const roles = ref<RoleFull[]>([])
  const loading = ref(false)
  const loaded = ref(false)
  const error = ref<string | null>(null)
  const page = ref(1)
  const limit = ref(initialLimit)
  const deletingId = ref<string | null>(null)
  const useRole = useRoleStore()
  const useAuth = useAuthStore()
  const total = computed(()=>useRole.roles.length)
  let requestId = 0

  const rolesWithAssing = computed<RoleFull[]>(()=>{
     const canCreate = useAuth.can('USERS.CREATE');
      if (!canCreate) return [];
      const roleIds: string[] = useAuth.permissions['USERS.CREATE'].conditions.flatMap(
        (c) => (c.roleId != null ? [c.roleId] : []),
      ) ?? [];
      const result = useRole.getByIds(roleIds);
      return result;
  })
  const assignablePermissions = computed<PermissionWithConditions[]>(
    () => Object.values(useAuth.permissions),
  )
// и добавить в return
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
  async function remove(id: string): Promise<void> {
    deletingId.value = id
    error.value = null
    try {
      await useRole.delete(id)
      roles.value = roles.value.filter(u => u.id !== id)
      // если удалили последнего на странице — уходим на предыдущую
      if (roles.value.length === 0 && page.value > 1) {
        page.value -= 1
    }
      await load()
    } catch (e) {
        error.value = getErrorMessage(e, 'Не удалось удалить роль');
    }finally {
      deletingId.value = null
    }
  }
  const rolesWithTags = computed(() => {
    return roles.value.map(role => ({
      ...role,
      tags: getAccessNamesByRole(role).map(name => ({ name, style: 'Secondary' as const })),
    }))
  })

  function getAccessNamesByRole(role:RoleFull): string[] {
      return role.permissions.flatMap(p=>{
        return p.conditions.map(c=> {
          return accessCodeTranslater(p.name,c)
        }
        )
      }
      )
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
      error.value = getErrorMessage(e, 'Не удалось загрузить роли')
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
    getAccessNamesByRole,
    remove,
    hasNext, 
    error, 
    loaded,
    page,
    limit,
    assignablePermissions,
    rolesWithTags,
    deletingId,
     }
}