import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { installStores } from '@/stores'
import { setupValidation } from '@/plugins/validation'
import '@/styles/main.css'

document.documentElement.lang = 'zh-CN'
document.documentElement.setAttribute('data-theme', 'dao')

const app = createApp(App)

setupValidation()
installStores(app)
app.use(router)
app.mount('#app')
