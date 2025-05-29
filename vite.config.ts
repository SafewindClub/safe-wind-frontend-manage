import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 81,      // 设置端口
    open: true,    // 自动打开浏览器
    host: true,    // 设置主机
    proxy: {
      '/api': {
        target: 'http://safe-wind.darven.cn', // 设置代理目标
        // target: 'http://localhost:9300', // 设置代理目标
        changeOrigin: true, // 是否改变源
        rewrite: (path) => path.replace(/^\/api/, '')  // 重写路径
      }
    }
  }
})
