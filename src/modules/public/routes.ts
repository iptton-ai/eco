import type { RouteRecordRaw } from 'vue-router'
import PublicLayout from './layouts/PublicLayout.vue'
import HomeView from './views/HomeView.vue'

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      {
        path: '',
        name: 'public.home',
        component: HomeView,
        meta: {
          title: '首页',
          layout: 'public',
        },
      },
    ],
  },
]
