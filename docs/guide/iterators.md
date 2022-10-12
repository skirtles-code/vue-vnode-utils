# Iterators

`vue-vnode-utils` provides several iterator functions that can be used to walk slot VNodes *without* modifying them. They are roughly equivalent to the iterator methods found on arrays:

| Array     | vue-vnode-utils      |
|-----------|----------------------|
| forEach() | eachChild()          |
| every()   | everyChild()         |
| find()    | findChild()          |
| some()    | someChild()          |

Each of the iterators takes three arguments. The first is the array of children to iterate, which is usually created by calling a slot function. The second is a callback function that will be passed the top-level VNodes in the order they appear.

```js
import { eachChild } from '@skirtle/vue-vnode-utils'

// Inside a render function
const children = slots.default?.() ?? []

eachChild(children, (vnode) => {
  console.log(vnode.type)
})
```

Just like the array methods...

* `eachChild()` will ignore the value returned by the callback. When iteration is complete it returns `undefined`.
* `everyChild()` will stop iterating if the callback returns a falsy value. When iteration is complete it returns either `true` or `false`.
* `findChild()` will stop iterating if the callback returns a truthy value and return the corresponding VNode.
* `someChild()` will stop iterating if the callback returns a truthy value. When iteration is complete it returns either `true` or `false`.

The array of children does not necessarily need to contain fully instantiated VNodes. For example, text nodes can be represented as just strings and fragments can be arrays. This is consistent with how Vue handles the children passed to `h`, and how it handles values returned from render functions or within slot functions. If you obtained your array of children by calling a slot function then Vue will have already promoted the children to full VNodes, but the iterators don't require that.

The iterator callback will be passed a fully instantiated VNode, even if the original child array contained some other representation of the child. This is a design choice. `vue-vnode-utils` aims to remove the burden of worrying about the various edge cases, but here we have to pick between two different edge cases. The callbacks only need to worry about handling full VNodes, but the tradeoff is that that exact VNode may not be in the original array. In practice, this should only affect text and comment nodes, and only in cases where they haven't come from a slot function.

Fragment nodes are never passed to the iterator callback. Instead, the iterator will iterate through the children of the fragment. The iterators do not walk the children of any other node type, just fragments. They are only attempting to iterate what would generally be considered the 'top-level' VNodes.

The optional third argument for each iterator is an object containing iteration options. The iterators will usually pass all node types to the callback, but the options can be used to restrict iteration to specific types of node. The available node types are `component`, `element`, `text`, `comment` and `static`.

So if we only want to iterate over `text` nodes we can pass `{ text: true }` as the third argument.

There are constants available for the most common combinations: `ALL_VNODES`, `SKIP_COMMENTS` and `COMPONENTS_AND_ELEMENTS`. The iterators all default to `ALL_VNODES`.

The following example defines a functional component that counts the number of children in its slot. The count is displayed above the list and the wrapper `<ul>` element is not rendered if there are no children:

```js
import { h } from 'vue'
import { eachChild, SKIP_COMMENTS } from '@skirtle/vue-vnode-utils'

function ChildComponent(_, { slots }) {
  const children = slots.default?.() ?? []

  let count = 0

  eachChild(children, () => count++, SKIP_COMMENTS)

  return h('div', [
    h('div', `Child count: ${count}`),
    count ? h('ul', children) : null
  ])
}
```

See it in the SFC Playground: [Composition API](https://sfc.vuejs.org/#eNp9VGFP2zAQ/SunMKmtaJNuXyZlQGFo2qaNbRpI+0AQhMRpTV07sp3Sqep/37OTpqTA1Faqfc/vvTvfeR2clWW4rFgQB0cm07y0ZJitypNE8kWptKU1aZZmli8ZbajQakE94Htt/Ds39g+3sytlU9EAwqizGz4Y4BOZKWksccsWho5b2v51Igkylq1sTL3fLO8NyczUY0xWV1AdduKfNWOyRRSpMM8gHwUMdjkSeTPYWXCRMyFgoj+g4xNau+OF0tTfWSRV1FYHdZj8KnRHcc6xul0Q43sU1bVD1bAArBSpZVgRHd1X1ipJp5ng2fw4CRrtJPBhoktHmGLDgaMaXZ8UqOHoEUUcWVfFBt/S03IEy2D0brms3ba8ngAYXjQQb/1JGAVb1zm5stEGeWwDz0w/Td2XHDxfeM46hv3JSPCt0ahbCET28+lAgmFQt9RokZZoGSXRlL700PcBJBdvLyMJ0IVunQQza0sTR5EpMtfKDyZUehrhX6grafmChcwsRvdaPRqmQZwEvl0cx6mZc20Fc+jRUqqcjSrLhRfaEVeynE/DTC2i1/BRjtz2NzuyOVt2pQGOEFgyPdJM5kwz/b909qDPUto2I6q4P3soYzvLs5eHeE0Yxtn5jIt8SJffvv66Pf95cfHpx9Vli38tdT/ZbOVpclaklbBUVBKjjQbyjOcKIpJJ278dQskIZQ1tmrGqBy5zOOSG9vJhlMszTUIM6GRC1ze+D/ATDGiFewV0vN1szfe3RMNmsj308HAvKTwF9UGNt05LmvV7OV/iyfBPEe3Wd561Zonpzdr/2dwNmlusjUwcvhKAb9UHFJOs6pl27w4uBvdi7F/BTJgZdyPNhB0ShOpK3CuNq43pbbkiowTP6WA8Hn9woUWqp1xibEqEx+Wq2VxhmnI7i+ndeLtZpnnO5bSFQTmBk0YhzeZTDc95TAfFe/fxh15QzrLsiXJNR2NydjwlnhZP2dGrw8HmH3o0IAY=) | [Options API](https://sfc.vuejs.org/#eNp9VG1P2zAQ/iunMKlFNEm3L5MyoDA0bdPGNg2kfSAIQuw0pq4d2U7pVPW/7/ySQApMgIh9zz13z53vNtFp0ySrlkZZdKhLxRpznAu2bKQy8J1p84eZ+lKagkOl5BJGSTq4Te71KBcAuaBr50NoVbTcwMbelhKJBBVGZ/4Chpz2ajvx/gCkMMV4vwMqaloluhMAM3SJNFfdGWADhq5NBqPflIwmoGv5kIFRLQ2cO6jPilLR46qC61eAH3lLd/g61LX/cGfra/8vqakleVRo/U4575TkJjeVVDAupdDGyQBZgamZTpymXnGnMrEMcORCd5aQgQ+cC/w9TPt24QHdGl4YiieAw7vWGCngpOSsXBzlUUgpj5wZ4MIGKPDCglOP9p4c2xM/YH9iYxsU8D09rGLUgoxOBhO+Kz2vI0AMqwLESXlixipvvEZba9j2hX0h6aelcN1Cni+M0EHCzjPlrEs0HRYCLbt6BpBoEvm3Hi+LBt+yFDgHvm3BgOL6zuYRDoo951FtTKOzNNVVaafnXidSzVP8SlQrDFvShOplfKfkg6YKifMovLQ8OtELpgynFh2vhCQ0bg3jLtAjcSuaxTzBAUpfw6cEte1eDsISuhqGRnCKhhVVsaKCUEXV/+TsQJ9J6h4jVnF3KWAZwxLZQA3bsDyQGrdFb6BFWZ/VjJMJXHz7+uvm7Of5+acflxc9/jXpSPJs4VStKA3DB+QYz7rNM76ZYCTNpdGwDaPmJ7G0ONSGz8uZsVyOaZbg6M5mcOWG3f5ximiJfUXotLvskx93RBNAx6NjDz042BG13zmGxVaPR4StcM+Ejdafbx2rZ8ngzcZ9bG/3Qxd9IjOLbznCu+j7kIFo/UxfYzBsDPZFm7+c6qTUtiNhwg4AA/lK3EmFrc3gbbMGLTkjsDedTj+4tVaoORM4Ng2ap806XK5xmoipM3g37S6bghAm5j0MI+eYSYhQlIu5wpxJBnvVe/vjnF6IXJblk8ieDqZg03GUuFoc5SCeN0fbfzO5O9A=)

The example uses `SKIP_COMMENTS` to skip over the comment nodes created by the falsy `v-if` conditions.

While this example needs to display the count, a more common scenario involves only needing to know whether the count is 0. The [`isEmpty()`](/api.html#isempty) helper can be used in that case.

It is worth noting that the count here is just a count of the VNodes. It is not necessarily an accurate count of the number of `<li>` elements. If any of the children had been a component it would have added 1 to the count, even though a component wouldn't necessarily render exactly one `<li>` element.
