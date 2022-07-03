import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import AutoImport from 'unplugin-auto-import/vite'
// import { createStyleImportPlugin } from 'vite-plugin-style-import'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // src 路径
      'config': path.resolve(__dirname, 'src/config') // src 路径
    }
  },
  css: {
    modules: {
      localsConvention: 'dashesOnly'
    },
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
      }
    }
  },
  plugins: [
    react(),
    AutoImport({
      imports: [
        'react',
      ]
    }),
    // createStyleImportPlugin({
    //   libs: [
    //     {
    //       libraryName: 'zarm',
    //       esModule: true,
    //       resolveStyle: (name) => {
    //         return `zarm/es/${name}/style/css`;
    //       },
    //     }
    //   ],
    // })
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        // 当遇到 /api 路径时，将其转换成 target 的值
        target: 'http://127.0.0.1:8080/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '') // 将 /api 重写为空
      }
    }
  }
})
