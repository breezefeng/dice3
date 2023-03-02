import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production'
    ? '//mobile.helensbar.com/test/diceGame/' // 测试环境
    // ? '//mobile.helensbar.com/integrityHandover/'   // 正式环境
    : '/'
})
