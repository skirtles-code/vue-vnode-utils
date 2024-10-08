import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => {
  if (mode !== 'production' && mode !== 'development' && mode !== 'neutral' && mode !== 'test') {
    throw new Error(`Unknown mode: ${mode}`)
  }

  const dtsPlugin = mode === 'neutral' ? dts({
    rollupTypes: true,
    tsconfigPath: './tsconfig.app.json'
  }) : null

  return {
    plugins: [
      vue(),
      dtsPlugin
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    define: ['production', 'development'].includes(mode) ? {
      'process.env.NODE_ENV': JSON.stringify(mode)
    } : {},
    build: {
      target: 'es2019',
      emptyOutDir: false,
      minify: mode === 'production',
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'VueVNodeUtils',
        formats: mode === 'neutral' ? ['cjs', 'es'] : ['es', 'iife'],

        fileName(format) {
          let name = 'vue-vnode-utils'

          if (format === 'iife') {
            name += '.global'
          } else if (format === 'es') {
            name += '.esm-' + (mode === 'neutral' ? 'bundler' : 'browser')
          }

          if (mode === 'production') {
            name += '.prod'
          } else if (mode === 'development') {
            name += '.dev'
          }

          name += format === 'cjs' ? '.cjs' : '.js'

          return name
        }
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue'
          }
        }
      }
    }
  }
})
