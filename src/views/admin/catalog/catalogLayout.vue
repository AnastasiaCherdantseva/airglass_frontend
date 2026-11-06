<template>
    <Message v-if="!auth.me " severity="warn">
        У вас нет доступа к этой странице.
      </Message>
      
      <template v-else>
        <Breadcrumb :model="pages" class="p-1!">
            <template #item="{ item }">
                <span v-if="item.current" class="p-breadcrumb-item-link font-semibold">{{ item.label }}</span>
                <a v-else class="p-breadcrumb-item-link cursor-pointer" @click="navigate(item.url)">{{ item.label }}</a>
            </template>
        </Breadcrumb>
        
        <router-view v-slot="{ Component }">
            <div class="flex-row gap-1" >
                <component :is="Component" @currentPage="(page:Page,dep:number) => SetBreadcrumbItems(page,dep)" />
            </div>
        </router-view>

        </template>
</template>


<script setup lang="ts">
import {Message, SidebarMenuItem,TreeSelect, Button, Breadcrumb  } from 'primevue';
import { watch,computed, ref } from 'vue';
import { useAuthStore } from '@/stores/authStore'
import router from '@/router';
const auth = useAuthStore()

interface Page {
    label:string
    name:string
    url:string
    current:boolean
}

const pages =  ref<Page[]>([])

function SetBreadcrumbItems (page:Page,dep:number) {
    if(pages.value.length>dep){
        pages.value.splice(0,dep)
    }
    if(page.current){
        pages.value.map(p=>p.current==false)
    }
    pages.value.push(page)
}

const navigate = (url:string) => {
    router.push(url)
};
</script>