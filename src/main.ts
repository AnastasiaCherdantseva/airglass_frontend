import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

import 'primeicons/primeicons.css'
import './assets/css/main.css'

import PrimeVue from 'primevue/config'
import Lara from '@primevue/themes/lara'
import { definePreset } from '@primevue/themes'

import { useAuthStore } from '@/stores/authStore.ts' 
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import { vFitChildren } from '@ozjsey/v-fit-children'
// const EmeraldPreset = definePreset(Lara, { ... })

const NoirPreset = definePreset(Lara, {
    semantic: {
        primary: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#e5e5e5',
            300: '#d4d4d4',
            400: '#a3a3a3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
            950: '#0a0a0a'
        }
    }
})

const app = createApp(App)

// Pinia нужно создать и подключить ДО использования стора
const pinia = createPinia()
app.use(pinia)

app.use(PrimeVue, {
    theme: {
        preset: NoirPreset,
        options: {
            darkModeSelector: '.my-app-dark',
            cssLayer: {
                name: 'primevue',
                order: 'tailwind-base, primevue,  tailwind-utilities, '
            }
        },
    },
    license: import.meta.env.VITE_PRIMEUI_LICENSE
})
app.use(ToastService) 
app.use(ConfirmationService) 
// ─── Восстанавливаем сессию один раз при старте ───
const authStore = useAuthStore(pinia)   // ← передаём pinia явно
await authStore.checkAuth()

app.use(router)
app.directive('fit-children', vFitChildren)
app.mount('#app')