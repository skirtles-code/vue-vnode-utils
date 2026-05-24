import { defineConfig } from 'tsdown'

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

export default [
  cjs,
  esmBundler,
  esmBrowserDev,
  iifeDev,
  esmBrowserProd,
  iifeProd
]
