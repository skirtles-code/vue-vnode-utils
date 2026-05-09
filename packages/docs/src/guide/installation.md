---
# Updated automatically in production builds: see the VitePress config.
packageVersions:
  vue: 3.5.34
  '@skirtle/vue-vnode-utils': 0.2.0
---
# Installation

## npm

To install from the npm registry:

::: code-group

```sh [npm]
npm add @skirtle/vue-vnode-utils
```

```sh [pnpm]
pnpm add @skirtle/vue-vnode-utils
```

```sh [yarn]
yarn add @skirtle/vue-vnode-utils
```

:::

ES module usage:

```js
import { addProps } from '@skirtle/vue-vnode-utils'
```

## CDN - global build

```html-vue
<script src="https://unpkg.com/@skirtle/vue-vnode-utils@{{ $frontmatter.packageVersions['@skirtle/vue-vnode-utils'] }}/dist/vue-vnode-utils.global.dev.js"></script>
```

This should be placed after the `<script>` tag for Vue itself, as it needs the global `Vue` to be available.

The functions are then exposed via the global `VueVNodeUtils`:

```js
const { addProps } = VueVNodeUtils
```

The URL above will include the development build, which is not minified and includes some warning messages. In production the exact version should be pinned and `.prod` should be used instead of `.dev`.

## CDN - ES module build

`@skirtle/vue-vnode-utils` imports from `vue`, so it needs an import map to be configured to use ES modules directly in the browser.

```html-vue
<script type="importmap">
{
  "imports": {
    "vue": "https://unpkg.com/vue@{{ $frontmatter.packageVersions.vue }}/dist/vue.esm-browser.js",
    "@skirtle/vue-vnode-utils": "https://unpkg.com/@skirtle/vue-vnode-utils@{{ $frontmatter.packageVersions['@skirtle/vue-vnode-utils'] }}/dist/vue-vnode-utils.esm-browser.dev.js"
  }
}
</script>
<script type="module">
import { addProps } from '@skirtle/vue-vnode-utils'
// ...
</script>
```

As with the global build, in production this should be pinned to an exact version and switched to `.prod`.

Some browsers do not yet have full support for import maps.
