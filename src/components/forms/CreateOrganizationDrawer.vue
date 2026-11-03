<template>
  <Drawer
    :visible="visible"
    position="right"
    class="!w-full sm:!w-[420px]"
    @update:visible="emit('update:visible', $event)"
  >
    <template #header>
      <span class="text-xl font-semibold text-slate-900">Создать организацию</span>
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
      <div class="flex flex-row gap-1.5">
          <div class="flex-1 flex flex-col gap-1.5">
            <label for="cr-name" class="text-sm font-medium text-slate-700">
              Название организации <span class="text-red-500">*</span>
            </label>
            <InputText
              
              id="cr-name"
              name="name"
              size="small"
              placeholder="Введите название организации"
              :input-props="{ autocomplete: 'off' }"
              class="rounded-sm!"
              fluid
            />
            <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
              {{ $form.name.error?.message }}
            </Message>
          </div>
      </div>
      <div class="flex flex-row gap-1.5">
          <div class="flex-1 flex flex-col gap-1.5">
            <label for="cr-inn" class="text-sm font-medium text-slate-700">
              ИНН <span class="text-red-500">*</span>
            </label>
            <InputText
              
              id="cr-inn"
              name="inn"
              size="small"
              placeholder="Введите ИНН"
              v-mask="'999999999999'"
              :input-props="{ autocomplete: 'off' }"
              class="rounded-sm!"
              fluid
            />
            <Message v-if="$form.inn?.invalid" severity="error" size="small" variant="simple">
              {{ $form.inn.error?.message }}
            </Message>
          </div>
      </div>

      <div class="flex flex-row gap-1.5">
          <div class="flex-1 flex flex-col gap-1.5">
            <label for="cr-address" class="text-sm font-medium text-slate-700">
              Адрес 
            </label>
            <InputText
              id="cr-address"
              name="address"
              size="small"
              placeholder="Введите адрес"
              :input-props="{ autocomplete: 'off' }"
              class="rounded-sm!"
              fluid
            />
          </div>
      </div>


      <div class="mt-2 flex gap-3">
        <Button
          type="button"
          label="Отмена"
          severity="secondary"
          outlined
          class="flex-1 rounded-sm!"
          :disabled="submitting"
          @click="emit('update:visible', false)"
        />
        <Button
          type="submit"
          label="Создать"
          class="flex-1 rounded-sm!"
          :loading="submitting"
        />
      </div>
    </Form>
  </Drawer>
</template>

<script setup lang="ts">
    import {  ref, watch } from 'vue'
    import Button from 'primevue/button'
    import Drawer from 'primevue/drawer'
    import InputText from 'primevue/inputtext'
    import Message from 'primevue/message'
    import { Form } from '@primevue/forms'
    import type { FormSubmitEvent } from '@primevue/forms'
    import { resolver } from '@/schemas/createOrganizationSchema'
  import { OrganizationCreate } from '@/types/models'
    
    const props = defineProps<{
      visible: boolean
      submitting: boolean
      serverError: string | null
    }>()

    const emit = defineEmits<{
      (e: 'update:visible', value: boolean): void
      (e: 'submit', value: OrganizationCreate): void
    }>()

    const formKey = ref(0)
    const initialValues = { name: '', inn: '',adsress: '', }


    // Сбрасываем форму при каждом открытии
    watch(
      () => props.visible,
      (value) => {
        if (value) {
          formKey.value += 1
        }
      },
    )

    function onSubmit(event: FormSubmitEvent<Record<string, any>>): void {
      if (!event.valid) return
      emit('submit', {
        name: String(event.values.name).trim(),
        inn: String(event.values.inn).trim(),
        address: event.values.address? String(event.values.address).trim(): null, 
      })
    }
</script>