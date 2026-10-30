
<template>
  <Drawer
    :visible="visible"
    position="right"
    class="!w-full sm:!w-[420px]"
    @update:visible="emit('update:visible', $event)"
  >
    <template #header>
      <span class="text-xl font-semibold text-slate-900">Создать пользователя</span>
    </template>

    <Form
      :key="formKey"
      v-slot="$form"
      :resolver="resolver"
      :initial-values="initialValues"
      class="flex flex-col gap-5"
      @submit="onSubmit"
      autocomplete="off"
    >
      <Message v-if="serverError" severity="error" size="small">{{ serverError }}</Message>

      <div class="flex flex-col gap-1.5">
        <label for="cu-name" class="text-sm font-medium text-slate-700">
          Имя <span class="text-red-500">*</span>
        </label>
        <IconField>
          <InputIcon class="pi pi-user" />
          <InputText id="cu-name" name="name" placeholder="Иван Иванов" :input-props="{ autocomplete: 'off' }"    fluid />
        </IconField>
        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
          {{ $form.name.error?.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-1.5">
        <label for="cu-email" class="text-sm font-medium text-slate-700">
          Email <span class="text-red-500">*</span>
        </label>
        <IconField>
          <InputIcon class="pi pi-envelope" />
          <InputText id="cu-email" name="email" type="email" placeholder="user@company.ru"  :input-props="{ autocomplete: 'off' }"   fluid />
        </IconField>
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
          {{ $form.email.error?.message }}
        </Message>
      </div>


      <div class="flex flex-col gap-1.5">
        <label for="cu-password" class="text-sm font-medium text-slate-700">
          Пароль <span class="text-red-500">*</span>
        </label>
        <Password
          input-id="cu-password"
          name="password"
          placeholder="Минимум 8 символов"
          :feedback="false"
          toggle-mask
          :input-props="{ autocomplete: 'new-password' }" 
          fluid
        />
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
          {{ $form.password.error?.message }}
        </Message>
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="cu-roles" class="text-sm font-medium text-slate-700">
          Роли <span class="text-red-500">*</span>
        </label>
        <MultiSelect
          input-id="cu-roles"
          name="roleIds"
          :options="rolesWithAssing"
          option-label="name"
          option-value="id"
          placeholder="Выберите роли"
          empty-message="Список ролей недоступен"
          :loading="loading"
          display="chip"
          fluid
        />
        <small class="text-xs text-slate-500">Можно выбрать несколько</small>
        <Message v-if="$form.roleIds?.invalid" severity="error" size="small" variant="simple">
          {{ $form.roleIds.error?.message }}
        </Message>
        <Message v-if="!loading && rolesWithAssing.length === 0" severity="warn" size="small">
          Вы не можете назначать роли. Создание пользователя невозможно.
        </Message>
      </div>

      <div class="mt-4 flex gap-3">
        <Button
          type="button"
          label="Отмена"
          severity="secondary"
          outlined
          class="flex-1"
          :disabled="submitting"
          @click="emit('update:visible', false)"
        />
        <Button type="submit" label="Создать" class="flex-1" :loading="submitting" />
      </div>

      <div class="flex items-start gap-2 text-xs text-slate-500">
        <i class="pi pi-info-circle mt-0.5" />
        <span>Пользователь будет неактивен до подтверждения email</span>
      </div>
    </Form>
  </Drawer>
</template>

<script setup lang="ts">
    import { ref, watch } from 'vue'
    import Button from 'primevue/button'
    import Drawer from 'primevue/drawer'
    import IconField from 'primevue/iconfield'
    import InputIcon from 'primevue/inputicon'
    import InputText from 'primevue/inputtext'
    import Message from 'primevue/message'
    import MultiSelect from 'primevue/multiselect'
    import Password from 'primevue/password'
    import { Form } from '@primevue/forms'
    import type { FormSubmitEvent } from '@primevue/forms'
    import { resolver,} from '@/schemas/createUserSchema'
    import type { UserCreate } from '@/types/models'
    import {useRoles} from '@/composables/useRoles'

    const props = defineProps<{
      visible: boolean
      submitting: boolean
      serverError: string | null
    }>()

    const {loading, rolesWithAssing} = useRoles()

    const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'submit', value: UserCreate): void
    }>()

    const formKey = ref(0)
    const initialValues: UserCreate = { email: '', name: '', password: '', roleIds: [] }

    // Сбрасываем форму при каждом открытии
    watch(
    () => props.visible,
    (value) => {
        if (value) formKey.value += 1
    },
    )

    function onSubmit(event: FormSubmitEvent<Record<string, any>>): void {
      if (!event.valid) return;

    // Приводим values к вашему типу
      const data = event.values as UserCreate;
      emit('submit', data)
    }
</script>