<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <section class="dao-section border-dao-pine/40 bg-white/80">
    <header class="flex flex-col gap-2">
      <p class="font-display text-xl text-dao-pine">执简驭繁，守中持衡</p>
      <h1 class="text-3xl font-serif text-dao-dusk md:text-4xl">管理控制台</h1>
      <p class="max-w-2xl text-base text-dao-dusk/80 md:text-lg">
        从数据到内容管理，这里聚合需要关注的指标与操作，帮助团队在变化中维持宁静与秩序。
      </p>
    </header>

    <RouterView />
  </section>
</template>
