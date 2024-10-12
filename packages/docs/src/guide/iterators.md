# Iterators

`vue-vnode-utils` provides several iterator functions that can be used to walk slot VNodes *without* modifying them. They are roughly equivalent to the iterator methods found on arrays:

| Array     | vue-vnode-utils  |
|-----------|------------------|
| forEach() | eachChild()      |
| every()   | everyChild()     |
| find()    | findChild()      |
| some()    | someChild()      |
| reduce()  | reduceChildren() |

Most of the iterators take three arguments, except `reduceChildren()` which takes four. The first is the array of children to iterate, which is usually created by calling a slot function. The second is a callback function that will be passed the top-level VNodes in the order they appear.

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

The optional final argument for each iterator is an object containing [iteration options](/api.html#iterationoptions). The iterators will usually pass all node types to the callback, but the options can be used to restrict iteration to specific types of node. The available node types are `component`, `element`, `text`, `comment` and `static`.

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

See it on the SFC Playground: [Composition API](https://play.vuejs.org/#eNp1VG1P2zAQ/iunMKmtaF62L5MyoDA0bdPGNg2kfSAIQuw0Xh07sp3Sqep/39lOAikgqFTfPffcc2/dBmdNE61bGqTBkS4UawxoatrmJBOsbqQysAVF88KwNYUdlErWMEH8ZPB/Z9r8Yaa6kibnHSCKR9bor0Z8JgoptAFmaK3heKCdXmcCMI2hG5PC5DclkznoSj6kYFSLWecj/2dFqRgQZc71M8hHjgLHHJm4mT1KsJ4zzlHEdAbHJ7C14aVUMH2UCLL0UmfeDe4V2VCMs6zWisT4fxT73mHX8IGwhueG4gvg6L41Rgo4LTgrVsdZ0OXOAucGuLSEORosOPZoH8mxh+EDNjE0tosdfqCHdYiSkdGpZcKrHXgdAWJY2UGc9CdubNjW12TbBjuso3c8E/20dNdy5PnCCB0JdpExZ73QeNwI9OzXM4IE88CvVFjnDa6MFLiUrvWY3zmwuLQfRhac6hVThtMY1zFcC0lo2BrGHSgLKmMancZxK5rVMipkHb+Gjwnq2jdGVNfhvZIPmqqI0DXqyYJ+4Kh0f79R6nAv1cuHsgVc+Oq8YpzM4fLb11+35z8vLj79uLoc8K9JdNdDN46G0DJvuYGyFXg+OCTHeC4xiaDCTG/nmElzaTTsutX1S11YnKICR+jcWJZjWkR4BIsFXN+4XuOHU0TLVhiEJr1xED/tiebd9Tjo4eFeUXhuPlDh74kSUE0nhK3xLN25w+P7zrF6lhTebN2X3d3M3bQVb4UsLL7lCO+zzyAF0fq7sbeNg8G5aPOPUx0V2k6k2+JDwES+E/dSEapSeNtsQEvOCBwkSfLBuupcLZnA1WzQnTSbzrjBjSWmSuFd0hubnBAmlgMMM2eopMuQF6ulQs0khYPyvf1zQS9kLoriSWZPBwlYOY4Sz9dRjvJ5d7D7DxDe6XQ=) | [Options API](https://play.vuejs.org/#eNp1VGFv0zAQ/SunDKmt1iaFL0hhWzcmBAgGiE3iwzJtWew0pq4d2ZeuqOp/52wnYS2r2qrx3bt373x32UQXdR2vGh6l0YktjKjxLFNiWWuD8FVY/CWwutGYSyiNXsIgTnas8W87yBRApvjaxzBe5o1E2DhroYlIcYU2DQbY5XSm7TjEA7Ac8+GoAxqOjVHdCUAgXxLNbXcG2ADyNaYw+MnZYAy20k8poGl4y7mH+mg4Vz2uzKU9AHwvG77H16HuwoM/u1j3v+RYafavQhd3IWVXSYYZltrAsNDKoi8DdAlYCRv7mvqKuypjxwCnPnXnaRWExJmi70nSt4sOFFbLHDmdAE4eG0St4LyQolicZlErKYu8G+DaJcjJ4MBJQIdISe2ZPFF/Juga1OJ7elhNqBZi9GUIFbrS83oCwoiyhfhSnrnpljehRnfXsO0v9gXRz6/Cd4t4PgnGdwT7yESKTmiyexHk2a9nBxKNozDrk2Ve0yxrRXsQ2tY6qLi+s1l0bhfCoOQJbcxkpTTjkwaF9KAsqhBrmyZJo+rFPKbhTw7hE0a69o0xt8vJo9FPlpuY8RXpyaKu4aR0f/FIaruoG6hg2y4okdJG9g6eF9VlJSQbw/WXzz/uL79fXX34dnPd4w9JJJL/lrpsVIGCmuQZL7vtHt6PKZOVGi1s23EO0144nOGKWujdVJZnmsW0HrMZ3PqFcj/JCa0bhQSddsZe/LAjGgMFnp4F6PHxXlGjLrB9eVTDARMr2uX2rdGfHzxrYEnh1cY/bB9G7esgCJk5fCMJ3mUfQQqqCXtzR8moMdQXi38kt3FhXUfaKT4GShRu4lEbxk0Kr+s1WC0Fg6PpdPrOvzpyMxeKRrMm97Ret8Y1TSzDKoU3085Y54wJNe9hlDkjJW2GvFjMDWlmKRyVb93HB72QuSiKZ5kDHUzByfGUtL6ecidfcEfbv9o9BU0=)

The example uses `SKIP_COMMENTS` to skip over the comment nodes created by the falsy `v-if` conditions.

We could also implement this example using `reduceChildren()`. Unlike the other iterators, `reduceChildren()` takes four arguments. The third argument should be the initial value of the reduction. This is similar to the native Array method `reduce()`, but with `reduceChildren()` the initial value is not optional.

```js
import { h } from 'vue'
import { reduceChildren, SKIP_COMMENTS } from '@skirtle/vue-vnode-utils'

export default function ChildComponent(_, { slots }) {
  const children = slots.default?.() ?? []

  const count = reduceChildren(children, sum => sum + 1, 0, SKIP_COMMENTS)

  return h('div', [
    h('div', `Child count: ${count}`),
    count ? h('ul', children) : null
  ])
}
```

See it on the SFC Playground: [Composition API](https://play.vuejs.org/#eNp9VGuP0zAQ/CurgNRWtEl5SEjhjgNOJ94PcSfxgSDIJU5r6tiR7fSKqv53xnaaPrhDrdTaO56dXe94Hb1smnjZsiiNTkyheWPJMNs2zzPJ60ZpS2vSLC8sXzLaUKVVTQPgB338Azf2G7fzK2Vz0QHi5GA3/m2Az2ShpLHELasNnfa0w++ZJKSxbGVTGnxl5WBMZq5uUrK6RdbxQfy1Zkz2iCoX5h/IKwGBhxyZ/DHaSXCRl0JAxHBEp89p7Y5XStNwJ5FUFaSOQpj8KnZHcc6xul0Q43uShN6ha1gA1ojcMqyITq5ba5WkF4XgxeI0i7rcWeTDRJeOMMeGAycBHU4K9HBygyZOrOtih+/paTmBZDB6tVwGtT2vJwCGVx3ES98Lo2HrUJNrG21Qxzbwj+j90n3LwfOGl+xAsD+ZCL4Vmhw2ApHjeg4g0TgKIzWp8wYjoySG0rce+X0AxaXby8iiF2bBtRUswThOllKVbNJaLjwoi+bWNiZNklY2i1lcqDq5C5+U0HW8GTNTT661ujFMxyVbQk8WbS8cSo/nG1J7v8xvN4ozUtkW7HzORamZHNPl+7dffp5//vjx4tPVZX/oLp3eQmzluUpW5a2wVLUSHsJNedJzhUySSTv8OUY6I5Q1tOnmN0x20SXHPfowavNMZzGccHZG33/4hu/wqpXWm3Vf+nBLA5O1tXOQ+3lAD8c0PSoLrgt8Gs+KljQfDkq+hDu962m3/uXJQ8KU7q/9n82vkbe2k+OEnDl8KwDfKhhRSrIN9nEWx/3geoz9I5iJC+MuphvmB4REoRfXSpdMp/SwWZFRgpd0bzqdPnOhOtczLjGhDcLTZtVtrjC4pZ2n9Gi63WzysuRy1sOQOYOSLkNeLGYamsuU7lVP3ccfuiVzURR7mQMdTcnJ8ZRwsac8yBfCqNQaXFTFZ0eGwcA3XDD9uXHjcWgcPDbq5p3fc89Y12CcmbNiccv+b7MKnvqiGeywhPn7mIVoZkP44vITHpK9YK3KVgD9n+BXhi5gvJUMsFfoGGTv4bzat95CqP7KXKwsk2ZbVP8Oe3wWwTPOBXeVvpP7OH7S23nzF2B7Vmo=) | [Options API](https://play.vuejs.org/#eNp9Vftv0zAQ/ldOAamdaJPykJDCxoBp4v0Qm8QPBEEWO42pa0f2pSuq+r9zfiRry4Y2qfXdd9/d+e5zN8nLtk1XHU/y5NhWRrT4vFBi2WqD8EFY/CawudRYSqiNXsIozfas6W87KhRAofjaxzBel51E2DhrpYlIcYU2DwbY53Sm7STEA7ASy/FRDzQcO6P6E4BAviSa7/0ZYAPI15jD6CtnownYRl/ngKbjkfMA9dpwrgZcXUp7B/CV7PgBX4/6Eb74s4t1n0uOjWY3Hbq4l1L2nRRYYK0NjCutLPo2QNeAjbCp72nouO8ydQxw4lP3nlhBSFwo+j/OhnHRgcJaWSKnE8DxVYeoFbyopKgWJ0USSyoS7wa4cAlKMjhwFtAhUtJ4ptc0nym6AUX8QA+rKfVCjL4NocJUBl5PQBhRR4hvZcdNt7wJPbq7hu1wsbcUvXsVflrE80Ywvlewj8yk6AvN9i+CPIf97EGSSRJ2fbosW9plrUgHYWzRQc0Nky2SF3YhDEqekWKmK6UZn3YopAcVSYPY2jzLOtUu5iktf3YXPmNU16Ex5XY5vTL62nKTMr6ieoqkHzhVeig8KjUKdQMNbKNAiZQUOTgMZ13FzxohmeFqAhfv3375efb548fzT5cXQ9BddRLTP8quO1WhoEl50rNe4uOfE0pnpUYL27jTYeWrmJzm6N3Um2c6TUkjp6fw3atqB687hQTeL33c05AyuyWcPPcfD+DhBGYHbR31fPENacYjJlYk6fh4DOdfnjwkzOH+xn/Z/jqKr0Io5NThO0nwvoIjyEF1QT4/KBnNh8Zj8Y/kNq2sG0xc5gdAicJdXGnDuMnhYbsGq6VgcG82mz3zL0hp5kLRhrbknrXraFzT4jJscng0641tyZhQ8wFGmQuqJGYoq8XcUM0sh3v1U/fng27JXFXVTuZABzNw5XhKUrGn3MsX3NQpWhpULeYHgnGvvZDcfG7deuwLhx4bff3O29yzFi+YYhpeLW6x/7broKkvhpMcViT+wYdUNMfgPr/4RA/JjnOpWScJ/R/nV063QOutVYC9ohujsndwvtq3XkLU/aU9XyNXtm+qf5fjL1dCmnEquKv1m3Ifp08GOW//AlHHcjQ=)


While these examples need to display the count, a more common scenario involves only needing to know whether the count is 0. The [`isEmpty()`](/api.html#isempty) helper can be used in that case.

It is worth noting that the count here is just a count of the VNodes. It is not necessarily an accurate count of the number of `<li>` elements. If any of the children had been a component it would have added 1 to the count, even though a component wouldn't necessarily render exactly one `<li>` element.
