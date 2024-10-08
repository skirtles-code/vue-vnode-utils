# Adding props

VNode props can be used for a variety of purposes:

* Passing component props.
* Passing component event listeners.
* Setting HTML element attributes.
* Setting HTML element properties.
* Adding HTML element event listeners.

There are also the special props `ref` and `key`.

Calling a slot function will yield an array of VNodes. If we wish to add extra VNode props to the 'top-level' VNodes then we can use `addProps`.

This example will add the CSS class `my-child` to each of the VNodes:

```js
import { addProps } from '@skirtle/vue-vnode-utils'

// Inside a render function
const children = slots.default?.() ?? []

const newChildren = addProps(children, (vnode) => {
  return {
    class: 'my-child'
  }
})
```

See it on the SFC Playground: [Composition API](https://play.vuejs.org/#eNp1U02P0zAQ/SujcGgqNR8L4hL6wbJnECcuBKG0cVuziW3ZTjZV1P/Os5O03cJGOYyf572ZsZ/74FGpuG1YkAVLs9NcWTLMNmqdC14rqS31pNl+QTtZq8ayks6017KmGUizS9LTkVflE1KkYMKOGXHyGnZ1QMnFTgpjodggdeXkww/zCeWW1QboVC8M57Ra09fCHuO66MJ0McZchF4hbouqYQt6SOdzqCyTYQwMgAXEVFVYhhXRkgtIUhvVsmTVKg88Pw/InhTDUjT1lmmsoY1l6qKiQ/SAcFB4PZDHgJa8XX9he6nZMnHxFUYxwE6bOH432yjlvr4nQefzmH5HXT/uLdNXdHl3mgCXyWW+YBEMVxHVhYr/GClwo73j5eMGCmfkEYd9Ns9c24oluJOoFTiQqLG88kl5cLRWmSxJGqGeDzGuInkrH+0Zew/GzNTRVssXw3Rcshb95IGrjFHP6PRfW1ztd2u84//N1lNRlt+1VOay/1Z73m6s87SS7YumAt114k0e/l5AzFTSQmk+HY7GlhY0+G7ECH507nS5P75B3lnUEzGfl93EIGw29POXK3nL2blpNRNgTH2HV53FfaFLAzcIpKrCmIxm9Snyehhs2hr9gwD2n+JR4xjO4J8Znu/YBFJ8qnfBeCP3j8bYU+VeTDwVG1rZSl0yndGD6sjIipf0Lk3TT26rLvSBi8hKldFH1Y1YF73w0h4zep+mI6hwAlwcpqyhtC8XnP8CnQSDaQ==) | [Options API](https://play.vuejs.org/#eNp1U8uO2zAM/BXCLZAE8CstenGdpNs9t+ipl7oHJ1ZidW1JkOisg8D/Xkp+5LEbwwdxRM5Q1OjsPSkVHhvmJV5qdporXGeC10pqhOeSV8WzpEAwgbDXsoZZGN3CtniWiUyw1hUVbJ83FcI5EwC7McskPQB3pBbrfFsOUOSYzxdjnmbYaDFGlqoRmMDnPu6uC61Kg6yYNDiy2lyoJrIfOZZhnbfz2B/WXMyx5CZ07D4s48XiWiAT9KfRNBgKiFpVOTKKAFIuSBmOQS0LVq0yz/FkHuBJMQpFU2+ZppiEKIztKm9ptaRlz3A7D4cRWvDj+jvbS83SyK4vMIkRbLmB029POlDZ73wGAZ1rntLvStdPe2T6gqZ3V0lgGk3n83yv90FQ5yr8Z6Qgj7iJZsMGCU8jz7xv5oVrrFhEhgiOggYSNMgrl5R5JaIySRQ1Qr0caNx19Cif2jN4D4bM1MFWy1fDdFiwI/WTeeMVUadvPfmeoc9QQjf4uLfttJEXxS8tlZn2H7X30OuaiYLpi+t2UhgEU0n8/ZOqDazAWe2jhQwdwtVuQqrYbODP32GOV7U7eyiipcqxvfmFzweqXK3fmHyKiabKDb28WX0KHBf13m8MBunI7DevrZzPyBwzf5J2r+G9Z2DwVNk3EI7cve5WahpCAkvVgpEVL+BDHMdf7Vad6wMXAUqVwBfVDlgbvPICywQ+xfEAKjosF4cxq5d2cl73HxyMkFw=)

`addProps()` behaves much like the iterator functions discussed previously, skipping over fragments and walking their children instead. Text nodes and comment nodes are also skipped by default as they don't have props. The callback will be invoked for nodes corresponding to elements or components, with the node being passed to the callback as the first argument. In the example above the VNode isn't used by the callback, it just returns an object containing the props to add.

`vue-vnode-utils` will use [`cloneVNode()`](https://vuejs.org/api/render-function.html#clonevnode) to take copies of any VNodes that are modified, leaving the original tree unchanged.

VNodes represent event listeners using props that begin with `on`, followed by the event name in PascalCase. So, for example, a listener for the event `update:modelValue` can be added using the prop `onUpdate:modelValue`.

```js
import { addProps } from '@skirtle/vue-vnode-utils'

// Inside a render function
const children = slots.default?.() || []

const newChildren = addProps(children, (vnode) => {
  return {
    'onUpdate:modelValue'(newValue) {
      console.log(`update: ${newValue}`)
    }
  }
})
```

Added props will be merged using [`mergeProps()`](https://vuejs.org/api/render-function.html#mergeprops), with special handling for event listeners, `class` and `style`. Likewise, if the props include a `ref` property it will be added to any existing `ref`, rather than replacing it.
