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

See it on the SFC Playground: [Composition API](https://play.vuejs.org/#eNp9VGtv0zAU/StXAamtaJPykJDCxoBp4v0Qm8QHgiBLnNara0e20xVV/e8c22nWdBvaPjS+55577vU93kSv6zpeNSxKoyNTaF5bMsw29ctM8mWttKUNaZYXlq8YbanSakkD4Add/BM39ge38wtlc9EC4qR3Gl8Z4DNZKGksccuWho472uHPTBLKWLa2KQ2+s3IwJjNX1ylZ3aDquBd/qxmTHaLKhbkFeSMgsM+RyV+jGwku8loIiBiO6PglbVx6pTQNbySSqoLUUQiT/4pdKvIcqzsFMf6PkjA7TA0fgNUitwxfREeXjbVK0qtC8GJxnEVt7SzyYaJzR5jjwIGTgA6ZAjOcXGOIE+um2OI7elpNIBmMXi2XQW3H6wmA4VUL8dL3whjYJvTkxkZb9LEL3BK937ofOXje8ZL1BPvMRPCd0KQ/CEQO++lBonEUVmqyzGusjJJYSj961PcBNJfuLiOLXpkF11awBOs4WUlVskljufCgLJpbW5s0SRpZL2ZxoZbJffikhK7Dw5iZ5eRSq2vDdFyyFfRk0e7CofRwvyG188v8bqNsqFCNtKdzLkrN5JjOP77/9vv06+fPZ18uzruc+2R6B7G1pypZlTfCUtVIWAgX5UlPFQpJJu3w9xjVjFDW0LZd37DYRVsc1+jDaM0zncQwwskJ/fy1h3VqAeypHu4YDuR7cxE8bRstaT4clHwFC3pr0833H88TKFN6uPE/tn9G3r+usCt54vCNAHxXbEQpySZ4xPkYl4A7MPavYCYujJt+u7GPCIVCx5dKl0yn9Lhek1GCl/RgOp2+cKFlrmdcYg1rhKf1uj1cYztLO0/pyXR3WOdlyeWsg6FyBiVthbxYzDQ0lyk9qJ67P590R+WiKPYqBzqakpPjKWFVT9mrF8Lo1BpcScVnB67AVtdcMP21dkvQdwdeFHX9wZ+5t6odMHLmrFiEc2/kLnBl1sE53zTD0q9g8S5moZrZED47/4LnYi+4VGUjgP5P8DvDGLDFSgbYG4wMuvdwXu57bxS0f2HO1pZJs+uqe209PotgDbfs9/V+I/dp/Kwz7fYfP5lQBA==) | [Options API](https://play.vuejs.org/#eNp9Vftv0zAQ/ldOAamdaJPykJDCYMA08X6ITeIHgiCLncara0f2pSuq+r9zfiRry4Y2qfXdd9/d+e5zN8mrtk1XHU/y5NhWRrT4olBi2WqD8FFY/C6wudBYSqiNXsIozfas6ZUdFQqgUHztYxivy04ibJy10kSkuEKbBwPsczrTdhLiAViJ5fioBxqOnVH9CUAgXxLNj/4MsAHka8xh9I2z0QRso69zQNPxyHmAemM4VwOuLqW9A/hadvyAr0f9DF/82cW6zyXHRrObDl3cKyn7TgossNYGxpVWFn0boGvARtjU9zR03HeZOgZ47lP3nlhBSFwo+j/OhnHRgcJaWSKnE8DxZYeoFbyspKgWz4skllQk3g1w7hKUZHDgLKBDpKTxTK9pPlN0A4r4gR5WU+qFGH0bQoWpDLyegDCijhDfyo6bbnkTenR3DdvhYm8pevcq/LSI561gfK9gH5lJ0Rea7V8EeQ772YMkkyTs+nRZtrTLWpEOwtiig5obJlskL+1CGJQ8I8VMV0ozPu1QSA8qkgaxtXmWdapdzFNa/uwufMaorkNjyu1yemn0teUmZXxF9RRJP3Cq9FB4VGoU6gYa2EaBEikpcnBUulN42gjJDFcTOP/w7uuv0y+fPp19vjgfYu4qk4j+EXbdqQoFDcqTnvYKH/+aUDYrNVrYxpUOG1/F5DRG76bWPNNJShI5OYEfXlQR66ol4F7V457hoPyjoL/4UDTjERMr0m18IYbzb88TKHO4v/Fftr+PovRDyhOH7yTB+2RHkIPqgkZ+UioaAs3A4h/JbVpZd/txYx8AJQodX2rDuMnhYbsGq6VgcG82mz3zz0Rp5kLRGrbknrXraFzTdjJscng0641tyZhQ8wFGmQuqJGYoq8XcUM0sh3v1U/fng27JXFXVTuZABzNw5XhKkqqn3MsX3NQpWhpJLeYHqnBPupDcfGndEuyrg14Uff3e29zbFS+YYhpeLW6xX9l1EM5Xw2nnV6TwwYdUNMfgPjv/TK/FjnOpWScJ/R/nN063QEusVYC9phujsndwvtp3XifU/YU9WyNXtm+qf3zjz1NCynC7flfrN+U+Tp8Mmt3+Bfk4a4M=)

If you need the child count inside the callback of an iterator then you might prefer to use [`with-meta`](./with-meta) instead, which will pass the count to the iteration callback.

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

See it on the SFC Playground: [Composition API](https://play.vuejs.org/#eNqNVm2P20QQ/itTUxqfFNtBwJeQ9ArVfQCJHmoP+qGuqGOv4+2tdy3vOglE+e/Mvthem0tBipJ43vaZmWdmfQ5+bJr40JFgHWxk3tJGgSSqa16mnNaNaBWcoSXlEiq4QNmKGhZovRi0v5JMdi15TwtVOX2c+ML4s0TrlOeCS4xdiSNsdcRQtR25GTWvK8qK1wKjcsIV2pxTDhZL+OcSUUgmlITLjVUAxlBdyyG8ge3LXjZIq3BR0MNC++Usk3INiypjZXTUkBZwWdpwcUHKrGMqvEEk2v2if/ALP5vE1gMrgQ+K1A3LFMEngM2uU0pweJUzmj9u08Cl9Uz/poGxAXgQ+z0jxj6xDtbZr44z3TyLInioqARyyvAgAp0kEjIOhJEa6xHHMURRb42pwSGipTs5DWyS+LgTbUHaAQL0/ZGgKgImexAlPlDpYiUYzOKatO3LUBHOsSItak0owJ45xJAPLRzxznr7P6FnvJgAnUZ5GvMmGRoVLAPL0ajOGmSh4Mhxw5PUKWQarHvmpMEr+UhbxUiC/I4OXBQk6hRlxigNKqUauU6SjjeP+xiTTK7ZY0GlmgtjIuto14qjJC2S7oB40qDnGiKdTQwiHaYvZ5jvH28wFA7hUo/OZBIR+jip5KTaLFfvKEfmmXoNttfgTgNgEycT3XvHyUyjx1p7ppycjK+bpP8cWzvthL3FPOwi4B1jbvx8k7Oj6wXNZoeHxn3i8/Q2cEsHIZgCSgw1mfvbGB1ub+HDx6lHbkq3faKe4RjMnT/xeU9VZTOzIV688PoXGpkuCqa9djXAVeQ2oQ12bZF96BUwyj6Zaqzh+dmUKj5krCOXTzfL0dZH1Us/zpcdEvDf7fU5KPjvvBYdVwThm+vgmKl8fiUMXLAFmXNpC65vQ4usnW2z5YK5EHrFnqg7pt30Trlv75jx7B9u4+eE6eb1AjPag3PXFLgFhpN9XvQURLk5wsKy1XOl8eqpaYDn4FcsyhKZbWOuoePIIspJ4co4no37lv5N7nc47AfSYgBOjvB2Igw9fC5pU1KLZQkhuuhdpxNbgrCLb6jBJBFUmjLZXHxT3wrjeVZedHc6AC1Be+sjvOvUBx13XNi/znDg0RjBnHM9Qu9vzWb+Xk00E1DjwHn8CyetnEXH1YvZcpLjje77u2EaVorlvFR/MSLjXGquuyvdxK2zdk95tBMoqtfwzao5/WDeCVIe22vK2tn/aNCcQApGC/hqtVqhaR9i8AVosqLANTKLNr6U2Ijm7xq+X32tTRCj0gmVdD+7wDTnKSPtfaMotndykWWMieMvRqY3i1sG6FOR/NHKy4zJUfFZnuwl9xuWUxcyDQadwjyIsuq7d29wIXrKWhQdvuF8SYmsFwwvGsGt2U84NYjbszNwfzabBuvzIO9OinDZZ6UzMJ009mmAm0YT91ruI9xv4++G9Xb5B5vyngo=) | [Options API](https://play.vuejs.org/#eNqNVl1v2zYU/Su3WlYrgCVn2Pbi2U23Ig8bsGZos/WhKlZZoiw2FCmIlO0t8H/v5YcoSk2KAkEskffj3MNzL/UQ/dq26aEn0TrayKKjrXqRcdq0olPwADWcoepEAws0WfiNP0ku+468o6Wq3X66ChfTTxKtM05Oxr4kVd4zDJhxgEJgEE64kmu7AJN4S+2nF1/VlJWvBmNvC9ARXpIuvhxX9JrqOw51vCjpYbFE6AXLJWZY1DmrkqOOvIDzElRNZXohmVAydbDiy8sh0Nk+mJ+zQ1LmKh+TuUQ+tazFcQ2q60nomnH826w8ofiiSNOyXBF8A9jseqUEh5cFo8X9Not0GNjCM/2bRcYG4E7s98zE3aysg3UO6XKmm2dJAndYG5BTjokI9JJIyDkQRhrkL01TSJLBGkmCQ0IrlzmLLF34uhMdkush+LORyBwBwyOIytDoYq0wmMU1kcDXoSKcY0063DWhAM/YIR71EeCdauFboee8nACdRnkc82blDypaRlbvSZO3qGjBsUnMwWduQ2aR12UWvZT3tFOMrLBXkgMXJUl6RZkxyqJaqVauV6uet/f7FItcPWWPhEo1X0yJbJJdJ46SdCjcA+LJokFriHTWfYjUN3HBsN5/XmOoJdRLVHA16WqEPjY8OakuL9RbylF5hi9v+xTcaQA8xMl0GLzT1WxHjwjt+fiQkNhmbfyvbmTTq3D2HVgILhXK+g3WsdXVxLxnzLVwaPLg5HpGs1ny2LhPfFxjY6dvX4ztbSNpCIZAiaEms+M6RYfra3j/YepRGOq2j/AZj8H82Al83lFV28psiOfPg/OLzZomBcteOw70UMPx44ONY3I6Et+P09KvfTRsrOHiwVCVHnLWk/PHSxx9g22Ialj94JL5YYcC/PJ4Qw0K/jdvRM8VQfgIfgnHXBXz68VrwRIy19IW3Ln5I7J29pitFhDZuLEn6oZpNz1TbrsbZjyHl+v0gjB9eMOCaW3v3Lc4+cfMoS4GCeK6SWFhWfYcNQGfWgaYB/+loqpQ2TbmGnq8xyrKSeloHHPjvKX/k9sdNvuBdBiAkyO8mSzGAT5XtKHUYllCjC561unCliDs4PMcTArBTUOTrSU0Da0wXmAVRHfZAWgF2lunCC7rEHTac2EfnaHX0RjB5Hk6wuBvzWb+ASdaCbjjwAX6iydHOYuOoxer5aTAr4LQf7j2h5FiNS/Vf4zItJBa6+5KN3GbvNtTnuwELjVr+OGqPf1ivgkyntprytrZZzRoTyAFoyV8d3V1haZDCO8L0OZliWNkFm38vLERzeMafr76XpsgRqULquh+doFpzVNGuttWUTzeyUWWMyaOf5g1PVncMECfmhT3dr3KmRw3PsmTveT+Qjo1kVnk9xTWQZTdvnn7GgdisNmIsscvnK9touoFw4tGcGv2G3YN4g7sDNzfzaRBfu7kzUkRLoeqhk8z/TmnrXHSaOE+VfsI98f0Jz/ezp8BBoCwVw==)

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
