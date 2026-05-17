import { defineConfig } from 'tsdown'
import { fileURLToPath, URL } from 'node:url'

const base = defineConfig({
  entry: {
    'vue-vnode-utils': 'src/index.ts'
  },
  target: 'es2019',
  platform: 'neutral',
  dts: false,
  globalName: 'VueVNodeUtils'
})

const suffix = (suffix: string) => {
  return {
    outputOptions: {
      entryFileNames: `[name].${suffix}`,
      globals: {
        vue: 'Vue'
      }
    }
  }
}

const cjs = defineConfig({
  ...base,
  format: ['cjs'],
  define: {
    __DEV__: `!(process.env.NODE_ENV === 'production')`
  }
})

const esmBundler = defineConfig({
  ...cjs,
  format: ['esm'],
  dts: { tsconfig: './tsconfig.app.json' },
  outExtensions: () => ({ js: '.esm-bundler.js', dts: '.d.ts' })
})

const esmBrowserDev = defineConfig({
  ...base,
  format: ['esm'],
  define: {
    __DEV__: 'true'
  },
  ...suffix('esm-browser.dev.js')
})

const iifeDev = defineConfig({
  ...esmBrowserDev,
  format: ['iife'],
  ...suffix('global.dev.js')
})

const esmBrowserProd = defineConfig({
  ...base,
  format: ['esm'],
  minify: true,
  define: {
    __DEV__: 'false'
  },
  ...suffix('esm-browser.prod.js')
})

const iifeProd = defineConfig({
  ...esmBrowserProd,
  format: ['iife'],
  ...suffix('global.prod.js')
})

const withMetaBase = defineConfig({
  ...base,
  outDir: 'dist/with-meta',
  entry: {
    'vue-vnode-utils': 'src/with-meta/index.ts'
  },
  alias: {
    '@skirtle/vue-vnode-utils': fileURLToPath(new URL('./src', import.meta.url))
  }
})

const withMetaCjs = defineConfig({
  ...withMetaBase,
  format: ['cjs'],
  define: {
    __DEV__: `!(process.env.NODE_ENV === 'production')`
  },
  alias: {},
  deps: {
    neverBundle: [
      'vue',
      '@skirtle/vue-vnode-utils'
    ]
  }
})

const withMetaEsmBundler = defineConfig({
  ...withMetaCjs,
  format: ['esm'],
  dts: { tsconfig: './tsconfig.app.json' },
  outExtensions: () => ({ js: '.esm-bundler.js', dts: '.d.ts' }),
  deps: {
    neverBundle: [
      'vue',
      '@skirtle/vue-vnode-utils'
    ]
  }
})

const withMetaEsmBrowserDev = defineConfig({
  ...withMetaBase,
  format: ['esm'],
  define: {
    __DEV__: 'true'
  },
  ...suffix('esm-browser.dev.js')
})

const withMetaIifeDev = defineConfig({
  ...withMetaEsmBrowserDev,
  format: ['iife'],
  ...suffix('global.dev.js')
})

const withMetaEsmBrowserProd = defineConfig({
  ...withMetaBase,
  format: ['esm'],
  minify: true,
  define: {
    __DEV__: 'false'
  },
  ...suffix('esm-browser.prod.js')
})

const withMetaIifeProd = defineConfig({
  ...withMetaEsmBrowserProd,
  format: ['iife'],
  ...suffix('global.prod.js')
})

export default [
  cjs,
  esmBundler,
  esmBrowserDev,
  iifeDev,
  esmBrowserProd,
  iifeProd,
  withMetaCjs,
  withMetaEsmBundler,
  withMetaEsmBrowserDev,
  withMetaIifeDev,
  withMetaEsmBrowserProd,
  withMetaIifeProd
]
