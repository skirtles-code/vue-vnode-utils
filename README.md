# @skirtle/vue-vnode-utils

Utilities for manipulating Vue 3 VNodes.

* Docs: <https://skirtles-code.github.io/vue-vnode-utils/>
* GitHub: <https://github.com/skirtles-code/vue-vnode-utils/>
* Example: [SFC Playground](https://play.vuejs.org/#eNqNVE1vm0AQ/SsjegBLGEirXqidNM2ph0o9VOqhVA0247AN7K52F4fI4r93dmEdmyRVkA+78/XeG545BNdSJvsOgzxY6a1i0oBG08nLgrNWCmXgAAp3MWxFKzuDFQywU6KFkJrCY9FNzZrqhkoER26miiQ9D1scain4VnBtaGJHpWs7Pvqw8FFmsNUU9XhRtID1JXwrTZ20ZR9l8XRmPHITkn3ZdBjDRbZY0JRVOsogAXShYbIpDdINYMU4jYT9shUVNusicP1FAOZRIl15125Q0Z1m0zWzp7Kn0wUdxwnnglwM4AvuhMLxvKrYnhAoYAcCo58VNPXb53AADsMwladUP6Wud4bQLcpsb5RfpUclQRyMS1+2pUz+asHp3R1sXzElCC0HF7Gxz/qeKdNgSttf7jlJX3aGNa6oCGpjpM7TtOPy/i6hpaev1RNTbebBBHW73CjxoFElFe6JTxFYZNI3ENPnBngy2qnF6pdtdYCyqr4rIXUMGzQPiNxNVMhjYPoH9iYm/9BitugTx0mvCXEWxN4BVLgru4aALGdn/OhPTLC6EUbDsPBrVJRSHEYvTjGABsnFHnY9NtEW3MirhIqvruDXbws31qcp/FSlBEO8wRLS1iAl3FrXXN76spORM22RT8UQOUXnfADYDqJxL1P+qGB8Jh11FBJiGMNY9FQx2ZIOx+AJ+euqAlMjhO3j0jEJYduUWoMRUDbNkfgLQvx7PFUwJz+ROyPs5ucniG/l+pWTJY2j69Yd0omH3kX/ozoz2jPG4yTC9L3zpfqGidbgmdn/xPwDpc1jY79OiRc4yt8IVaHK4UL2oEXDKniXZdknm2pLdcd4Dh8p5SP98oFVps7hfZbJ3gUlbZzxO1dHgRHYgQXDPzta8GY=)

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

Copyright &copy; 2022-2023, skirtle
