<template>
    <div class="flex flex-row gap-1">
        <InnerLeftSideBar
          title="Фильтры"
          :items="[]"
          :custom="true"
          :customClasses="'border-y'"
        >
        <SidebarMenuItem class="w-full ">
            <span>
                Категория
            </span>
            <TreeSelect class="w-full " showClear  size="small"></TreeSelect>
        </SidebarMenuItem>
        <SidebarMenuItem class="w-full ">
            <span>
                Материал
            </span>
            <TreeSelect class="w-full " showClear  size="small"></TreeSelect>
        </SidebarMenuItem>
        <SidebarMenuItem class="w-full ">
                <span>
                    Цвет
                </span>
                <TreeSelect class="w-full " showClear  size="small"></TreeSelect>
        </SidebarMenuItem>
        <SidebarMenuItem class="w-full ">
            <SidebarMenuButton class="flex flex-col gap-1!">
                <Button class="w-full ">
                    Применить
                </Button>
                <Button class="w-full " variant="outlined">
                    Сбросить
                </Button>
            </SidebarMenuButton>
        </SidebarMenuItem>
        </InnerLeftSideBar>
    <div class="flex-1  py-2">
        
    </div>
    </div>
    
</template>

<script setup lang="ts">
import {Message, SidebarMenuItem,TreeSelect, Button, Breadcrumb  } from 'primevue';
import { useAuthStore } from '@/stores/authStore'
import { useRoute } from 'vue-router'
import InnerLeftSideBar from '@/components/layout/InnerLeftSideBar.vue';
import { onMounted } from 'vue';

const auth = useAuthStore()
const route = useRoute()

const emit = defineEmits<{ currentPage: [
    page: 
    {
        label:string
        name:string
        url:string
        current:boolean
    }, 
    dep:number] }>()
onMounted(async () => {
    emit('currentPage', {
        "label": 'Каталог',
        "name": 'catalog',
        "url": '/admin/catalog/categories',
        "current": true,
    }, 1)
})
</script>