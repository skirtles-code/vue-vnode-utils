import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type UserConfig } from 'vite'
import replace from '@rollup/plugin-replace'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }): UserConfig => {
  if (mode !== 'production' && mode !== 'development' && mode !== 'neutral' && mode !== 'test') {
    throw new Error(`Unknown mode: ${mode}`)
  }

  const expectedNodeEnv = mode === 'test' ? 'test' : 'production'
  const nodeEnv = process.env.NODE_ENV

  if (nodeEnv !== expectedNodeEnv) {
    console.warn(`Expected NODE_ENV to be '${expectedNodeEnv}' for mode '${mode}', found '${nodeEnv}'`)
  }

  const dtsPlugin = mode === 'neutral'
    ? dts({
        rollupTypes: true,
        tsconfigPath: './tsconfig.app.json'
      })
    : null

  return {
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          __DEV__: mode === 'production' ? 'false' : mode === 'development' ? 'true' : '!(process.env.NODE_ENV === "production")'
        }
      }),
      dtsPlugin
    ],

    build: {
      target: 'es2019',
      emptyOutDir: false,
      minify: mode === 'production',

      lib: {
        entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
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
