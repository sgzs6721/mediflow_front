import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// ---------------------- 统一API代理配置 ----------------------
// 配置本地代理到远端正式后端，可与 src/config/api.js 环境判定统一
const REMOTE_HOST = 'https://mediflow.devtesting.top'
const API_BASE_PATH = '/mediflow/api'

const proxyConfig = {}
proxyConfig[API_BASE_PATH] = {
  target: REMOTE_HOST, // 远端正式后端
  changeOrigin: true,
  secure: false, // 如遇自签证书可为 false，正式环境 true 亦可
  rewrite: (path) => path, // 保持路径不变
  // 可根据实际需要附加 header：
  headers: {
    'Host': new URL(REMOTE_HOST).hostname,
    'Origin': REMOTE_HOST,
    'Referer': REMOTE_HOST,
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    // dev 环境本地 http 接口代理到远端正式后端
    proxy: proxyConfig,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd'],
        },
      },
    },
  },
})

