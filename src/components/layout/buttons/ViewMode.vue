<template>
    <SelectButton
        v-model="viewMode"
        size="small"
        :options="viewOptions"
        option-label="label"
        option-value="value"
        :allow-empty="false"
        aria-label="Режим отображения"
        >
        <template #option="{ option }">
            <span class="flex items-center gap-2 text-sm">
                <i :class="option.icon" />
                {{ option.label }}
            </span>
        </template>
    </SelectButton>
</template>

<script setup lang="ts">
    import {SelectButton,} from 'primevue';
    import { ref } from 'vue';

    export type ViewModeType = 'table' | 'cards'

    const props = withDefaults(
    defineProps<{
        default?: ViewModeType
    }>(),
    {
        default: 'table',
    },
    )

    const viewMode = ref<ViewModeType>(props.default)

    const viewOptions: { label: string; value: ViewModeType; icon: string }[] = [
    { label: 'Таблица', value: 'table', icon: 'pi pi-table' },
    { label: 'Карточки', value: 'cards', icon: 'pi pi-th-large' },
    ]
</script>