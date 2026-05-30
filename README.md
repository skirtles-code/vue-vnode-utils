# @skirtle/vue-vnode-utils

Utilities for manipulating Vue 3 VNodes.

* Docs: <https://skirtles-code.github.io/vue-vnode-utils/>
* GitHub: <https://github.com/skirtles-code/vue-vnode-utils/>
* Example: [SFC Playground](https://play.vuejs.org/#eNqNVE1v2zAM/SuEd4gDOHa6j0uWtuuGHTZgH9gG7DAPmxszjVZZFiQ5dRHkv+9JttMka4sFOUjkI/keRXMTXWidrhuOZtHcLozQjiy7Rp/lSlS6No42ZHiZ0KKudOO4pC0tTV3RCEGjHejNSsjyDSC1YuV6RJodmn0dhORqUSvrkLEB9NSnj5+NB6twXFlYh3pxPKbTM/pQuFVaFW08TfqzUHHIkK4L2XBCJ9PxGFnmWScDAnBBMi0Lx7gRzYVCSlpPqrpkeZpHIT6PyN1qxlU11SUb3JEb16k/FS1OJzh2GQ4FBRvRa17WhrvzvBRrVIDBJySBvxfUx/vfZkOKttsengHfuy6WDtV9laO+wT/PdkqiJOqaPqkKnf6xtcLbbXxc3jtQbUbB4m2v7LUwTnKG7k/WCtInjRMygPJo5Zy2syxrlL6+StH07CE8mFp3bEzZVpNLU99YNmnJa/DJI18Z+rZg+u8A3A3a/oit7h+rDRVl+dnU2iZ0ye6GWYWMhlVCwn7j1iWYHzRmwYNjl+khIWEEuQ0FSl4WjUQhzzkMfvwrQVkra2dpOx7aaOAyirpZ7G1EkjHFQ9nTLghdCCnPU4DPz+nHT1+uw2cZfTeFJgfe5AlZPyAF/fZTc/Z7gO2lPNIWD66E4qDokA+RWFLc9aX37xR0v17HKh6h4iihDnSH6McSh51xj/xFWZJbMY2q20lgMqKFLKwlV1Mh5Y74PUKGd9xXcEy+J3dAOOSf7VX8X67vFEbSBbqh3SOc1GiYoseoHg3aP4y7TKg5xB43dQjoaW0HZv6bOF5Q1t1Kv53SQWAn/7I2JZsZneiWbC1FSU+m0+lL76oKcyXUjF7ANVjayY0o3WpGT6dT3QajRseFugo4GLrCoRg+S2exbJfi6mh9+J0rJJtP2gks44M1gvetb94HmzPYt4N9seLFdWdfFtLeOf7Ytlsxnw3jKdacRzufgwbG5vXut18/4n32nNjOjQT6EecXRlPwMdeqg71uVAnee7hA913YIujCN/u2dazsoMorCC8S8HmEDeGX1EPa7+g+S5/vttv2Lz2dWb8=)

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

Copyright &copy; 2022-2026, skirtle
