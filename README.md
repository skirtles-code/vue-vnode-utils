# @skirtle/vue-vnode-utils

Utilities for manipulating Vue VNodes.

* Docs: <https://skirtles-code.github.io/vue-vnode-utils/>
* GitHub: <https://github.com/skirtles-code/vue-vnode-utils/>

## Installation

### npm

Installation with `npm`/`yarn`/`pnpm`:

```sh
npm add @skirtle/vue-vnode-utils
```

ES module usage:

```js
import { addProps } from '@skirtle/vue-vnode-utils'
```

### CDN - global build

```html
<script src="https://unpkg.com/@skirtle/vue-vnode-utils/dist/vue-vnode-utils.global.dev.js"></script>
```

This should be placed after the `<script>` tag for Vue itself, as it needs the global `Vue` to be available.

The functions are then exposed via the global `VueVNodeUtils`:

```js
const { addProps } = VueVNodeUtils
```

The URL above will include the development build, which is not minified and includes some warning messages. In production the exact version should be pinned and `.prod` should be used instead of `.dev`.

### CDN - ES module build

`@skirtle/vue-vnode-utils` imports from `vue`, so it needs an import map to be configured to use ES modules directly in the browser.

```html
<script type="importmap">
{
  "imports": {
    "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js",
    "@skirtle/vue-vnode-utils": "https://unpkg.com/@skirtle/vue-vnode-utils/dist/vue-vnode-utils.esm-browser.dev.js",
  }
}
</script>
<script type="module">
import { addProps } from '@skirtle/vue-vnode-utils'
// ...
</script>
```

As with the global build, this should be changed to an exact version and switched to `.prod` in production.

Some browsers do not yet have full support for import maps.

## License

MIT

Copyright &copy; 2022, skirtle
