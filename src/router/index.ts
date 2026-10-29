import { useAuthStore } from '@/stores/authStore.ts';
import { createRouter, createWebHistory } from 'vue-router'
// import { useAuthStore} from '@/stores'

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
    {
     path: '/home',
     name: 'home',
     component: () => import('../views/public/home.vue'),
     meta: { requiresAuth: true },
     children:[
      {
        path: '', 
        name: 'usersLayout',
        component: () => import('@/views/public/users/UsersLayout.vue'),
        children:[
          {
               path: '/users',
               name: 'users',
               component: () => import('@/views/public/users/UsersView.vue'),
               meta: { accessCode: 'USERS.READ' },
           },
          {
               path: '/roles',
               name: 'roles',
               component: () => import('@/views/public/users/RolesView.vue'),
               meta: { accessCode: 'ROLES.READ' },
           },
        ],
      },
     ]
    },{
     path: '/helth',
     name: 'helth',
     component: () => import('../views/helth.vue'),
     
    },
]
})


// Навигационный guard (проверка перед каждым переходом)
router.beforeEach((to, from) => {
   const authStore = useAuthStore();
   // Залогиненый пользователь пытается зайти на страницу для гостей
   if (to.meta.requiresGuest && authStore.isAuthenticated) 
      return '/home';

    // Незалогиненный пользователь пытается зайти на внутренние страницы
    if(to.meta.requiresAuth && !authStore.isAuthenticated ){  
      return { path: '/auth', query: { redirect: to.fullPath } };
    }
    if(to.meta.accessCode){
      const hasAccess = authStore.can(to.meta.accessCode as string);
      if (hasAccess) {
        return;
      } else {
        if (to.path !== '/home') {
          return '/home';
        }
        return; 
      }
    }
    return true
});
export default router
