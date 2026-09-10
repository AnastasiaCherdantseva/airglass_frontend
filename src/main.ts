import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

import 'primeicons/primeicons.css'
import './assets/css/main.css'

import PrimeVue from 'primevue/config'
import Lara from '@primevue/themes/lara' 
import { definePreset } from '@primevue/themes'

// const EmeraldPreset = definePreset(Lara, {
//     semantic: {
//         primary: {
//             50: '#ecfdf5',
//             100: '#d1fae5',
//             200: '#a7f3d0',
//             300: '#6ee7b7',
//             400: '#34d399',
//             500: '#10b981',   // ← Изумрудный (основной)
//             600: '#059669',
//             700: '#047857',
//             800: '#065f46',
//             900: '#064e3b',
//             950: '#022c22'
//         }
//     }
// })

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

app.use(createPinia())

app.use(PrimeVue, {
    theme: {
        preset: NoirPreset, 
        options: {
            darkModeSelector: '.my-app-dark',
            cssLayer: {
                name: 'primevue',
                order: 'tailwind-base,  tailwind-utilities, primevue,'
            }
        },
    },
    license: import.meta.env.VITE_PRIMEUI_LICENSE
})
app.use(router)
app.mount('#app')
