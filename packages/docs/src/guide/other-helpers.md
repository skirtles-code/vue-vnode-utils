# Other helpers

## Counting children <Badge text="0.3+" />

The `countChildren()` helper can be used to count the top-level VNodes.

This uses the same iteration logic as the various [iterators](./iterators). Fragments are not counted directly, with the children of any fragments being counted instead.

The second argument of `countChildren()` is optional and allows [iteration options](/api.html#iterationoptions) to be specified, controlling the types of VNodes that are counted.

```js
import { h } from 'vue'
import { countChildren, SKIP_COMMENTS } from '@skirtle/vue-vnode-utils'

function ChildComponent(_, { slots }) {
  const children = slots.default?.() ?? []
  const count = countChildren(children, SKIP_COMMENTS)

  return h('div', [
    h('div', `Child count: ${count}`),
    count ? h('ul', children) : null
  ])
}
```

See it on the SFC Playground: [Composition API](https://play.vuejs.org/#eNp9VGtv0zAU/StXAamtaJPykJDCxoBp4v0Qm8QHgiBLnNara0e20xVV/e8c22nWdBvaPjS+55577vU93kSv6zpeNSxKoyNTaF5bMsw29ctM8mWttKUNaZYXlq8YbanSakkD4Add/BM39ge38wtlc9EC4qR3Gl8Z4DNZKGksccuWho472uHPTBLKWLa2KQ2+s3IwJjNX1ylZ3aDquBd/qxmTHaLKhbkFeSMgsM+RyV+jGwku8loIiBiO6PglbVx6pTQNbySSqoLUUQiT/4pdKvIcqzsFMf6PkjA7TA0fgNUitwxfREeXjbVK0qtC8GJxnEVt7SzyYaJzR5jjwIGTgA6ZAjOcXGOIE+um2OI7elpNIBmMXi2XQW3H6wmA4VUL8dL3whjYJvTkxkZb9LEL3BK937ofOXje8ZL1BPvMRPCd0KQ/CEQO++lBonEUVmqyzGusjJJYSj961PcBNJfuLiOLXpkF11awBOs4WUlVskljufCgLJpbW5s0SRpZL2ZxoZbJffikhK7Dw5iZ5eRSq2vDdFyyFfRk0e7CofRwvyG188v8bqNsqFCNtKdzLkrN5JjOP77/9vv06+fPZ18uzruc+2R6B7G1pypZlTfCUtVIWAgX5UlPFQpJJu3w9xjVjFDW0LZd37DYRVsc1+jDaM0zncQwwskJ/fy1h3VqAeypHu4YDuR7cxE8bRstaT4clHwFC3pr0833H88TKFN6uPE/tn9G3r+usCt54vCNAHxXbEQpySZ4xPkYl4A7MPavYCYujJt+u7GPCIVCx5dKl0yn9Lhek1GCl/RgOp2+cKFlrmdcYg1rhKf1uj1cYztLO0/pyXR3WOdlyeWsg6FyBiVthbxYzDQ0lyk9qJ67P590R+WiKPYqBzqakpPjKWFVT9mrF8Lo1BpcScVnB67AVtdcMP21dkvQdwdeFHX9wZ+5t6odMHLmrFjccX5l1sE43zTDzq/g8C5mIZrZED47/4LXYi+4VGUjgP5P8DvDFLDESgbYG0wMsvdwXu177xN0f2HO1pZJs2uqe2w9PovgDLfr97V+I/dp/Kzz7PYf9mdPuQ==) | [Options API](https://play.vuejs.org/#eNp9Vftv0zAQ/ldOAamdaJPykJDCYMA08X6ITeIHgiCLncara0f2pSuq+r9zfiRry4Y2qfXdd9/d+e5zN8mrtk1XHU/y5NhWRrT4olBi2WqD8FFY/C6wudBYSqiNXsIozfas6ZUdFQqgUHztYxivy04ibJy10kSkuEKbBwPsczrTdhLiAViJ5fioBxqOnVH9CUAgXxLNj/4MsAHka8xh9I2z0QRso69zQNPxyHmAemM4VwOuLqW9A/hadvyAr0f9DF/82cW6zyXHRrObDl3cKyn7TgossNYGxpVWFn0boGvARtjU9zR03HeZOgZ47lP3nlhBSFwo+j/OhnHRgcJaWSKnE8DxZYeoFbyspKgWz4skllQk3g1w7hKUZHDgLKBDpKTxTK9pPlN0A4r4gR5WU+qFGH0bQoWpDLyegDCijhDfyo6bbnkTenR3DdvhYm8pevcq/LSI561gfK9gH5lJ0Rea7V8EeQ772YMkkyTs+nRZtrTLWpEOwtiig5obJlskL+1CGJQ8I8VMV0ozPu1QSA8qkgaxtXmWdapdzFNa/uwufMaorkNjyu1yemn0teUmZXxF9RRJP3Cq9FB4VGoU6gYa2EaBEikpcnBUulN42gjJDFcTOP/w7uuv0y+fPp19vjgfYu4qk4j+EXbdqQoFDcqTnvYKH/+aUDYrNVrYxpUOG1/F5DRG76bWPNNJShI5OYEfXlQR66ol4F7V457hoPyjoL/4UDTjERMr0m18IYbzb88TKHO4v/Fftr+PovRDyhOH7yTB+2RHkIPqgkZ+UioaAs3A4h/JbVpZd/txYx8AJQodX2rDuMnhYbsGq6VgcG82mz3zz0Rp5kLRGrbknrXraFzTdjJscng0641tyZhQ8wFGmQuqJGYoq8XcUM0sh3v1U/fng27JXFXVTuZABzNw5XhKkqqn3MsX3NQpWhpJLeYHqnBPupDcfGndEuyrg14Uff3e29zbFS+YYhpeLW6xX9l1EM5Xw2nnV6TwwYdUNMfgPjv/TK/FjnOpWScJ/R/nN063QEusVYC9phujsndwvtp3XifU/YU9WyNXtm+qf3zjz1NCynC7flfrN+U+Tp8Mmt3+Bfk4a4M=)

If you need more fine-grained control over the counting you can use [`eachChild()` or `reduceChildren()`](./iterators) instead.

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
