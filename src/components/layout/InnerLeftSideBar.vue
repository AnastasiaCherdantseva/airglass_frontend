<template>
  <div class="border-x border-gray-200">
    <SidebarLayout>
      <Sidebar
        id="leftSidebar"
        :overlay="false"
        collapsible="icon"
        class="mx-auto"
        v-model:open="open"
      >
        <SidebarSpacer />
        <SidebarAside class="w-auto">
          <SidebarPanel>
            <SidebarHeader class="pb-6!">
              <SidebarMenu>
                <SidebarMenuItem class="p-1 flex! flex-row gap-1 justify-between items-center">
                  <span class="font-semibold text-sm">{{ title }}</span>
                  <SidebarTrigger severity="secondary" target="leftSidebar" :text="true" size="small">
                    <SidebarIcon />
                  </SidebarTrigger>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem
                  v-for="item in items"
                  :key="item.to"
                  class="w-full p-1 text-sm text-surface-600 hover:bg-surface-100 hover:text-surface-900 transition-colors"
                  :class="{ 'bg-surface-100 text-surface-900': isActive(item.to) }"
                >
                  <SidebarMenuButton class="flex-row gap-1!" @click="onItemClick(item.to)">
                    <i
                      v-if="item.icon"
                      :class="[iconClass(item.icon), 'text-surface-400']"
                      style="font-size: 18px"
                    />
                    <span>{{ item.text }}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </SidebarPanel>
        </SidebarAside>
      </Sidebar>
    </SidebarLayout>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import {
      SidebarLayout,
      Sidebar,
      SidebarPanel,
      SidebarHeader,
      SidebarMenu,
      SidebarMenuItem,
      SidebarMenuButton,
      SidebarContent,
      SidebarTrigger,
      SidebarAside,
      SidebarSpacer,
    } from 'primevue';
import SidebarIcon from '@primeicons/vue/sidebar';
// Импортируйте компоненты Sidebar* оттуда же, откуда и раньше
// import { SidebarLayout, Sidebar, ... } from '...'

export interface SidebarNavItem {
  icon?: string // класс primeicons: 'pi-user' или 'pi pi-user'
  text: string
  to: string // адрес перенаправления
}

defineProps<{
  title: string
  items: SidebarNavItem[]
}>()

const open = defineModel<boolean>('open', { default: true })

const router = useRouter()
const route = useRoute()

// Принимает и 'pi-user', и 'pi pi-user'
const iconClass = (icon: string) => (icon.startsWith('pi ') ? icon : `pi ${icon}`)

const isActive = (to: string) => route.path === to

function onItemClick(to: string) {
  if (/^https?:\/\//.test(to)) {
    window.location.href = to
    return
  }
  router.push(to)
}
</script>