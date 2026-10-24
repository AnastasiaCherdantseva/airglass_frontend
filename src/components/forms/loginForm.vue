<template>
    <Form  :resolver="resolver"  @submit="onFormSubmit" id="login-form" >
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

<script setup lang="ts">
import {InputText, Password} from 'primevue'
import { Form, FormField} from '@primevue/forms';
import {resolver} from '@/schemas/loginSchema'
import type { FormSubmitEvent } from '@primevue/forms'
import {useAuthStore} from '@/stores/authStore';
import { AuthLoginEmailRequest } from '@/types/REQS';

const emit = defineEmits(['result'])

const AuthStore=useAuthStore()
const onFormSubmit = async (e: FormSubmitEvent) => {
    if (!e.valid) return

    const data: AuthLoginEmailRequest = {
        email: e.values.email,
        password: e.values.password,
    }
    const res = await AuthStore.AuthByLoginEmail(data)
    emit('result', res)
}
</script>
