import { createRouter, createWebHistory } from 'vue-router'
// import { useAuthStore,useRoleStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //  path: '/',
    //  name: 'main',
    //  component: () => import('../views/MainPage .vue'),
    // },
    {
    path: '/auth',
     name: 'auth',
     component: () => import('../views/login.vue'),
     meta: { requiresGuest: true }
    },
]
})


// Навигационный guard (проверка перед каждым переходом)
// router.beforeEach(async (to, from, next) => {
   
// });
export default router
