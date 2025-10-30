<template>
  <div class="grid gap-6 md:grid-cols-2">
    <section class="dao-card space-y-3">
      <h2 class="text-xl font-serif text-dao-dusk">今日概览</h2>
      <p class="text-sm text-dao-dusk/80">
        使用此空间快速检查关键数据。后续接入真实接口后，即可在此呈现访客量、反馈与系统状态。
      </p>
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="rounded-2xl border border-dao-cloud/60 bg-white/80 p-4 text-sm">
          <p class="text-dao-dusk/60">访客</p>
          <p class="text-2xl font-serif text-dao-dusk">128</p>
        </div>
        <div class="rounded-2xl border border-dao-cloud/60 bg-white/80 p-4 text-sm">
          <p class="text-dao-dusk/60">活跃会话</p>
          <p class="text-2xl font-serif text-dao-dusk">42</p>
        </div>
      </div>
    </section>

    <section class="dao-card space-y-3">
      <h2 class="text-xl font-serif text-dao-dusk">待办事项</h2>
      <ul class="space-y-2 text-sm text-dao-dusk/80">
        <li>· 审核最新活动提交</li>
        <li>· 更新首页横幅内容</li>
        <li>· 整理社区反馈并归档</li>
      </ul>
    </section>
  </div>
</template>
