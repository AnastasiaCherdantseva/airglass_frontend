<template>
    <AdminHeader/>
    <Toast />
    <ConfirmDialog />
    
    <div class="mx-auto px-2 max-w-[2100px] ">
        <router-view/>
    </div>
</template>


<script setup lang="ts">
import AdminHeader from '@/components/layout/adminHeader.vue';
import {ConfirmDialog,Toast,} from 'primevue';

</script>