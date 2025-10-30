<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <section class="dao-section">
    <header class="flex flex-col gap-2">
      <p class="font-display text-2xl text-dao-pine">清风徐来，水波不兴</p>
      <h1 class="text-3xl font-serif text-dao-dusk md:text-4xl">欢迎来到道韵平台</h1>
      <p class="max-w-3xl text-base text-dao-dusk/80 md:text-lg">
        一切从有序与宁静开始。我们为公众与管理者提供一体化空间，汇聚信息、体验与洞察，
        让数字旅程如山水般悠然展开。
      </p>
    </header>

    <RouterView />
  </section>
</template>
