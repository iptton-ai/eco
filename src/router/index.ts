import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { adminRoutes } from '@/modules/admin/routes'
import { publicRoutes } from '@/modules/public/routes'

const routes: RouteRecordRaw[] = [
  ...publicRoutes,
  ...adminRoutes,
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'public.home' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  const baseTitle = '道韵平台'
  document.title = to.meta?.title ? `${to.meta.title} · ${baseTitle}` : baseTitle
})

export default router
