import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@/assets/styles/global.css'
import { TinyLoading } from '@opentiny/vue'

const app = createApp(App)
// 注册OpenTiny Loading组件
app.use(TinyLoading)

app.use(createPinia())
app.use(router)

app.mount('#app')