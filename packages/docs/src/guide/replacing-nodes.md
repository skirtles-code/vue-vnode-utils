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

See it on the SFC Playground: [Composition API](https://play.vuejs.org/#eNp1U8tu2zAQ/JWFerAM6JUWvbhW2jSnAk2PvURBwVhUxIYiCZLyA47+vbuU7NhJbVgAudydmV0O99GNMdm659EiWrqVFcaD474315USndHWwx4sbxJY6c70ntcwQGN1BzMsmh2Tblsh61tM0YorP2Vk+XmYeLCkUiutnEfEHlNLgo8/zQ9R4XnnMHrgi+M5lNdwx3ybdWwbF8m0FioOCNmayZ4ncFXM54iyzMc2sAHcIJiRzHPcASyFQkhYp52uuSyrKNRXEfid4bhVfffILe4RG7cFrdgWV1e4HBHOGwoxgO+80ZaP66UUSIB7wgOBf+pnKqfffg8KhmHKzqWYTm4aj9zE8WZqeL7Mj31ESTSOPO2Yyf46rfDm9lRXTQdItoAQodg39yyslzzH2adrhY2nvRcyJFVR671xizzvlXl+ynDk+aX8vBbOvw1m3HXpo9Ubx21W8zXqqSJixvYGVPr++l9tdmqwlcSE378QN4H2/wYjF+IEVjxgWo4znNIuKQ5O49tQXfOG9RJ92auVF1rB3e4n9hP/SRDYSe0dDHMaWuUnbx5YyvEYuwsIXzO048sL3D8Q+iFb8c1RFvn5TGh8wEogDvKCn8cr83kOPxrwLR8ZQThg0nJW74CRl64T4Mr1lqOPoGUupM4kak/JWDMcHXOOlACIZiLIyM9QliVlzkJfxAWozPdWnYx7zKchBJzFGfSAr4mq8DIviVUz/07vxjJDatH7SDNCTMRtTIIu0SVwH+Q8BF5iR1L8Xot7icUnw8YUFHf+4p3fSXru2RF67P9R25rbBVyZLTgtRQ0fiqL4Qkcds09CpV6bBXw22ym2TTei9u0CPhbFFDSsroV6OmSN3IEvGv4B7DPPvA==) | [Options API](https://play.vuejs.org/#eNp1U8tu2zAQ/JWFerAM6JUWvahW2jSnAm2PvURBwUhUxIaiBHLlBxz9e5fUI4kdGzLAXc7OLJfDo3fTddG2517qbUyhRYfXuRJN12qE21rI8ralQHGFUOm2gVUUv03b4lWucsX3rqjkFeslwjFXAMWMMumYgBNSmxsCWw5QMmT+esZpjr1Wc2SpeoUpfBrj4XWhVemRl4uGQN6YF6qF7BfDOmrY3k+CaS2Uj7UwkWMP4CpZr18L5Iq+TbwMhgKi7iRDThHARihShm3YtCWXWe45ntwDPHScQtU3D1xTTEIUJnbF9rS6ouXI8HYeLgfwnVet5uN6IwUJUGz5QNBnTzeV29/xCAoG1zChYymmnZsKSdtqnFwZ7W/i5Rxe4I33HTasi/6ZVpEX3OTyaYPEltHm3jfzJDRKHtPFh1tFBw97FNKBcq9G7Ewax73qnh5prE18CR+XwuBpMuKmCR90uzNcRyXfUj+5N18FdXruvfeMe4RCEuDPb+INoIZh8u5o1QWkOU2g4I5Tc5rhBLvU8Xs2r3pVoGjJW4efdB7/b0DERrZoYHAGzLFolUEoZpVs3KbTOYavERn1+Rnu7i37jFZ8t7SVnTbqz1wB+K69NWTX4wXlGMfwowKs+agIwgCTmrPyAMx66ToArkyvOfkIamYcdCWp99Aaa0WjY8bYTugdVZNAZP0MWZZZ5Gp6WBYxPayXcY94OwTHk76hHuhx2Sq6zEvNqhWe9bvTrLPdkvdJZqSYhGvfNnRJLoA7186907XqJEr/l+JeUvGrYRPk7MUbPEj73KOFejz/Q6tLrlO46vZgWilK+JAkyRe71TD9KFSIbZfC524/5fbhTpRYp/AxSaZkx8pSqMcZNWo7PW/4D82+54Y=)

As shown in the example above, `replaceChildren()` can be combined with `cloneVNode()` to recreate the functionality of [`addProps()`](/guide/adding-props.html). It can also be used instead of [`betweenChildren()`](/guide/inserting-new-nodes.html) to insert nodes.

The callback function can return either a single VNode or an array of children. The returned nodes are inserted into the tree to replace the node passed to the callback. The original node can be included in the returned array. If the callback returns `null` or `undefined` then the tree will be left unchanged. An empty array can be used to remove a node from the tree.

As with the other helpers, fragment VNodes will be skipped and their children will be walked instead. The fragments will be cloned when replacing child nodes but the overall structure of the fragments will be preserved.

If the callback returns an array it will not be treated as a fragment, the individual children will be added in place of the current node. Any arrays nested within the returned array will be treated as fragments, just as they would when passing children to `h()`. When making changes to the tree structure it is important to consider the impact of fragments and `key` values to ensure that the VNodes get paired up correctly across re-renders.

`replaceChildren()` takes an optional third argument specifying [iteration options](/api.html#iterationoptions), much like with the [iterators](/guide/iterators.html). Unlike those iterators, the default value for `replaceChildren()` is `SKIP_COMMENTS`.
