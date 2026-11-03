<template>
  <Drawer
    :visible="visible"
    position="right"
    class="!w-full sm:!w-[840px]"
    @update:visible="emit('update:visible', $event)"
  >
    <template #header>
      <span class="text-xl font-semibold text-slate-900">Создать роль</span>
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
            Название роли <span class="text-red-500">*</span>
          </label>
          <InputText
            
            id="cr-name"
            name="name"
            size="small"
            placeholder="Введите название роли"
            :input-props="{ autocomplete: 'off' }"
            class="rounded-sm!"
            fluid
          />
          <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
            {{ $form.name.error?.message }}
          </Message>
        </div>
  
        <div class="flex flex-col gap-1.5">
          <label for="cr-name" class="text-sm font-medium text-slate-700">
            Статус <span class="text-red-500">*</span>
          </label>
          <SelectButton
                v-model="isActive"
                name="isActive"
                size="small"
                :options="[
                { label: 'Активна', value: true },
                { label: 'Не активна', value: false },
                ]"
                option-label="label"
                option-value='value'
                :allow-empty="false"
                :pt="{
                    pcToggleButton: {
                        root: {
                            class: 
                                'rounded-sm'
                        },
                    },
                }"
            >
                <template #option="{ option }">
                    <span class="flex items-center gap-2 text-sm ">
                        <i :class="option.icon" />
                        {{ option.label }}
                    </span>
                </template>
            </SelectButton>
        </div>
    </div>

      <div class="flex flex-col gap-1.5">
        <label for="cr-description" class="text-sm font-medium text-slate-700">Описание</label>
        <Textarea
          id="cr-description"
          name="description"
          placeholder="Краткое описание роли (необязательно)"
          rows="3"
          class="rounded-sm!"
          fluid
        />
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <span class="text-base font-semibold text-slate-900">Права доступа</span>
          <i
            class="pi pi-info-circle text-slate-400"
            title="Можно выдать только те права, которые есть у вас"
          />
        </div>
<!-- 
        <PickList
          :model-value="[sourceItems, target]"
          data-key="code"
          :show-source-controls="false"
          :show-target-controls="false"
          :show-source-filter="true"
          :show-target-filter="false"
          filter-by="codeRUS"
          source-filter-placeholder="Поиск прав..."
          emptyFilterMessage="Нет результатов"
          emptyMessage="Вы не выбрали ни одно право"
          breakpoint="840px"
          list-style="height: 22rem"
          :pt="pickListPt"
          @update:model-value="onPickListChange"
        >
          <template #sourceheader>
              <span class="text-sm font-medium text-slate-500">Доступные права</span>
          </template>
          <template #targetheader>
            <span class="text-sm font-medium text-slate-500">Выбранные права</span>
          </template>

          <template #option="{ option }">
            <div class="flex w-full flex-col gap-1.5">
              <div
                v-if="!isSelected(option) && isGroupStart(option)"
                class="pt-1 text-xs font-semibold text-slate-800"
              >
                {{ option.resourceRUS}}
              </div>

              <div class="flex w-full items-center gap-2">
                <i
                  v-if="!isSelected(option)"
                  class="pi pi-plus cursor-pointer text-xs text-slate-400"
                  aria-label="Добавить право"
                  @click.stop="add(option)"
                />
                <i v-else class="pi pi-bolt text-xs text-emerald-600" />

                <span
                  class="rounded-sm bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                >
                  {{ option.codeRUS }}
                </span>

                <i
                  v-if="isSelected(option)"
                  class="pi pi-times cursor-pointer text-xs text-slate-400 hover:text-slate-700"
                  aria-label="Убрать право"
                  @click.stop="remove(option)"
                />
              </div>
            </div>
          </template>
        </PickList> -->

        <MyPickList
          :sourceItems="options"
          :targetItems="[]"
          @update:target-items="(items) => target = items"
        />
        <Message v-if="conditionError" severity="error" size="small" variant="simple">
            {{ conditionError  }}
        </Message>
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

      <div class="flex items-start gap-2 text-xs text-slate-500">
        <i class="pi pi-info-circle mt-0.5" />
        <span>Роль будет доступна для назначения пользователям</span>
      </div>
    </Form>
  </Drawer>
</template>

<script setup lang="ts">
    import { computed, ref, watch } from 'vue'
    import Button from 'primevue/button'
    import Drawer from 'primevue/drawer'
    import InputText from 'primevue/inputtext'
    import Message from 'primevue/message'
    import MyPickList from '@/components/Any/MyPickList.vue'
    import Textarea from 'primevue/textarea'
    import { Form } from '@primevue/forms'
    import type { FormSubmitEvent } from '@primevue/forms'
    import SelectButton from 'primevue/selectbutton';
    import { resolver } from '@/schemas/createRoleSchema'
    import type { newRole } from '@/types/models'
    import { PermissionAction, PermissionResource } from '@/types/enums'
    import { useRoles } from '@/composables/useRoles'
    import { accessCodeTranslater, accessResourseTranslater } from '@/utils/access';
    
    interface PermissionOption {
        key: string
        name:string
        groupName:string
    }

    const props = defineProps<{
      visible: boolean
      submitting: boolean
      serverError: string | null
    }>()

    const emit = defineEmits<{
      (e: 'update:visible', value: boolean): void
      (e: 'submit', value: newRole): void
    }>()

    const conditionError = ref<string | null>(null)
    const { assignablePermissions } = useRoles()
    const isActive = ref(true) 
    const formKey = ref(0)
    const initialValues = { name: '', description: '',conditionIds: [] as string[], }

    const search = ref('')
    const target = ref<PermissionOption[]>([])

    const resourceOrder = Object.values(PermissionResource) as string[]
    const actionOrder = Object.values(PermissionAction) as string[]

    // Все права, которые текущий пользователь может выдать (сгруппированы по ресурсу)
    const options = computed<PermissionOption[]>(() =>
      assignablePermissions.value
        .flatMap((p) => {
          const conditions = p.conditions
          const [resource = ''] = p.code.split('.')
            return conditions.map(c=>
                ({
                    key:c.id,
                    name: accessCodeTranslater(p.name, c),
                    groupName: accessResourseTranslater(resource),
            }))
        })
        .sort(
          (a, b) =>
            resourceOrder.indexOf(a.groupName) - resourceOrder.indexOf(b.groupName) ||
            actionOrder.indexOf(a.name) - actionOrder.indexOf(b.name),
        ),
    )
    // Сбрасываем форму при каждом открытии
    watch(
      () => props.visible,
      (value) => {
        if (value) {
          formKey.value += 1
          target.value = []
          search.value = ''
        }
      },
    )

    function onSubmit(event: FormSubmitEvent<Record<string, any>>): void {
      if (!event.valid) return
       if (target.value.length === 0) {
        // Показать ошибку под PickList
        conditionError.value = 'Выберите хотя бы одно право'
        return
      }
      conditionError.value = null
      const description = String(event.values.description ?? '').trim()
      emit('submit', {
        name: String(event.values.name).trim(),
        description: description || null,
        isActive: isActive.value, 
        conditionIds: target.value.map(v=>v.key),
      })
    }
</script>