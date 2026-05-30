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

See it on the SFC Playground: [Composition API](https://play.vuejs.org/#eNp9VO1u2zgQfJWFeoBtxJZ8dwUKqEnTNgj6/YEmQH9URatIlMWaJgWSclwYfvcOSUmx3aZIAkS7w9nZ5Q630bOmidcti9Lo1BSaN5YMs23zJJN81ShtaUua5YXla0Y7qrRa0Qj40ZB/y439zG19rWwuOkCcHETjHwb4TBZKGkvcspWhs4F2/CWThDKWbWxKo0+sHE3J1Oo2JatbVJ0e5F9oxuSAqHJhfoM8FxB4yJHJr5M7CS7zTAiIGE/o7Alt3fFKaRrfSSRVBamTkCb/FbujOOdYXRTE+D1NwuwwNXwA1ojcMnwRnd601ipJTwvBi+VZFnW1s8inia4cYY6AAycBHU4KzHB2iyHOrJtihx/oaT2DZDB6tVwGtQOvJwCGVx3ES99LY2Db0JMbG+3QR5/4TfR+637k4HnJS3Yg2J9MBO+FJoeDQOa4nwNINI3CSs1WeYOVURJL6UeP+j6B5tL+MrLoqVlybQVLsI6ztVQlm7WWCw/KotraxqRJ0spmuYgLtUruwycldB0HY2ZWsxutbg3TccnW0JNF/YVD6fF+Q+rgl/rPRtkSFr6+qLkop3T15tXHbxcf3r27fH99NeDvk+jdwzaepmRV3gpLVSthH1ySZ7xQKCKZtONvU1QyQllDu251w1IXDqeZxBX6NNryTOcxTHB+Tl+++lnjTzCgVSstoPM+OIgf90TTzj0eenJy1BTsFg5qvCdaUj0elXwNW3q70933d88aWFL6Z+v/2X2feE878U7IucO3AvC++oRSkm3wjfM2Lgb3YuxPwUxcGHcj3RafEAqFSdwoXTKd0r/NhowSvKQH8/n8sUutcr3gEqvZID1vNl1wg40tbZ3Sf/M+2ORlyeVigKFyBiVdhbxYLjQ0lyk9qB65H3/oD5WLotirHOhoTk6Op4R9PeVBvZBGp9bgWiu+OHIKNr3hgukPjVuOQ8fglVG3r33MvV/dgHGmZsUyxL25h8QPswlu+qgZjLCG7YechWpmQ/ry6j2ekL3kSpWtAPovyU8MY8B2KxlgzzEy6N7DebmvvHnQ/rW53FgmTd/V8AJ7fBbBMs4E9/V+J/f/+OFg5N0vM3xSzQ==) | [Options API](https://play.vuejs.org/#eNp9VW1v2zYQ/isHdYAdxJa8F2CAljRtg2Drtr6gCbAPVdEqImWxpkmBPDkeDP/3Ht9U222KJIh599xzd7x76F32vO/zzcCzMruwjRE9Pq2UWPfaIPwrLP4nsLvTWEtojV7DJC+OrPlnO6kUQKX41scw3taDRNg5a6OJSHGFtgwGOOZ0pv0sxAOwGuvpWQIajoNR6QQgkK+J5n06A+wA+RZLmLzjbDID2+mHEtAMPHKeoP40nKsR19bSPgJ8IQd+wpdQH8IHf3ax7v+aY6fZ1w5d3HMpUycVVthqA9NGK4u+DdAtYCds7nsaO05d5o4BLn3q5IkVhMSVot+LYhwXHSislzVyOgFc3A+IWsGzRopmdVllsaQq826AW5egJoMDFwEdIiWNZ/5A85mjG1DEj/SwmVMvxOjbECpMZeT1BIQRbYT4Vg7cdMu70KO7a9iPF/udog+vwk+LeP4SjB8V7CMLKVKhxfFFkOe0nyNINsvCrs/XdU+7rBXpIIwtOqi5cbJV9syuhEHJC1LMfKM04/MBhfSgKusQe1sWxaD61TKn5S8ewxeM6jo15tyu5/dGP1hucsY3VE+VpYFTpafCo1KjUHfQwT4KlEhJkaOD10133QnJZnD7z8u3H6/fvHp18/rudsQ/ViKRfCPqdlANChqSZ7xO6p5+nFEmKzVa2Md1DtveOJzhikbo3dSWZ7rKSR5XV/DeC8r9SU5oPSgk6CIZx+KniWgGFHj5NEDPz0+aOkuB8fHophMmNqTl+GqM50+eNbCU8NPOf9h/OovPQSjkyuEHSfCU/QxKUEPQzQdKRoOhuVj8X3KbN9ZNJG7xOVCicBP32jBuSvi534LVUjB4slgs/vBPR22WQtFq9uRe9Nto3NLGMuxK+GWRjH3NmFDLEUaZK6okZqib1dJQzayEJ+3v7scHfSdz0zQHmQMdLMCV4ylJvp7yKF9wU6doaaytWJ4oxT3zQnLzpnfLcawYemX0w9/e5t6zeMEU0/FmFexe3KPjs90GNb01nISwIdmPPqSqOQb3ze1rekIOnGvNBknoHzjfcboG2m6tAuwFXRnVfYDz5b704qH27+zNFrmyqav0IsfvrIwk40TwWO9fy/01/20U8v4Lff1ulw==)

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

See it on the SFC Playground: [Composition API](https://play.vuejs.org/#eNp9VGuP0zAQ/CurgNRWtEl5SEjhjgNOJ94PcSfxgSDIJU5r6tiR7fSKqv53xnaaPrhDrdTaO56dXe94Hb1smnjZsiiNTkyheWPJMNs2zzPJ60ZpS2vSLC8sXzLaUKVVTQPgB338Azf2G7fzK2Vz0QHi5GA3/m2Az2ShpLHELasNnfa0w++ZJKSxbGVTGnxl5WBMZq5uUrK6RdbxQfy1Zkz2iCoX5h/IKwGBhxyZ/DHaSXCRl0JAxHBEp89p7Y5XStNwJ5FUFaSOQpj8KnZHcc6xul0Q43uShN6ha1gA1ojcMqyITq5ba5WkF4XgxeI0i7rcWeTDRJeOMMeGAycBHU4K9HBygyZOrOtih+/paTmBZDB6tVwGtT2vJwCGVx3ES98Lo2HrUJNrG21Qxzbwj+j90n3LwfOGl+xAsD+ZCL4Vmhw2ApHjeg4g0TgKIzWp8wYjoySG0rce+X0AxaXby8iiF2bBtRUswThOllKVbNJaLjwoi+bWNiZNklY2i1lcqDq5C5+U0HW8GTNTT661ujFMxyVbQk8WbS8cSo/nG1J7v8xvN4ozUtkW7HzORamZHNPl+7dffp5//vjx4tPVZX/oLp3eQmzluUpW5a2wVLUSHsJNedJzhUySSTv8OUY6I5Q1tOnmN0x20SXHPfowavNMZzGccHZG33/4hu/wqpXWm3Vf+nBLA5O1tXOQ+3lAD8c0PSoLrgt8Gs+KljQfDkq+hDu962m3/uXJQ8KU7q/9n82vkbe2k+OEnDl8KwDfKhhRSrIN9nEWx/3geoz9I5iJC+MuphvmB4REoRfXSpdMp/SwWZFRgpd0bzqdPnOhOtczLjGhDcLTZtVtrjC4pZ2n9Gi63WzysuRy1sOQOYOSLkNeLGYamsuU7lVP3ccfuiVzURR7mQMdTcnJ8ZRwsac8yBfCqNQaXFTFZ0eGwcA3XDD9uXHjcWgcPDbq5p3fc89Y12CcmbNiEfa9x/vAb7MKpvqiGfywhPv7mIVqZkP44vITXpK9YK3KVgD9n+BXhjZgvpUMsFdoGXTv4bzct95DKP/KXKwsk2ZbVf8Qe3wWwTTOBnfVvpP7OH7S+3nzF7BPVrU=) | [Options API](https://play.vuejs.org/#eNp9Vftv0zAQ/ldOAamdaJPykJDCxoBp4v0Qm8QPBEEWO42pa0f2pSuq+r9zfiRry4Y2qfXdd9/d+e5zN8nLtk1XHU/y5NhWRrT4vFBi2WqD8EFY/CawudRYSqiNXsIozfas6W87KhRAofjaxzBel51E2DhrpYlIcYU2DwbY53Sm7STEA7ASy/FRDzQcO6P6E4BAviSa7/0ZYAPI15jD6CtnownYRl/ngKbjkfMA9dpwrgZcXUp7B/CV7PgBX4/6Eb74s4t1n0uOjWY3Hbq4l1L2nRRYYK0NjCutLPo2QNeAjbCp72nouO8ydQxw4lP3nlhBSFwo+j/OhnHRgcJaWSKnE8DxVYeoFbyopKgWJ0USSyoS7wa4cAlKMjhwFtAhUtJ4ptc0nym6AUX8QA+rKfVCjL4NocJUBl5PQBhRR4hvZcdNt7wJPbq7hu1wsbcUvXsVflrE80Ywvlewj8yk6AvN9i+CPIf97EGSSRJ2fbosW9plrUgHYWzRQc0Nky2SF3YhDEqekWKmK6UZn3YopAcVSYPY2jzLOtUu5iktf3YXPmNU16Ex5XY5vTL62nKTMr6ieoqkHzhVeig8KjUKdQMNbKNAiZQUOTgMZ13FzxohmeFqAhfv3375efb548fzT5cXQ9BddRLTP8quO1WhoEl50rNe4uOfE0pnpUYL27jTYeWrmJzm6N3Um2c6TUkjp6fw3atqB687hQTeL33c05AyuyWcPPcfD+DhBGYHbR31fPENacYjJlYk6fh4DOdfnjwkzOH+xn/Z/jqKr0Io5NThO0nwvoIjyEF1QT4/KBnNh8Zj8Y/kNq2sG0xc5gdAicJdXGnDuMnhYbsGq6VgcG82mz3zL0hp5kLRhrbknrXraFzT4jJscng0641tyZhQ8wFGmQuqJGYoq8XcUM0sh3v1U/fng27JXFXVTuZABzNw5XhKUrGn3MsX3NQpWhpULeYHgnGvvZDcfG7deuwLhx4bff3O29yzFi+YYhpeLYLda3xw/LbrIKovhpMeVqT+wYdUNcfgPr/4RC/JjnOpWScJ/R/nV07XQPutVYC9oiujundwvty3XkPU/qU9XyNXtu+qf5jjT1dConEyuKv3m3Ifp08GPW//Ar1lcn8=)

For the specific case of counting children, the dedicated [`countChildren()`](./other-helpers#counting-children) helper could be used instead.

While these examples need to display the count, a more common scenario involves only needing to know whether the count is 0. The [`isEmpty()`](./other-helpers#checking-for-an-empty-slot) helper can be used in that case.

It is worth noting that the count here is just a count of the VNodes. It is not necessarily an accurate count of the number of `<li>` elements. If any of the children had been a component it would have added 1 to the count, even though a component wouldn't necessarily render exactly one `<li>` element.

The iteration index and total node count aren't passed to the callback by default. It's relatively easy to implement that yourself:

```js
const children = slots.default?.() ?? []
const count = countChildren(children)
let index = -1

eachChild(children, (vnode) => {
  index++

  // ...
})
```

But if you'd like the index and length to be passed to the callback you can use the [`with-meta`](./with-meta) iterators instead.
