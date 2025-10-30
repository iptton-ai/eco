# 道韵平台 · Vue 3 + Vite 脚手架

这个项目提供了一套以 Daoist（道家）美学为灵感的 Vue 3 + TypeScript 应用基础模版，集成了 Vite、Tailwind CSS、Vue Router、Pinia 与 Vee Validate，适合快速搭建具有公共与管理双入口的现代化前端应用。

## 技术栈

- [Vite](https://vitejs.dev/) & [Vue 3](https://vuejs.org/)（TypeScript 支持）
- [Vue Router](https://router.vuejs.org/) · 前端路由
- [Pinia](https://pinia.vuejs.org/) · 状态管理
- [Vee Validate](https://vee-validate.logaretm.com/v4/) · 表单校验（内置中文本地化）
- [Tailwind CSS](https://tailwindcss.com/) · 定制化道风主题
- PostCSS + Autoprefixer

## 快速开始

```bash
npm install
npm run dev
```

在开发模式下访问 `http://localhost:5173` 可预览公共首页与管理后台示例页面。导航位于全局 App Shell 顶部，可快速验证路由切换。

## 可用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生成生产构建（包含类型检查） |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | 运行 ESLint 保持代码质量 |
| `npm run typecheck` | 单独执行类型检查 |
| `npm run format` | 使用 Prettier 统一代码风格 |

## 项目结构

```
src/
├─ assets/           # 静态资源
├─ components/       # 可复用的基础组件
├─ layouts/          # AppShell 及其他布局组件
├─ modules/
│  ├─ admin/         # 管理后台模块（布局 + 视图 + 路由）
│  └─ public/        # 公共展示模块（布局 + 视图 + 路由）
├─ plugins/          # 全局插件（如表单校验）
├─ router/           # Vue Router 配置
├─ stores/           # Pinia 状态管理入口
├─ styles/           # 全局样式（Tailwind 定制）
└─ mocks/            # 模拟数据与占位
```

## 设计与本地化

- Tailwind CSS 预设了 `dao` 色板与中文字体（Noto Sans/Serif SC + 之梦行书），营造雅致宁静的视觉基调。
- 全局 `AppShell` 提供响应式容器、顶部导航、底部信息与基础排版设置。
- 文案、默认标题与 `document.documentElement.lang` 均设为简体中文，便于后续国际化扩展。

## 表单校验

`src/plugins/validation.ts` 已注册常用校验规则，并配置为中文提示语。只需在组件中直接使用 `vee-validate` 提供的 `useField`、`useForm` 等 API，即可获得统一的校验体验。

如需扩展规则或多语言提示，可在该插件中按需调整。
