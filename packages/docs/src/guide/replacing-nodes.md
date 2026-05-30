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

See it on the SFC Playground: [Composition API](https://play.vuejs.org/#eNp9VMtu2zoQ/ZWB7sIyIEvO7b0b105f6KJFX2iLbqqiUKxRxIaiCJKyFbj+9x5SshOndYMYIOdxzszoDHfRM63TTcfRIlratRHakWXX6ctciUa3xtGODFcJrdtGd45L2lNl2oYmSJocg17UQpYvENIqVm6MSLNTs+dBSq7WrbIOiB1CVx4+fjQ9WIXjxsJ64IvjKa0u6W3h6rQp+niejGeh4oCQbgrZcUIX8+kUKMtsaAMN4AIwLQvHuBEthQIkbWZNW7Jc5VHIzyNyt5pxVV1zxQZ3YOM696eix+kCxwHhtKFgI3rOVWt4OC+lAAHuHo8E/n0/Y7r/2+1I0X4/RmdSjJ5nlQO353gwNfiX2bGPKImGkc+aQqc/bKvw5XY+Lx8dIFtQsHjbU3sjjJOcYfazjULjs84JGYLyqHZO20WWdUrfXKcYeXYuPiuFdQ+NKdtmdmXarWWTlrxBPXnkmdHeHpX+/vnvZHZfYGuJgC/vgJtQ/WeBeRViAmsOmIYxwzHsXMVBadyH7JKropPQZafWTrSK3t6+QT/x9wTAVrbO0n7qh5a7UZsHltXgRncB4UkKOf78SV+/efRDtOLtsSyv55NC4wNWQnEoL+h5+GQuy+hVRa7mgZGEpUIaLspbKryWLhNiZTvD0BHVhQ2hE4naZ15YE4yusNZXQiSqkSD1eqbVauUjJ6Evz0WozHVG3Rv3EO+HEHAWJ9B7bJPPwsc8V6yauN/q3ZpC+2qhfdAMECNxHfuCztEl9DWU8y3wenaQ4neX3Ekk3xs2QlDc6cZbdyv9uqdH6KH/q9aUbBZ0oXuyrRQl/TOfzx97V1OYa6FmrtUL+l/3o62fbUXp6gX9O5+PRl2UpVDXh6iBO/BB7M5CDJW4frCU/h0Tks177YV3upyFlO32dbA5gzfsYF/XvL4Z7FUh7Z3jh+2Hxf1gGDu34Tw6+hy6YLxm3v3y0zvucT468eJ1EtF/cX5kjAWb06oh7HmnStR9Ly6U+yrsI6bw2b7sHcR56Mp3EHY/xOcR1tGv/rne78p9lP53fDP2vwAy6TkV) | [Options API](https://play.vuejs.org/#eNp9VNuO2zgM/RXC+5AM4NiZ7e5LNpntBX1o0Rvaoi91UWhseqyOLBsSnXiQ5t9LSbYzk2kaOIBEHp1DUqT20bO2TbYdRqtobXMjW7rKtKzbxhC8qKQqXjS80agJStPUMEvSh2Z3eJbpTGPvDxVYik4R7DMNkI8ouwoGOCF1tkPsjgMUgsT8YsQZpM7oceeoOk0reBL2h/sHnUpHWEwakrC2R6qJ7K2gKqlFP1/Gw1rqOVXSJp49hsvlxcV9gUzzt06nwvCGqVslCHkHsJaalWG7qJsC1SaLPE8WAd21yFvd1ddoeM9CvF26leh5dcnLwPCwHt4G8BzLxmBYr5VkAd47PpD8ueyG4+6334OGgw+Y0amSg+dZSaztNE6ujP3rdMojiqNw34tatMkP22juBV+5bHCw2FTaLHpqb6UhhSlf/GKrOfFFR1J5UBZVRK1dpWmn29sbLmudnsOnhbR0akzQ1otr0+wsmqTALceTReNVcKSPe+93jbuHXDHgyzvmjaGCw9C7oVUnkEGuQI6e0yDXcICdi/h3bV52OifZcG/dveF85t9jJraqIQsH34AZ5Y22BPmosgluzs4z/J9wo/78CV+/OfYRrXE3hbU5DXQ+csUw9+FdwOYqXFBGaQqvSqAKgyJIC0IZFMUdCNdLVzGgtp1B7iOohPXQmeLYF66xZlw6Ya2LhOeoHAQS18+w2WwccjYMlkMMg3Usd8C7Inie1QPqAw+XO8WXeS5YPaNH8e6MaF203PssEygG4WruAjonF8NXH843r+vUWZT/x8Od4sP3is2QRxNv6U65cU8m6pD/dWMKNCu4bHuwjZIF/LVcLv9zrlqYG6kX1LQr+LftB1u/2MmCqhX8vVwOxlYUhdQ3Iypoez1udrLcDKW8ORlK99xJheZ96xrv4XAKpZrda28j0yE/kMGeV5jfBnsplD06ftg+DO4HgzxzW8yiyUecBfJr5twvP73DnteTk1+8TjH6D86PyGXhyWl0gD3vdMFx38P5cF/5eeQqfLYve+LmHLNyGYzvvEPzOLrRP5f7MdwnyT/Tm3H4BXk8UN8=)

As shown in the example above, `replaceChildren()` can be combined with `cloneVNode()` to recreate the functionality of [`addProps()`](/guide/adding-props.html). It can also be used instead of [`betweenChildren()`](/guide/inserting-new-nodes.html) to insert nodes.

The callback function can return either a single VNode or an array of children. The returned nodes are inserted into the tree to replace the node passed to the callback. The original node can be included in the returned array. If the callback returns `null` or `undefined` then the tree will be left unchanged. An empty array can be used to remove a node from the tree.

As with the other helpers, fragment VNodes will be skipped and their children will be walked instead. The fragments will be cloned when replacing child nodes but the overall structure of the fragments will be preserved.

If the callback returns an array it will not be treated as a fragment, the individual children will be added in place of the current node. Any arrays nested within the returned array will be treated as fragments, just as they would when passing children to `h()`. When making changes to the tree structure it is important to consider the impact of fragments and `key` values to ensure that the VNodes get paired up correctly across re-renders.

`replaceChildren()` takes an optional third argument specifying [iteration options](/api.html#iterationoptions), much like with the [iterators](/guide/iterators.html). Unlike those iterators, the default value for `replaceChildren()` is `SKIP_COMMENTS`.
