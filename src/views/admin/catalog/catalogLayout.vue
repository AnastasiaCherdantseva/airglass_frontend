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
        <div class="flex-row gap-1" >
            <div v-if="isCategoriesPage" class="flex flex-row gap-1">
                <InnerLeftSideBar
                    title="Фильтры"
                    :items="[]"
                    :custom="true"
                    :customClasses="'border-y'"
                    >
                    <SidebarMenuItem class="w-full ">
                        <CategoryPicker/>
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
            </div>
            <div class="flex-1  py-2">
                <template v-if="isCategoriesPage">
                    <Message v-if="error" severity="error">
                        <div class="flex items-center gap-4">
                            <span>{{ error }}</span>
                            <Button label="Повторить" size="small" severity="secondary" outlined @click="load" />
                        </div>
                    </Message>
                    <div
                        v-else-if="showSkeleton"
                        class="flex flex-col gap-4  border border-slate-200 bg-white p-4 shadow-sm"
                    >
                        <div v-for="i in 5" :key="i" class="flex items-center gap-4">
                            <Skeleton shape="circle" size="2.5rem" />
                            <div class="flex flex-1 flex-col gap-2">
                            <Skeleton width="30%" height="0.9rem" />
                            <Skeleton width="45%" height="0.7rem" />
                            </div>
                            <Skeleton width="5rem" height="1.5rem" />
                            <Skeleton width="4rem" height="1rem" />
                        </div>
                    </div>
                    <EmptyState v-else-if="isEmpty && canCreate"
                        :can-create="canCreate"
                        :textHeader="'Категорий пока нет.'"
                        :canCreateText="'Создайте первую категорий.'"
                        @create="openDrawer"
                    />
                    <template v-else-if="showContent">
                        <div class="flex w-full justify-between pb-2">
                            <div class="flex justify-start">
                                <ViewMode :default="viewMode" @update:modelValue="(val:ViewModeType) => viewMode=val"/>
                            </div>
                            <div class="flex justify-end">
                                <Button
                                v-if="canCreate && !isEmpty"
                                label="Добавить"
                                icon="pi pi-plus"
                                size="small"
                                class="px-5! py-0!"
                                @click="openDrawer"
                                />
                            </div>
                        </div>
                    </template>
                </template>
                <router-view v-slot="{ Component }">
                        <component :is="Component" @currentPage="(page:Page,dep:number) => SetBreadcrumbItems(page,dep)" />
                </router-view>
            </div>
        </div>
    </template>
</template>


<script setup lang="ts">
import {Message, SidebarMenuItem,TreeSelect, Button, Breadcrumb  } from 'primevue';
import InnerLeftSideBar from '@/components/layout/InnerLeftSideBar.vue';
import CategoryPicker from '@/components/category/CategoryPicker.vue';
import { computed, ref , onMounted} from 'vue';
import { useAuthStore } from '@/stores/authStore'
import { useRoute } from 'vue-router'
import router from '@/router';
import { useCategories } from '@/composables/useCategories'
import { ViewModeType } from '@/components/buttons/ViewMode.vue';
const route = useRoute()
const auth = useAuthStore()
interface Page {
    label:string
    name:string
    url:string
    current:boolean
}

const pages =  ref<Page[]>([
    {
        "label": 'Каталог',
        "name": 'catalog',
        "url": '/admin/catalog',
        "current": true,
}
])

function SetBreadcrumbItems (page:Page,dep:number) {
    if(pages.value.length>dep){
        pages.value.splice(1,dep)
    }
    if(page.current){
        pages.value.map(p=>p.current==false)
    }
    pages.value.push(page)
}

const navigate = (url:string) => {
    router.push(url)
};
const isCategoriesPage = computed(() => {
  return route.path.endsWith('/admin/catalog')
})



const serverError = ref<string | null>(null)
const drawerVisible = ref(false)
const { 
    getSelected, 
    loading, 
    load, 
    setPage,
    setLimit,
    error, 
    loaded,
    page,
    limit,
    hasNext, 
    deletingId,
} = useCategories()

const categories = computed(()=>getSelected())
const showSkeleton = computed(() => loading.value && !loaded.value)
const isEmpty = computed(() => loaded.value && !error.value && categories.value.length === 0)
const viewMode = ref<ViewModeType>('table')
const canCreate = computed(() => auth.can('CATEGORIES.CREATE'))
const showContent = computed(() => loaded.value && !error.value && categories.value.length > 0)
function openDrawer(): void {
    serverError.value = null
    drawerVisible.value = true
}
</script>