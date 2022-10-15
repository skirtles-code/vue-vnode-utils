# @skirtle/vue-vnode-utils

Utilities for manipulating Vue 3 VNodes.

* Docs: <https://skirtles-code.github.io/vue-vnode-utils/>
* GitHub: <https://github.com/skirtles-code/vue-vnode-utils/>
* Example: [SFC Playground](https://sfc.vuejs.org/#eNqNVE1v2zAM/SuEd7AD+KsbdsmSdl1POwzYYcAOy7A6MZOotSVBkl0Xgf/7KNlKE7cZFuQg8eM9Por0IbiVMm0bDObBQm8UkwY0mkZerzirpVAGDqBwG8NG1LIxWEIPWyVqCCkpPAbd7VlV3lGI4MjNGJFm52bLQykrvhFcG0JsKHRp4aMPM29lBmtNVs8XRTNYXsO3wuzTuuiiPB7PjEcOIW2LqsEYrvLZjFAW2SCDBNCFwGRVGKQbwIJxgoQ2qUWJ1XIVuPxVAOZZIl15U69R0Z2w6ZrbU9HR6YqOA8K5IGcD+IJboXA4L0rWEgMZLCAw+ltBY779HQ7Aoe/H8IziR9ft1hC7ZZn0jfyL7KgkiIOh6UldyPRBC05vd7B5q9FBbHNwFmujptv7KtgbI/U8y/R2Y1/iQadC7TI6pYrawGpMUdfJWoknjYqAV0HsMT7rR6ZMhTY6aTm1L2kMqxzRC3DD5eMupYfLLsWTWm2mxjPaEttzagrOyNGiShTyEpV9octyJqGvJFlY6n1PXXw9nC9LcDr++7dH/gBFWX5XQuoY1mieELlDJOoYmP6BnYlptunRNugdR6RLDXLrgZ0jKHFbNBUR2ZrdUkZ/YqLVlTAa+pl/YkUuxWHYk9EGUCFtmKddDknUXQd5k1LwzQ38+m3phvgsg5+qkGCobrAFaTu8Bdzbib6+92EnkBNtkXfFEDlF5/UAsC1EQ19G/1HB8Bt17KOQGMMYhqCXiHFl6HA0nhR/W5Zg9ghh/Zy4SkLYVIXWYAQUVXUs/A0h/h1PFUyLH4s7K9jhz08Y/7fWr5zG0bhyXbtDOvHQT9G/Sp0M2quKByTi9LnTpvqEsazeV2Z3Yvrx1Oa5sl/O1Asc5K+Fot2aw5XsQIuKlfAuz/NP1lUXasf4HD6Sy1u65ImVZj+H93kuO2eU1HHGdy6ODAOxIwv6v8RcJvg=)

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
    "@skirtle/vue-vnode-utils": "https://unpkg.com/@skirtle/vue-vnode-utils/dist/vue-vnode-utils.esm-browser.dev.js"
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
