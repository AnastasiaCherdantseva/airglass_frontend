<template>
    <PublicHeader></PublicHeader>
    <Toast />
    <ConfirmDialog />
    
    <div class="mx-auto px-2  flex max-w-[2100px] flex-row gap-1">
        <router-view/>
    </div>
</template>


<script setup lang="ts">
import PublicHeader from '@/components/layout/publicHeader.vue';
import {ConfirmDialog,Toast,} from 'primevue';

</script>