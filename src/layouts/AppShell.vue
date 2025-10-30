<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const navigation = [
  { label: '首页', to: { name: 'public.home' } },
  { label: '管理后台', to: { name: 'admin.dashboard' } },
] as const

const route = useRoute()

const activeRouteName = computed(() => route.name?.toString())

const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="flex min-h-screen flex-col text-dao-ink">
    <header class="border-b border-dao-cloud/70 bg-white/80 backdrop-blur">
      <div class="container flex flex-wrap items-center justify-between gap-4 py-4">
        <RouterLink :to="{ name: 'public.home' }" class="group flex items-center gap-3">
          <span class="rounded-full bg-dao-bamboo/20 px-3 py-1 text-xs font-medium text-dao-pine">道韵</span>
          <span class="text-xl font-serif tracking-widest text-dao-dusk transition group-hover:text-dao-pine">
            道韵平台
          </span>
        </RouterLink>
        <nav class="flex items-center gap-3 text-sm font-medium">
          <RouterLink
            v-for="item in navigation"
            :key="item.label"
            :to="item.to"
            class="rounded-full px-3 py-2 transition-colors"
            :class="
              activeRouteName === item.to.name
                ? 'bg-dao-bamboo/20 text-dao-pine'
                : 'text-dao-dusk/70 hover:bg-dao-bamboo/10 hover:text-dao-pine'
            "
          >
            {{ item.label }}
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="flex-1 bg-transparent">
      <div class="container py-12">
        <RouterView />
      </div>
    </main>

    <footer class="border-t border-dao-cloud/70 bg-white/70 backdrop-blur">
      <div class="container flex flex-col flex-wrap gap-1 py-6 text-sm text-dao-dusk/60 md:flex-row md:items-center md:justify-between">
        <p>&copy; {{ currentYear }} 道韵平台</p>
        <p class="font-serif text-sm">以和为贵 · 自然之道</p>
      </div>
    </footer>
  </div>
</template>
