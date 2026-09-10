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
            <Form v-slot="$form"  :resolver="resolver"  @submit="onFormSubmit" id="login-form" >
              <FormField name="email" v-slot="$field">
                <label for="email" class=" block font-medium ">
                  Email
                </label>
                <InputText id="email" name="email" type="text" v-bind="$field.props" fluid />
                <small v-if="$field.invalid" class="text-red-500 block mt-1">
              {{ $field.error?.message }}
                </small>
              </FormField>
              <FormField name="password" v-slot="$field">
                <label for="password" class=" block font-medium ">
                  Пароль
                </label>
                <Password name="password" id="password" placeholder="Password" v-bind="$field.props"  :feedback="false" fluid toggleMask />
                <small v-if="$field.invalid" class="text-red-500 block mt-1">
              {{ $field.error?.message }}
                </small>
              </FormField>
            </Form>
            </template>
            <template #footer>
              <Button type="submit" label="Войти" form="login-form" fluid/>
            </template>
        </Card>

     </div>
</template>

<script setup lang="ts">
// import { ref } from 'vue';
import {Card,Button, InputText, Password} from 'primevue'
import { Form, FormField} from '@primevue/forms';
import type { FormSubmitEvent } from '@primevue/forms'
interface FormValues {
  email: string
  password: string
}

// ✅ Типизация для ошибок
interface FormErrors {
  email?: { message: string }[]
  password?: { message: string }[]
}

const resolver= (options: { values: Record<string, any> }) => {
  const values = options.values as FormValues
  const errors: FormErrors = {}

  if (!values.email) {
    errors.email = [{ message: 'Email обязателен' }];
  }
  if (!values.password) {
    errors.password = [{ message: 'Пароль обязателен' }];
  }

  // Важно: резолвер должен возвращать объект с values и errors
  return { values, errors };
};
const onFormSubmit = (e: FormSubmitEvent) => {
  console.log('Форма отправлена:', e.values)
}
</script>

