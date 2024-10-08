# Some notes on VNodes

This page is not specifically about `vue-vnode-utils`, but describes some aspects of how VNodes are used, in particular with the template compiler. Understanding this helps to appreciate why `vue-vnode-utils` does what it does and the problems it attempts to solve. Some prior experience with `render()` functions and VNodes is assumed:

* <https://vuejs.org/guide/extras/rendering-mechanism.html>
* <https://vuejs.org/guide/extras/render-function.html>

One of the least-well understood features of Vue is the `key` attribute. But this feature isn't unique to Vue. Any framework that uses a VDOM-based approach will need something equivalent to `key`, so in some ways it's strange that it isn't more widely understood. In summary, the `key` is used during rendering updates to determine how to pair up the VNodes from the old and new rendering trees.

But even if you do understand the `key` attribute, it can be very easy to overlook cases where it's needed. Consider this template:

```vue
<template>
  <div v-if="x">A</div>
  <div>B</div>
</template>
```

Does this code need a `key` to handle the case where the `v-if` value changes and shows or hides the first `<div>`? Could the patching algorithm get confused about which `<div>` is which? The answer is *no*, but only because Vue's template compiler does some clever trickery to save us. Before we try to understand that trickery, let's take a step back and first try to understand why the trickery is needed in the first place.

Let's consider how we might write that same code as a `render()` function, as that makes the VNodes much more obvious:

```js
import { h } from 'vue'

export default {
  render() {
    const nodes = []

    if (this.x) {
      nodes.push(h('div', 'A'))
    }

    nodes.push(h('div', 'B'))

    return nodes
  },
  // ...
}
```

If `x` is `true` this code will create two `<div>` VNodes:

```
#
+- <div>
|  +- 'A'
|
+- <div>
   +- 'B'
```

If `x` is `false` we'll just get one `<div>`:

```
#
+- <div>
   +- 'B'
```

If the value of `x` changes and the component re-renders, we want the VDOM patching algorithm to pair up the `<div>` nodes that have child `'B'`, leaving them unchanged, and just insert or remove the other `<div>`. But it isn't so obvious to the algorithm that this is what we want. It doesn't check the children, it just checks the type and `key`. There isn't a `key`, so it just pairs up the first two `<div>` nodes. This leads to the `'A'` in the first tree being paired up with the `'B'` in the second tree.

We can give the patching algorithm the hint it needs using a `key`:

```js
import { h } from 'vue'

export default {
  render() {
    const nodes = []

    if (this.x) {
      nodes.push(h('div', { key: 'A' }, 'A'))
    }

    nodes.push(h('div', { key: 'B' }, 'B'))

    return nodes
  },
  // ...
}
```

Now nodes can be paired up using the `key` values, rather than relying on their positions.

So what is the trickery the template compiler uses to avoid this problem?

It attacks the problem in two ways. Firstly, it automatically adds a `key` to the `<div v-if>`. It'll do the same for `v-else-if` and `v-else` too, each getting a different `key` value, ensuring that different branches of the same conditional don't get paired up. For cases where there is no `v-else`, like in our previous example, it'll then use the second trick: rendering a comment node when the `v-if` is `false`. This extra VNode ensures that the number of sibling VNodes always stays fixed, irrespective of whether the `v-if` condition is `true` or `false`. This makes pairing them up much easier.

But what about `v-for`? Won't that also change the number of siblings?

Yes and no. Again, brace yourself for trickery.

Let's consider a specific example:

```vue
<template>
  <img v-for="item in upper" :src="item">
  <img src="separator.png">
  <img v-for="item in lower" :src="item">
</template>
```

To human eyes it might appear obvious that the `<img src="separator">` should always be paired up with itself, but a naive implementation of the template compiler wouldn't necessarily give us that. If the `render` function just churned out a load of `<img>` nodes then it wouldn't be possible to tell which node that is.

The trick here doesn't use a `key`, instead it uses *fragments*. Fragments are special VNodes that don't render anything themselves, they just hold child nodes. The tree of VNodes will end up looking something like this:

```
#
+- #fragment
|  +- <img>
|  +- <img>
|  ...
|
+- <img src="separator.png">
|
+- #fragment
|  +- <img>
|  +- <img>
|  ...
```

So we end up with 3 siblings, a fragment for the first `v-for`, an element node for `<img src="separator.png">`, and another fragment for the second `v-for`. The number of children within the fragments can vary, and we would need to add `key` attributes to ensure those image nodes get paired up correctly, but that pain is confined to the fragments. The `<img src="separator.png">` is always the second of three nodes, so the pairing process won't struggle to pair it up correctly, even without any `key` attributes.

Happy? Not really? Good news! It gets worse.

A single `v-for` can lead to two levels of fragments. This arises when using `v-for` on a `<template>` tag:

```vue
<template>
  <template v-for="item in list">
    <img :src="item">
    <hr>
  </template>
</template>
```

The VNode tree will look something like this:

```
#
+- #fragment
   +- #fragment
   |  +- <img>
   |  +- <hr>
   |
   +- #fragment
   |  +- <img>
   |  +- <hr>
   ...
```

Each iteration gets its own fragment. Why? Again, its to give the pairing process some hints based on the template structure. Each of the inner fragments forms a fixed-length unit, making pairing up those nodes relatively simple, so long as we can pair up the fragment nodes correctly. As with any other `v-for`, pairing up those nodes correctly may require a `key`. Here the inner fragment nodes give us a place to store that `key`. For example, if we have a `key` in our template like this:

```vue
<template>
  <template v-for="item in list" :key="item">
    <img :src="item">
    <hr>
  </template>
</template>
```

The `key` on the `<template>` tag will become a prop of the fragment nodes:

```
#
+- #fragment
   +- #fragment - key="a.png"
   |  +- <img>
   |  +- <hr>
   |
   +- #fragment - key="b.png"
   |  +- <img>
   |  +- <hr>
   ...
```

Vue 2 didn't have fragments, so the `key` couldn't be placed on a `<template>` tag. Instead, we had to put a different `key` on each direct child of the `<template v-for>`, which was pretty annoying.

Comment nodes and fragments are a pain if you're trying work with the VNodes returned by a slot. Making that part of the process less painful is the problem `vue-vnode-utils` aims to solve.
