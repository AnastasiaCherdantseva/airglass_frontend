import { computed, ref } from 'vue'
import type { Role, RoleFull } from '@/types/models'
import { useRoleStore } from '@/stores/roleStore'
import { useAuthStore } from '@/stores/authStore'
import { getErrorMessage } from '@/utils/errors'

export function useRoles() {
  const roles = ref<RoleFull[]>([])
  const loading = ref(false)
  const loaded = ref(false)
  const error = ref<string | null>(null)
  const useRole = useRoleStore()
  const useAuth = useAuthStore()
  
  const rolesWithAssing = computed<Role[]>(()=>{
     const canCreate = useAuth.can('USERS.CREATE');
      if (!canCreate) return [];
      const roleIds: string[] = useAuth.permissions['USERS.CREATE'].conditions.flatMap(
        (c) => (c.roleId != null ? [c.roleId] : []),
      ) ?? [];
      const result = useRole.getByIds(roleIds);
      return result;
  })

  async function load(): Promise<void> {
    loading.value = true
    error.value = null
    try {
        const result = await useRole.getRoles()
        roles.value = result
    } catch (e) {
      error.value = getErrorMessage(e, 'Не удалось загрузить пользователей')
    } finally {
        loading.value = false
        loaded.value = true
    }
  }

  return { roles, loading, rolesWithAssing, load, error, loaded }
}