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

See it on the SFC Playground: [Composition API](https://sfc.vuejs.org/#eNp1VMuO2zAM/BXCPcQB/EqLXtw8ut1zi556qYvCiZVEu7YkSLI3QZB/70ix89omyIEaDociKfoQPCmVdC0L8mBqVporS4bZVs0LwRsltaUDabaOaCUb1VpW0ZHWWjY0QtDoTHre8rp6BkUKJmzPSNJb2OVBSCFWUhgLxRbUmZMPP40HlFvWGKBDvjAc02xO30u7TZpyF2ZRb3MReoWkK+uWRTTJxmOoTNNTGSgAB4ipurQMJ6IpF5CkLm5kxepZEfj4IiC7VwxH0TZLpnGGNo6Zs8odrAnMk8JtQR4DWvFu/o2tpWbT1NkXGMkAO23i+Lvaein3OxxI0PHY0+9C509ry/QFnd51E+A0PdcXRMFpFHFTquTFSIGJHlxc0TuQOCePOAyjcOci2FqrTJ6mZr1y83kxidSbFFai0RzesISZJl5q+WaYhnARRIPGV/PKta2ZY8edQFPj1vLaJ7oIt0K9bhKMM33ER4nG3oM3aSvW3aYGOYWjYzrWTFRMu7k9LueO+q4kJ4sxHNHF90/2shrXS7H9/yIcqKyqn1oqc/Y/KtuvAtv5sIqty7ZGuLuJX8DwbwQxU0sLpfEwOA2XFnTaiR4j7IrbHMf99QPybn18IPrmZRcJAhYL+v3HpbyOWblq0RZEDPcOLzrRfaLzBa4QSNWlMTmNmn3s9VDY4OrfNgys5mD3GttwhLc9wqelvwQonupH3E/kfqGN3ddum5Mh2ekqS6kx2ZwmakdG1ryiD1mWfXGuptQbLmIrVU6f1a7HdvEbr+w2p49Z1oMKHeBiM7BOqX264PgP0vu57A==) | [Options API](https://sfc.vuejs.org/#eNp1VMmO2zAM/RXCLZAEiJe06MV1kk7n3KKnXuoenFiJNWMtkGSPg8D/PpS8ZZkEOYiP5HsiRfrsPUkZ1BXxYi/Re0Wl2aScMimUgeeClvmzQIMTbuCgBINZEF7DNnmW8pSTxiXl5JBVpYFzygH2Q5SOOwBuSC3WLm06QJ6ZbL4Y4hQxleKDZakqbmL42tntZaJVqQzJRw1qCNMT1Uj2KzNFwLJmHi37M+VzU1AdOPYlrKLF4lIg5fhPwrExaCC1LDND0AJIKEdlqH0mclKuU8/xpB6YkyRo8ortiEIbhdCM7Clr8LTCY8dw3Q+HIZrTevOTHIQiSWjPE4xiCFtuoPi3lfZU9nc+A4fWXR7Db1I3TwdD1IQmN0+JYBKO9XlLr5sDn2UyeNGC44y4jqa9A4XHlqcezoG1U68wRuo4DPVhb4fjRQdCHUM8BQqbQxkJiGb+Tok3TRQSpx6+Y8fxQ79SZUpio/2aY1P9ytDSCU3EFZevR3wyFj6KxxK1uQWvZHNSX0tjcIiOmihfEZ4TZd/tcTk3oXclDeODXbzfl4+W7QwFtP2OdSs1OrI8/6OE1KP/UdkP97C75rQRe8G1AV0K8/c3ZmtYg1uDzxbS2ByXuw0wY7uFf//7Jl3k7m1RSIuZw/XmE98SMHO9uVvA0UaaMtP4VZixk++48O6dox/eFhfx6ktQzGc4uLPlKO029aMV1eZU2v0MBu5OdycUNiGGlWxAi5Lm8CmKou/WxTJ1pNw3QsbwTTY91vhvNDdFDF+iqAclFkv5cYjqpJ2c174DBlzG3w==)

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
