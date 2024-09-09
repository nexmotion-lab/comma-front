/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {

    },
    host: '0.0.0.0',  // 모든 네트워크 인터페이스에서 접근 가능
    port: 8100       // 포트 번호 설정 (기본: 8101)
  },
  test: {
    globals: true,
    environment: 'jsdom'
  },

})
