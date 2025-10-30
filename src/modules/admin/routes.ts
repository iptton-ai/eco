import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from './layouts/AdminLayout.vue'
import DashboardView from './views/DashboardView.vue'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'admin.dashboard',
        component: DashboardView,
        meta: {
          title: '管理控制台',
          layout: 'admin',
        },
      },
    ],
  },
]
