<template>
    <!-- Карточка -->
     <div class="min-h-screen flex justify-center items-center w-full">
        <Card class="flex items-center w-1/4" 
        :pt="{
            body: {
              class: 'w-full'
            }
          }"
        >
          <template #title>
           <div class="text-center">
             Добро пожаловать
           </div>
         </template>
          <template #content>
            <loginForm @result="(res)=> auth(res)"></loginForm>
            </template>
            <template #footer>
              <Button type="submit" label="Войти" form="login-form" fluid/>
              <small v-if="isAuthSuccess == false" class="text-red-500 block mt-1">
                Ошибка входа
              </small>
            </template>
            
        </Card>

     </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {Card,Button} from 'primevue'
import loginForm from '@/components/forms/loginForm.vue';
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute();
const isAuthSuccess = ref<boolean | null>(null);

function auth(res:boolean){
  isAuthSuccess.value = res
  if(isAuthSuccess.value){
    const redirect = route.query.redirect;
    const target = typeof redirect === 'string' ? redirect : '/home';

    router.push(target);
  } 
}

</script>

