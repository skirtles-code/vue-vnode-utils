# Replacing nodes

`replaceChildren()` can be used to add, remove or replace VNodes.

```js
import { cloneVNode, h } from 'vue'
import { replaceChildren } from '@skirtle/vue-vnode-utils'

// Inside a render function
const children = slots.default?.() || []

const newChildren = replaceChildren(children, (vnode) => {
  // If the child is already a <li>, ensure it has the 'list-item' class
  if (vnode.type === 'li') {
    return cloneVNode(vnode, { class: 'list-item' })
  }

  // If the child isn't already a <li>, wrap it in one
  return h('li', { class: 'list-item' }, [vnode])
})
```

See it on the SFC Playground: [Composition API](https://sfc.vuejs.org/#eNp1VMlu2zAQ/ZWBerAMaEuLXlw7XXIq0PTYSxQUjEVZTCiSICkvcPzvnaEkJ0pqwwbI4Zv3ZvUx+m5Mtu14tIiWbm2F8eC478x1qURrtPVwBMvrBNa6NZ3nFZygtrqFGTrNzqCbRsjqBiFaceUHRJZPzaSDLqVaa+U8MnYIXRF9/Gk+WoXnrUPrqBfHc1hdwy3zTdayfVwkw1moODBkWyY7nsBVMZ8jyzLv08AE8IJkRjLP8QawFAopYZu2uuJyVUbBv4zAHwzHq+raB27xjtx4LejE9ni6wmPPME0o2AB+8Fpb3p+XUqAA3okPBH4pn8GdPscjKDidBnQuxfDyvfaoTRpvqobvy/ycR5REfcnTlpns0WmFnTuSXzk8oNgCgoVsWHK6l1HjvXGLPHf1mvrw6DJtNzmeMotFEC3PuGvTB6t3jlskLqNk5PjmnoT1khM63SosXtp5IYPQC3GnzNMmw7bll/B5JZx/a5zIVnw7lUZwjg9bblPLVcUt9edyOm+g71IiWiz9Cav4fjRfVuD18K8lAv78xngTaP4//LQh2J01D5wofoZdqkTYAr4P3hWvWSdxZzq19kIruD38wjrFfxMkdlJ7B6c5NbT0w96MKqv+GasWGL5muCrPz3B3T+wjWvHdOSzatUmg8ciVQBzCC7vWj5PPc/hZg294rwjCAZOWs+oAjOb8OgGuXGc5zjg0zAXoTGLsKQ39DEvHnKNIAEQ9CGS0a7BarQg5C3mRFmBkvrPqVbl7PBUh8Cwm1CfcdPLCZl4KVs38u3h3lhmKFvcSZXqKQbiJKaBLcgnchXDugy6poyj+Xpw7ic6vio0QDG76b+T8QdJfUXam7vN/0BbndQFXZg9OS1HBh6IovtBTy+xGqNRrs4DPZj/Y9ulOVL5ZwMeiGIyGVZVQmxHVawe96PQPugsGTg==) | [Options API](https://sfc.vuejs.org/#eNp1VMlu2zAQ/ZWBerANaEuLXlQ7bZpTgbbHXqKgYCTKYkJRAjnyAkf/niG1OLZjwwY4wzfvDWfxwbtrmnDTci/xlibTosHbVImqqTXCfSlkfl+TobhCKHRdwSyMTt02eJaqVPGdC8p5wVqJcEgVQDaiTNI74IzU+jrfhgPkDNl8MeI0x1ar0bJUrcIEvvR29z7QqrTI80lDIK/MkWoi+8OwDCu2m8f+cBZqjqUwoWP34SZeLN4LpIq+y2gqDBlE3UiGnCyApVCkDJugqnMuV6nneFIPcN9wMlVbPXFNNgmRGdsT29Hpho49w2k9nA/gJy9qzfvzUgoSINvygaCvfd0Qbj+HAyjoXMKEjqQYbu4KJG2rcdYyul9G0zs83+v7HVSsCZ9NrWgWXOXS4YLEptKmHvXb2qlXIjYmiSJTZHYInk1Y63VEp1BTEUTFQ26q4EnXW8M1Eace9avn+GFehEbJLTrYKCpe0KKQTuhI3KrmZU2tqaJr+CgXBs+dJ7I535xKEziiiw3XgeYq59r25/pzzqAXTxrHhKp4uRcfLdUBMkmAf38pXx9K6Ia96tdoAmlO3cm44yTxCXatEh+tYNGqDEVNc7//TXWa//eJ2MgaDXRuOVLMamUQslFl1V9T1RzD95CW6PUVHh4t+4hWfDultTpPdD5y+TB36S1gddsPT4pRBL8KwJL3iiAMMKk5y/fA7Jzf+sCVaTWnGYeSGQedSco9sEM/o9IxY2wmtOPFIBDaXYPVamWRs2HpLWJY+mO5e7wtguNJTqg7WnwbRc28lqya4UW+W80amy3tJcn0FINwObcJXZPz4cGl8+h0rTqJ0u8Y3EoKfldsglz8GxncS/tXFE7U/fufak3zmsBNswNTS5HDpziOv9mrium1UAHWTQJfm93g2wVbkWOZwOc4HpwNy3Oh1iOq13Z6XvcGG48eGA==)

As shown in the example above, `replaceChildren()` can be combined with `cloneVNode()` to recreate the functionality of [`addProps()`](/guide/adding-props.html). It can also be used instead of [`betweenChildren()`](/guide/inserting-new-nodes.html) to insert nodes.

The callback function can return either a single VNode or an array of children. The returned nodes are inserted into the tree to replace the node passed to the callback. The original node can be included in the returned array. If the callback returns `null` or `undefined` then the tree will be left unchanged. An empty array can be used to remove a node from the tree.

As with the other helpers, fragment VNodes will be skipped and their children will be walked instead. The fragments will be cloned when replacing child nodes but the overall structure of the fragments will be preserved.

If the callback returns an array it will not be treated as a fragment, the individual children will be added in place of the current node. Any arrays nested within the returned array will be treated as fragments, just as they would when passing children to `h()`. When making changes to the tree structure it is important to consider the impact of fragments and `key` values to ensure that the VNodes get paired up correctly across re-renders.

`replaceChildren()` takes an optional third argument specifying [iteration options](/api.html#iterationoptions), much like with the [iterators](/guide/iterators.html). Unlike those iterators, the default value for `replaceChildren()` is `SKIP_COMMENTS`.
