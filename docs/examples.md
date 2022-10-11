<script setup>
import AddClassExample from './examples/add-class-example.vue'
import BasicAccordionExample from './examples/basic-accordion-example.vue'
import WrapChildrenExample from './examples/wrap-children-example.vue'
import SeparatorsExample from './examples/separators-example.vue'
import EmptyListExample from './examples/empty-list-example.vue'
import AddSlotRefExample from './examples/add-slot-ref-example.vue'
import AddSlotRefsExample from './examples/add-slot-refs-example.vue'
</script>
# Examples

`vue-vnode-utils` are intended to manipulate VNodes in `render` functions, so the examples below are all using `render` functions instead of templates. `<script setup>` doesn't support `render` functions, but they can be written in various other ways:

```js
export default {
  render() {
    // Options API render function
  }
}
```

```js
export default {
  setup() {
    return () => {
      // Composition API render function
    }
  }
}
```

```js
export default () => {
  // Functional components are just a render function
}
```

The examples use functional components where possible.

Templates are used for components that don't use `vue-vnode-utils` directly, as those don't need to use `render` functions.

## Adding a class

Props can be added to child VNodes using `addProps`. For a `class` prop this will be additive, it won't remove any other classes that are already included.

In the example below, the `<add-outline>` component adds the class `child-outline` to each of its children. This class applies the border and spacing seen in the live demo.

<<< @/examples/add-outline.js

Usage:

<<< @/examples/add-class-example.vue

<style>
.child-outline {
  border: 1px solid #777;
  padding: 5px;
}

.child-outline + .child-outline {
  margin-top: 10px;
}
</style>

<live-example>
  <add-class-example />
</live-example>

## Adding component v-model

`addProps` can also be used to add the prop/event pair used for `v-model`. Here we'll use it to implement an accordion component.

:::tip
This functionality would be better implemented using `provide` and `inject`. [Example here](https://skirtles-code.github.io/vue-examples/components/accordion.html).
:::

The intended usage is something like this:

<<< @/examples/basic-accordion-example.vue

First we'll need a `<basic-accordion-panel>` component. It implements an `expanded` prop and `update:expanded` event, consistent with `v-model:expanded`:

<<< @/examples/basic-accordion-panel.vue

The `<basic-accordion>` might then be implemented something like this, using `addProps` to add the prop and event:

<<< @/examples/basic-accordion.vue

This implementation is very naive and is only intended to demonstrate the basic idea of how this component might be implemented using VNode manipulation.

All of which gives:

<live-example>
  <basic-accordion-example />
</live-example>

See it on the SFC Playground: [Composition API](https://sfc.vuejs.org/#eNqtVk2P2zYQ/StT5WAv1pLcrxRQ7d0kQHsOkOYUB4VMUhazlKiSlNeGof/eISnJkmxvEiB7WXE4772Z4QzpU/C2qqJ9zYIkWGmieGVAM1NXD5uSF5VUBt6lmpO3hEhFuSwhU7KAWRSPzZZidgPyPi2ZuIFzey14FfsAUBoXhhWVSA3DFcBqa1Fh2sGc8dIcVk7KcCPYehP8zZU2m6B1BnBr8D5EloaVpuWJrxJ9m8oHhlx0IOMNP1znn5yroYxbf6/KxR5aV/Gg1sEi8IcYFmkVfdGyxM44Weim3dCbIAFnsTY8OrveBLkxlU7iWGfEnucXHUm1i/ErUnVpeMEipotwq+SzZgqJN8Gi43ijn7jCJK13uC8lZWFtuHBCZ+K6rJ52EZFFfMs/plybqXEkS9l+LI3OMW7smQoVKylTTL2UzsT1IiVL22zKBqt4OR/nETsP1wnyBSiWQdMOyGiOTpBS+l7JSvf7t3JH0KZkBwejLEtrgXAbjpvm+b8LJNNCGmS6604PuwbnAUEppkP9mK5tNPOyFuLOMlo3hQyqhPkdrB86KIBgBgnwaBGy7Fw7TpJzQbFKuNdlMHfqeAIutscI6R4f4dPnxZS44+AY1AEJnMj9/Vmij2gAAYhj+Kh5uQOTsxbLNUg8LnEEjQUV2BycTCDbGu+7Oss4YRoyqRCNKHZI0Z8NfbsqJV1c6/W4ctE+FTVrG8v/zWT5saI4V0nnOUtg3n1Ps7Z/PBvuTzbPQQwEsUAuoLFrA0xoLAPSvRjuN2vYhphIDJeDRf/Z9A3UH1g+n1G+n9leJCLVGhKY9TfRDJpF3ziI7cnsQE1fB22OgoEmsmIULVHP4hPa4oKpBH6uDqCl4BReEUL+tFt4R+Bdd0wgE+zgLPYjpFwxYpAgwYYTdVG6rZzxXW4S+HW5rLzzM6cmT+CX37zBB2aD8Xfnjdftyuvqm7xyw722I8tL5gfFZXDut/aEzLFiCbyTUrDU1bXBXrP/3fvQuyn2X42pIM6ovh099oNROB9dRd3ptDdAwe0U+xj+woWef5rVk879PAAYudth+dfD0bUk8wvUAn5yKUZ9V185zPFTjx3iuwPfvMkTtgkg6bZOfYkwne5VHIFzlmITIOYNEZw8ocXHjd6nky8bNM0KX439EL4PeYa+HTviO8KtpEcEr+xNBvHDGdl9jV7Sl7q0fdpd4b6jIbFyV1ju4TpxkaodL0MjKzcIPd7XpR2UlDztFN6wNEQViSPzir3OXmeZC+SFMSK10ta9khx/eihn84IJhF4N8McJpdhyCfw+kLdVvCme/ZGRr4vbAiWQ1kaOdJdO+SxvL/9MyOfe1QfQ940LYsqFFeumfnkx4M3/uGvBFg==) | [Options API](https://sfc.vuejs.org/#eNqtVttu2zgQ/ZVZtYBTxJKyty6gdZK2D/tcoNunqg8KNbLY0KSWpBwbhv99h6Quli9pCtQIYnI4c+bCM0PvovdNk6xbjLJoYZjmjb3LJV81Slv4UBjO3jOmdMmVhEqrFcySdCp2xrMLJh8LieKCnT/rjHOJG29eYlW0wsIulwBMEaZEaU0WBHAEPz8n9LjuYJ9L+lukQ1a0sbhqRGGRdgCLB2cYF72lF56K48ZnYbkVeJtH/3BtbB51ygB+D0GHKWkp3g4nPQv0Mi+fkLDKAzdB8NP9/FtzfejG73/Uy8kZSRfpQa2jeRT4Ea+KJvlmlCS6+SvNuwOTR8Ml5xGxwu3zqLa2MVmamoo5qnwzidLLlFaJbqXlK0zQrOIHrZ4MagLOo44TefTOPHJNSTrteC1ViXFrufCORuBWNo/LhJiWXtJPS27ssXDitsT11DUpp3SwRh1rlCVq1M+lc6R6klJPZqriaeud69sd1HPQWMG+671Ji+6gKMuPWjVmOL+U+8XWLAtbXL3pL0yjbbXsdwBkUVAupW/FDGQrfEP6LOgf1cl9h3xHFIGWKEfXCrdwE1TcDJDUXazmoiR9Ouljv7I1N8lrI5Q1dAM+tvuE0O7v4cvXOdDq9m4MKeBw8rghEO/m+rp3cpoBQJrCZ8PlEmyNnR03oOiixBYMlVIQLTibGDy0FkxbVZyhgUppsiUb3BSkjaNmX56sj+f21msmk7p1bHKfmZKfGyo5Zr3GLIOrfj1N1H14dXg6OYIznqggPpBDvT2gMJQ4IT0X5MvQRwJ04ONmWHaL/Zv+Urorqa9mJV/P5kRbJgpjIIPZMGdmRKaBHGR5fugbuxUIhqkGS5Ikg3kI/oE2qDP4tdmAUYKX8Iox9renOTc0wrYZVAI3XuIWcck1MksAGTFJtCvpj2rky9pm8PvNTROUn3hp6wx++yMIQmAumDASL7yHk44+13y44u5J/DJrj0jxteusxjXIME5Hug13ZbcNZvBBKYFFV+6+K+nQPQ0Hyhr/aylhsre6xYGWAeOT1dQkZ7p7hbZW5RiFVculwLHbO6q8dslcnWQyh18mTPJ323v47rtOhAlkoQfu6L3KI8j6o91QGsLsn8CJcY0FUYNs3jHB2SNJQhqkvduFQsF+v6AnYn1ovo55Rbo9Otn3gA+q3JLxwo0tSO9Gy341eTaf4273jodp/HKaUuXOoFzDeeBVoZdcxlY1vj0G+1CXrn0K9rjUNFDLmLwoaqRX+LZ6W1U+kGeai7XaOPVGcfqdob0sOMwgDt6IyjTviWAZ/Hng3lXxovPqr4p937krUAZFa9XE7433PLp3874S6mlQDQEMvPFBHGNRxfpZcHPS9vv/Ae6z2QY=)

## Wrap children

We can use the `replaceChildren` helper to wrap each child node in an extra `<div>`:

<<< @/examples/wrapping-list.vue

This might then be used something like this:

<<< @/examples/wrap-children-example.vue

<live-example>
  <wrap-children-example />
</live-example>

## Inserting between children

The `betweenChildren` helper can be used to insert separators between children. For example:

<<< @/examples/insert-separators.js

With usage:

<<< @/examples/separators-example.vue

<style>
.hr-example hr {
  border-top-color: #777;
  border-top-width: 2px;
}
</style>

<live-example class="hr-example">
  <separators-example />
</live-example>

## Checking for empty content

The `isEmpty` helper can help to check whether the child VNodes are empty. Fragment nodes aren't counted as content, neither are comments nor strings of collapsible whitespace.

<<< @/examples/results-list.js

Example usage, with an empty list followed by a non-empty list:

<<< @/examples/empty-list-example.vue

<live-example>
  <empty-list-example />
</live-example>

See it on the SFC Playground: [Composition API](https://sfc.vuejs.org/#eNqdU01v2zAM/SuEe3ACxNZ2zdxkO+w27LBrXQyJRCdqZEnQh5ci8H8fZbtp0iLD0JOkR/JRfCRP2Tdryy5itswqz520ATyGaFe1lq01LsAv9FEF/0P6AI0zLeQlu8DKJ5/XumJjMIXRI2Br1SYgvQAq63D18FixdA6AG6MLReEDQpiS0BWNcfd1NppBanh4rLPV6QQT0vcVU3LkYO9Ixjy5Q5EvIN85RJ0uWxUx/1j2G1z//aeKXQhBTx+eFYLnxqIghH4EpxS43fDDzpmoxRLuEPHLABon0C3hsz2CN0oKuOOcDya7EULqHdk+2SMh/aB/IifWbJGNjSvajaXmGE2tHdLUk8HX2XJMnDDqfXrX2T4E65eM+YangXjypXE7RrfSRR1kiyX6ttg688ejI+I6W7xwfPUH6YLC5F102ggsYpBqSPRKHLU97EpuWnbLnwkS7i14lVZgd52anBkZOnSFQ02KoftXOW9c35WUaEnOnlS8nnEScdqHE+yhnzaBiGn4zwbpv7c2PJ/Nt+qkmFrjcYgS2GzSIDVR8yCNvty32e8FsXplgod+PvaMG02LyPdSCaoC7kczCTPQrMvZHNbrtDmUAkA2MJt+NXuJmU9MQDMcotOwn+VCdmnAf5pprn0+n6RIx6tfVOR2JhpGL+v/AratesI=) | [Options API](https://sfc.vuejs.org/#eNqdU8GO2jAQ/ZWR9xCQSNxeaRbaQ29VD71uVhXEE/Di2JbtpKxQ/r3jJGRhEVW1p8Rvxm/s5/dO7Ju1WdsgW7Lcl07asCq0rK1xAX6hb1TwP6QPUDlTQ5LxCyx78UmhAQqNx75fYLWhIpwiWhoi0aiDXw4AXPJFoCt0F3fnfBpMi4C1VZuAtALIrcPV03PO47cH3MCRKiLpEcKUhDatjHss2FAGqeHpuWCr0wlGpOtyruTAwW9IhjmJQ5EsINk5RB1/tqrB5GPT73D995lyfiEELX14VQi+NBYFIXSiQdXtpjzsnGm0WMIDIn7pQeMEuiV8tkfwRkkBD2VZ9iW7EULqHdU+2SMh9AikfyQnVrZgw9On9cbS8xpNtujHFGPBF2x6zoKRb+K6YPsQrF9y7qsymunFZ8btOP1lrtFB1pihr9OtM388OiIu2OLM8dUfpAsKY3faaiMwbYJU/aA34kbbwy4jT/F7/VyQcO/Bq7EC2+vR1Myp0KJLHWpSDN2/rvOu9eZKZ0+TitcpIRHHRJ1gD92YJSKm+EwF6b/XNrxO5Xv3pD03gasaXQZp9GXCZr8XxOqVCR66+TmTmqJc7qUSdAt4HMokTE+zzmZzWK9jcmgEgKxgNp5qdt4zH5mAPBwap2E/S4Rso8F/mtHXPpmPUsTPW1+jqG0i6q3Hur9YTo+S)

## Adding a `ref` to a slot

Adding a 'template ref' to slot content can be a bit tricky. A common trick is to add the `ref` attribute to a surrounding element and then walk the DOM tree to access the relevant element. But that only works if there is a surrounding element in the relevant component, and it also only allows access to elements, not components.

There are a number of ways we might attempt to implement something like this with `vue-vnode-utils`.

Let's assume our component only allows a single child inside the slot, a bit like a `<Transition>` component. Let's further assume that we want to skip fragment nodes, comments and empty text nodes. We could use `extractSingleChild()`, which will pull out a single element or component node, with a console warning if multiple nodes are found.

<<< @/examples/add-ref.js

The example is using `outerHTML` during rendering, which is only there so we can see the contents of the `ref`. Something like that should not appear in real code.

Usage might look something like this:

<<< @/examples/add-slot-ref-example.vue

This example is a bit silly, because in practice you're very unlikely to use a `v-for` in a scenario where only one node can be rendered. But it shows how `extractSingleChild()` successfully negotiates the `v-for` fragments and `v-if` comment nodes.

One quirk of this example is the position of the `key`. There's no benefit in having a `key` on the nodes we discard, as they'll never make it to the patching process anyway. Instead, we need the `key` to be placed on the `<div>` VNode that we keep. This will ensure that the `<div>` DOM nodes are not reused for different items, updating the `ref` on each rendering update.

In a real use case we'd probably be fine with reusing the same `<div>`, so the `key` could be omitted.

<style>
.button-example button {
  background-color: #ccc;
  border: 1px solid #777;
  border-radius: 3px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);
  color: #000;
  padding: 2px 5px;
}
</style>

<live-example class="button-example">
  <add-slot-ref-example />
</live-example>

Another way we might approach this is using `addProp()`. This could be used to add a `ref` to a single node, like in the previous example, or it could handle the more general case with multiple top-level nodes:

<<< @/examples/add-multiple-refs.js

As with the previous example, this example contains a circularity because it is rendering the `outerHTML` of the `ref` elements, but that's just for demo purposes and in real code you would do whatever you need to do with the elements/components, not just dump out their `outerHTML`.

Usage might be something like this:

<<< @/examples/add-slot-refs-example.vue

All of which gives:

<live-example class="button-example">
  <add-slot-refs-example />
</live-example>

See it on the SFC Playground: [Composition API](https://sfc.vuejs.org/#eNp9VVtv0zAU/itHAampaJIixEvoOhAvIDEJId6WiWXJaePNsS3bzTqV8Ns5di5Lu0uf7HM+f9+5pofgi1Jxs8MgDVam0ExZMGh3ap0JViupLRxA4wZa2GhZw4ygs9H1pSwvdtwyxfEXbkwPiZMTe3xr6E0mCimMhULuhIUzxxp+mGdilXS6pEgXi7XiuUW6AaxudtZKAZ8Lzoq7syzwb9+9y4I1SaySzu2hf1/Gk9ZFbqu4zvdhZ4jg/QKWc6L5hbVs8IhplZdlVPfhRxSl8WZyDLFBE22kJnoBTHT5EFUHIljJmvV3wsLhAALadpU4S8+RHCeYPCc2AQWLoKt1VOeK6igFNergnma9w2RBCt7ibNQed8+Cylpl0iQxm8K199bEUm8TOsWawmU1xmjq6EbLe4OaiLNgMXB8NndMW44OHTVClhjtLONe6JF4J9TdNi5knbyEp7SNPTUeyZbYHEsTOCFHg5pqIUrUqF9L5wT6JCVH22aipSo+HUkq5Djh1YLGMS8sa/D5ST8ANeqnlsqM/pfS9qOOe/+sxE1Oql1//F6FfxZEZri0xDQfGpck8LtiBnKt8we4Z5xDJXkJtkKwUkUcG+SAHGsU1iRUdSWFO47P+xqUcPPgXzmFztlvXcV46ZfUbV6Xanh5RfvXoTj2mK9+nHurppC1gHAOZ+shVmIccUS2HLBHShQO+YaahT5farevxnlMfOfncHm1OGUeOGgRvlM+e+J4FKO9H6XG0CZPnW2TQshoe05p3Y9tBt+Jo8/IVedyUL4iaQc+RrbUA4OeaXwScxRbW8F6EuprEgN+mtqJyvQ6uYzHdmzbWIfLSQn7BvRb5X5VOFMaZ4spDOBa7izqb78vfqRZJq4n+Gm49OEJj+MLkS+A+RJfvz2wNoW3B+TxyNZeT/Hz+FYyEc5IYkZxD2Y3ev2pO/js3LZmgvbV2AeOJi6M21OKvSvoTV7cbTVVrEzhDSJ+8kapafRTeK/2YCRnJbwpisK7FE0gE9sUPqo9GYg6E/1/xD+gr3LP+pRguVx6gjrXWyYi2kFyLz2JM+6je1baimwfB+OpVND+BzRxXJ0=) | [Options API](https://sfc.vuejs.org/#eNqFVdtO4zAQ/ZVRQGoRTVK04iVbuqB9WaRFWiHeCBIhmTYGx45stxSV7Lfv2Lk0aYFFPNhnZs7cfNKtd1WWwXqFXuTNdKpYaeaxYEUplYGrLLtZccNKjre40LBQsoBREO7hwbMexQIgFrhxcRkuErLD1qKpJDKBwuioBmCf14LVpGYAyBKTjE9aV4VmpUR7s2wrYSL4Vt8rFxoL+p+FXfV0MViUPDFIN4DZ08oYKeAy5Sx9uYg9R3J6GntzqmQW1mbn+v65P1zATWLyoEg24xrw4WwC0xOiucVCrnHANEuyzC+aLn1FbTqYDG1tsPYXUhG9ACbqxoiqbXSWsfX8mnxhuwUBVTULLdJwhMMGw4+S9Zy8iVev1C+SktYlBa3bzTRuDDr2uvXEHr0He4+93JhSR2GoF6l9JM86kGoZ0ilQVC4rMEBd+E9KvmpURBx7bo+W41K/MGU4Wm9/LWSG/sow7hLtiFeifFkG9EbCz/ypbW32wUHaDNfD1OQckmGNimYhMlSovmpnz/WgpfaR0RQPXz4NslHLFnKoGo0QOUmiM9B6/ihZ6s7+WbMU9LGKvlZFGMJdzjQkSiVv8Mo4h1zyDEyOYGTpc1wjB+RYWB2GO0n2CJr2M3h6c3GaS9OpLmc8sw1HcP/QjLlBf9aCnPYF2Wm55tzVzdH0okhRFFZbUil0Y6MgsrQjGxtqLDi21WjatBvJj4Ao399tLUCni3n/+2B5SAHXlHlDPLt0JPgm2eEALbKIYMxIMkNC+8cWrWUAA82JauuGc9+mfaC81r/vXNH4NTqqYVTAUSxNDvMem6v3P9nauIv9uEHW3aU7NofqpB3HXvxgaI2k+q/ufrB/2lb3IPLxqFQ4muxcAB7lyqD6dXfzO4pj8dj5HrRDX6Zxv/Qx8gkwt4zH4y2rIjjeIg86uupx530SPEsmxiPKMKK2avChOT309KvNG0fKqq1uqdZ6xE9J+rJU1G4WwREifnegVPR2IzgrN6AlZxkcpWnqTCU9TiaWEZyXGwKIOxbNb8ZfoK90w3pIMJ1OHUGRqCUTPkmTzFNHYsGN/8oykxN23oL7qbzqHxvhfis=)
