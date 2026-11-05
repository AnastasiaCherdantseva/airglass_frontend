<template>
        <PickList
          :model-value="model"
          data-key="key"
          :show-source-controls="false"
          :show-target-controls="false"
          :show-source-filter="true"
          :show-target-filter="false"
          filter-by="name"
          :source-filter-placeholder='filterPlaceholder'
          :emptyFilterMessage="emptyFilterMessage"
          :emptyMessage="emptyMessage"
          breakpoint="840px"
          list-style="height: 22rem"
          :pt="pickListPt"
        >
          <template #sourceheader>
              <span class="text-sm font-medium text-slate-500">{{sourceheader}}</span>
          </template>
          <template #targetheader>
            <span class="text-sm font-medium text-slate-500">{{ targetheader }}</span>
          </template>

          <template #option="{ option }">
            <div class="flex w-full flex-col gap-1.5">
              <div
                v-if="!selectedKeys.has(option.key) && isGroupStart(option)"
                class="pt-1 text-xs font-semibold text-slate-800"
              >
                <i
                    class="pi pi-plus cursor-pointer text-xs text-slate-400"
                    aria-label="Добавить"
                    @click.stop="add(option, true)"
                />
                {{ option.groupName}}
              </div>

              <div  class="flex w-full items-center gap-2">
                <i
                  v-if="!selectedKeys.has(option.key)"
                  class="pi pi-plus cursor-pointer text-xs text-slate-400"
                  aria-label="Добавить"
                  @click.stop="add(option)"
                />
                <i v-else class="pi pi-bolt text-xs text-emerald-600" />

                <span
                  class="rounded-sm bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                >
                  {{ option.name }}
                </span>

                <i
                  v-if="selectedKeys.has(option.key)"
                  class="pi pi-times cursor-pointer text-xs text-slate-400 hover:text-slate-700"
                  aria-label="Убрать право"
                  @click.stop="remove(option)"
                />
              </div>
            </div>
          </template>
        </PickList>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import PickList from 'primevue/picklist'
    
    const pickListPt = {
      pcMoveAllToTargetButton: { root: { class: 'hidden' } },
      pcMoveAllToSourceButton: { root: { class: 'hidden' } },
      transferControls: { class: 'hidden!' },
      sourceListContainer: { class: 'rounded-sm!' },
      targetListContainer: { class: 'rounded-sm!' },
      list: { class: 'rounded-sm!' },
      option: { class: 'rounded-sm!' },
      pcListbox: {
        pcFilter: {
        root: {
            class: 'rounded-sm! text-sm!' 
        }
        },
        pcFilterContainer: {
        class: 'rounded-sm!'
        }
    },
    }
    interface Option {
        key: string
        name:string
        groupName:string
    }

    interface Props {
      sourceItems : Option[]
      targetItems : Option[]
      filterPlaceholder?: string
      emptyFilterMessage?: string
      emptyMessage?: string
      sourceheader?: string
      targetheader?: string
    }
    const props = withDefaults(defineProps<Props>(), {
        sourceItems: () => [],
        targetItems: () => [],
        filterPlaceholder: () => 'Поиск',
        emptyFilterMessage: () => 'Нет результатов',
        emptyMessage: () => 'Выберите хотя бы один вариант',
        sourceheader: () => 'Первый список',
        targetheader: () => 'Второй список',
    })
    const emit = defineEmits<{
        (e: 'update:targetItems', items: Option[]): void
    }>()

    const allOptions = computed<Option[]>(() => [
  ...props.sourceItems,
  ...props.targetItems,
])

    const selectedKeys = ref<Set<string>>(
    new Set(props.targetItems.map(o => o.key)),
    )

    const sourceList = computed(() =>
    [...allOptions.value]
        .filter(o => !selectedKeys.value.has(o.key))
        .sort((a, b) => {
        // Сначала по groupName (лексикографически)
        const groupCompare = a.groupName.localeCompare(b.groupName)
        if (groupCompare !== 0) return groupCompare
        // Если группы одинаковые — по name
        return a.name.localeCompare(b.name)
        }),
    )

    const targetList = computed(() =>
    [...allOptions.value]
        .filter(o => selectedKeys.value.has(o.key))
        .sort((a, b) => {
        const groupCompare = a.groupName.localeCompare(b.groupName)
        if (groupCompare !== 0) return groupCompare
        return a.name.localeCompare(b.name)
        }),
    )

    const model = computed<[Option[], Option[]]>(() => [
    sourceList.value,
    targetList.value,
    ])

    function add(option: Option, isFullGroup: boolean = false): void {
        if (!isFullGroup) {
            // Добавляем только один элемент
            selectedKeys.value = new Set([...selectedKeys.value, option.key])
            return
        }

        // Добавляем всю группу
        const groupItems = allOptions.value.filter(
            (o) => o.groupName === option.groupName,
        )
        const groupKeys = groupItems.map((o) => o.key)

        selectedKeys.value = new Set([...selectedKeys.value, ...groupKeys])
    }

    function remove(option: Option): void {
    const next = new Set(selectedKeys.value)
    next.delete(option.key)
    selectedKeys.value = next
    }
    function isGroupStart(option: Option): boolean {
      return sourceList.value.find((o) => o.groupName === option.groupName)?.key === option.key
    }
    watch(
        targetList,
        (items) => {
            emit('update:targetItems', items)
        },
        { immediate: true }, // чтобы родитель получил начальное значение
    )

    onMounted(()=>{
        console.log(sourceList.value)
    })
</script>