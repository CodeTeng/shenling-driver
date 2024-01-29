import App from './App'
import '@/utils/utils'

// #ifdef VUE3
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// 自定义全局持久化配置
import { piniaPluginPersistedstate } from '@/stores/persist'
export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  // Pinia 持久化插件
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
  return {
    app,
  }
}
// #endif
