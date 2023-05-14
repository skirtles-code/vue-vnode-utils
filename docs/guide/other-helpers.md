# Other helpers

## Extracting a single child

Slots return an array of children, but some components only allow for one child in their slot, like Vue's built-in components `<KeepAlive>` and `<Transition>`. `extractSingleChild()` can be used to pull out a meaningful root node from a slot. It skips over fragments, comments and text nodes, trying to find a component or element node.

In development builds, `extractSingleChild()` will log warnings if it finds multiple eligible nodes. It'll also log warnings if it encounters text nodes, unless they only contain collapsible whitespace.

In the example below, the `<MeasureWidth>` component expects its slot to contain a single child, either an element or a component. It'll extract that child, ignoring any comment nodes, then add a `ref` prop using `cloneVNode()`. Once the corresponding `ref` is populated it can then be used to track the width of the child.

```js
import { cloneVNode, h, ref } from 'vue'
import { extractSingleChild } from '@skirtle/vue-vnode-utils'
import { useMeasureWidth } from './useMeasureWidth.js'

export default {
  setup(_, { slots }) {
    const elRef = ref(null)

    const { width } = useMeasureWidth(elRef)

    return () => {
      const slotVNodes = slots.default?.() ?? []
      const child = extractSingleChild(slotVNodes)
      const childWithRef = child && cloneVNode(child, { ref: elRef }, true)

      return h('div', [
        h('div', `Width: ${width.value}`),
        childWithRef
      ])
    }
  }
}
```

See it on the SFC Playground: [Composition API](https://play.vuejs.org/#eNqNVl2vm0YQ/SsTmsZYMuA+9MW1c1NFeWwjpWnzEKIGw2DoXXYRu9huLf/3zn4AC723rWTZsDtz9szMmVnfgh/bNj73GOyCvcy7ulUgUfXt65TXTSs6BTfosNxABXcoO9HAiqxX4+5PmMm+w091oSq3Hyf+YvyHJOuU54JLwq7EBQ4aMVRdj+tp521Vs+KtIFSOXJHNLeVguYS/b4iFZEJJuK/tBhCG6jsO4RoOr4e1cbUKV0V9Xmm/nGVS7mBVZayMLprSCu4bCxcXWGY9U+GamGj3u/6hL/rsE5sPygS9KGxalimkN4D9sVdKcHiTszp/PKSBC+uF/k0DYwPwUZxODI19Yh2ss58dZ7p/EUXwsaol4DWjgxB6iRIyDsiwoXzEcQxRNFhTaHCO6tKdnAY2SHo9iq7AbqQAQ30kqArBRA+ipJdaOqyEwCyvWdn+nSrRuVTY0a6BAqqZYwz5WMKJ76K2/5N6xosZ0TnK05z3yVioYBNYjUZN1pIKBSeNG52kbkOmwW5QThq8kY91pxgmpO/ozEWBUa9qZozSoFKqlbsk6Xn7eIopyOQ5e0qoVMvFGGUTHTtxkdiR6M7EJw0GrRHTRccQ07H7ckbx/vYzQVETbnTrzDqRqE+dilfVZbn6peakPJOv0fY5unMAKuKsowfvOFns6LbWninHq/F1nfSfbWu7HdkHisMOAt4z5trPN7k5ud7JbHF4aNxnPk9PAzd0iIJJoCSoWd8/xOTw8ACfv8w9cpO6wxP5DCcwd/7M51OtKhuZhXj1yqtfaNZ0UijsncsBjSI3CS3Yc4Ps87AB09pXk40dvLyZVMXnjPV4/7reTLY+q2H1y3LYkQD/WV5fg4L/yhvRc4VE31wHl0zlyyth1IJNyFJLB3B1G0tk7WyZrRbMhTBsnFC9Y9pNz5T33TtmPIeXh/glMl28YcG09ujctwVNgfFkXxeDBGndHGFp2ey51Hj51DKgc+grFmVJyraYO+g5qajmWLg0TmfTvK3/wvdHavYzdgTA8QIfZouhx88FbVJquWwgJBc963RgGxB28I05mAVCmyZNNhbf1LciPM/KQ3enA9QlaG99hHed+qTjngv76AxHHU0I5pznEQZ/a7bw93KilUA7jpynv3BWygU6jV6KlmNON7rv75ppHClW81L9yVDGudRad1e6wW2y7lTz6ChoqdnBd9v2+oP5T5Dy2F5T1s4+k0F7BSlYXcA32+2WTAeI0RegzYqCxsgCbfpTYhHN4w6+336rTYL731jJNMA=) | [Options API](https://play.vuejs.org/#eNqNVtuO2zYQ/ZWJuo21gC7uQ19UO5siyGMbIE2bhyhoZImylKVIQaRsJwv/e4YXUZSyGwRYrKXhzJnDw5mhHoI/+z45jSTIgp0oh7aXL3LWdj0fJDxAA1eoB97BBl02buEvUohxIO/bSjZ2PUl9Y/JZoHfOyEX7V6QuRoqAOQMoOYIwwqTIjAEWeJGKU8ZXTUurV5Oz8wUYCKvIEN7OFmWT48CgCTdVe9pESL2khcAMm6agdXxWyBu4RiCbViQ3gnIpEksrvL2dgK7mQf9cLZOqkMWczCZyqUXDzxnIYSR+aM7wb5c6QfFFkq6nhST4BrA7jFJyBi9L2pb3+zxQMLCHZ+o3D7QPwDt+PFKNu0tNgAn25bKuu2dxDO9wb0AuBSYiMAoioGBAKOlQvyRJII4nbxQJTnFb28x5YOTC1wMfUFxHwZ2NQOUIaB2B11pGi5UimOG1KIEfU0U654YMuKqhAM/YMp7rw+O7rIWfpV6wakF0ifI4513qDiqIAlPvcVf0WNGcYZPog8/tgsgDV5d58FLct4OkJMVeiU+MVyQeZUu1Ux40UvYiS9OR9ffHBDeZPuWPggq5NiZEdPFh4GdBBizcE/LJg6nWkOmq+5Cpa+KS4n7/+xuhImgirOB60dVIfW54cpFDUcp/WoaVp/Vyvk/RXQLgIS6mwxSdpKsVNSJU5ONDQmCb9eH/qpF1r8LVdWDJmZBY1m9xH3u1m5CNlNoW9l0ebLle0W2VPNThixjb2Njp+xdzexskRUELKBBqMTvuEgy4u4MPH5cRpZZu/4ie4Qzmxo4X876VjdmZgXj+3Du/UNuUKLjtzGqghhqOHwc2j8nlSPwwT0tn+6TVyODmQUuVnAo6kuunWxx9k6/ParJ+tMncsMMC/P54/Rrk7F/W8ZFJgvSRfATnQpbr68XVghFkXUt7sOfmjsj4mWM2tYDM5oUjka+pClMz5c3wmurI6eUuuSFUHd5k0K3tgsceJ/+c2a+LqQTRrlMYWkY9K42npyoDzIP/El7XWNkGM4MR77G6ZaSyMs65cd62X8mbAzb7iQwIwMgZ3i6MocfPblpLarhEEGKImnVqYxFwM/icBouN4KKWyezFd/W9EM/z8tBtdoC2BhWtUniXtU86GRk3j9bR1dGMoPM8jTDFG7dVvKeJqgRcseS8+gsXR7lCx9GLu2WkxK8CP3669qeRYmpeyC+UiKQUqtbtla5xu2I4tiw+cDR1Gfy27S9/6G+CnCXmmjJ+5hkd+gsITtsKftlut+g6QbhYgL6oKhwjK7T588Yg6scMft/+qlyC6zdhlEcN)

`extractSingleChild()` uses `findChild()` internally. If the exact criteria used to extract a child aren't what you want then you can implement an alternative using `findChild()` directly.

## Checking for an empty slot

Another common need is to detect whether a slot is empty.

In general this is very difficult. The definition of 'empty' is not at all clear.

The `isEmpty()` helper can be used to check an array of VNodes to determine whether they appear to be empty. Comments are considered empty, as are text nodes that only contain collapsible whitespace. Elements are not considered to be empty, nor are components. A component VNode might ultimately not create any DOM nodes, but that isn't taken into account. Nor is CSS, so `v-show` won't be factored in either.

```js
const slotVNodes = slots.default?.() ?? []
const empty = isEmpty(slotVNodes)
```

A common mistake is to call the slot function twice, once to pass to `isEmpty()` and then again to do the actual rendering. Don't do it. Everything should happen within the same invocation of the render function and the slot should only need to be called once to obtain the array of VNodes. You should also avoid caching the same VNodes across multiple renders, e.g. in a `computed` property.

If the definition of 'empty' is not quite what you need then you can implement an alternative using `someChild()`.
