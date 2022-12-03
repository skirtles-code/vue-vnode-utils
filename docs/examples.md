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

See it on the SFC Playground: [Composition API](https://sfc.vuejs.org/#eNqtVt2O2jgUfpWzmQsYDUnov5SFmbbS7nWlbq9KtQrOCbhj4qztMCDEu++xnYQkwLSVyg328fm+82/nEHwoy2hbYZAEM80ULw1oNFV5vyj4ppTKwMdUc/aBMakyLgvIldzAKIr7YksxugL5lBYoruDcWQ2exd4BMk0bg5tSpAZpBzBbWlSYNjAnPBeHpTNluBE4XwR/c6XNIqiVAdwevA6ThcHC1DzxRaKfs/IZiSvrmPGC327nnzVXXTNu/6tWzs5IOos7uQ4mgS9iuEnL6LuWBXXGwUIX9YFeBAk4iZVR6ex+EayNKXUSxzpntp7fdSTVKqZVpKrC8A1GqDfhUsknjYqIF8Gk4XivH7miIK12uC1khmFluHCGTsRVUT6uIiY38TX9OOPaDIU9sxlu+6ZJOaaDLapQYZGhQvVcOAPVs5As7XFRHCmL5/NxGrHTcB1gPQGFORzrAenN0QHSLPukZKnb82uxE2hR4M7BMszTShDcuuOmefzvhMi0kIaYbpvqUdfQPBAopXAyP6Zz6824qIS4tYxWTRGDKmB8C/P7Bgog0BABlZYg00a14WRrLjLKEp01EYyddaqA8+0hIrqHB/j6bTIkbjg4ObUjAmfk7u5kovWoAwGIY/iiebECs8YayzVIKpfYg6aECmoOzgaQZUX3XZXnnKGGXCpCEwp3KeljV7fJUtL4NZ/3MxdtU1Fh3Vj+N5LFlzKjuUoazVEC42Y9jNr+eN49HxyenOgYpAQ5h/qqR0ChKQ1E96y7P23DNsTARHfb2bTLY9tAbcHW41HGtyPbi0ykWkMCo/YmGsFx0jYOYVsyO1DD10GbvUDQTJaYkSRqWXxAy5Q9rhQ1DtXrBhH/dELSQJXAi3IHWgqewQ1jzB0xKSSd3Lx88erN63dORHcJ3Yn7BHKBOyexizDjCpkhQ4kFVZvCHa2Rr9YmgVfTaemVn3hm1gm8fO0FPgDrtL9jr7yCF15hPwyluwTmdrR5gX6gXKSnvqwrafYlJvBRSoGpy/+RetL+u3ekVVP4X0WhEM6otm099rNRNEdN5l0V65tiw+20ex/+oo0efx1Vgw7/1gEYuVpRmebdEbck4zPUBP5wIUZt918oev+TgDrJdxG9jYOnbhFA0hwd2hRROM3r2QOvMaW+IMx7Jjh7JIn3m7QPB582OB5n9Lpsu/BtyHPSbdgJ3xAuZbYn8MzeeBDfn5DNqvfiPtfN9SeAS9wvNCRl7gLLHVwm3qRqxYvQyNLNRov3eRkOVNjMCr7N3+b5DyerUtqql5LTJ4pyMm8wgdBbA/qIyTJquQTedMzbLF41nr/L2Y+N2wQlkFZG9uxOneWTeftI5EI+taregbZvnBNDLspYM/XTswE//g/f980+) | [Options API](https://sfc.vuejs.org/#eNqtVktv2zgQ/iuzSgGniCWlb0DrJG0Pey7Q7anqQaFGFhua1JKUk8Dwf98hqYflR5IF1ghict4z/GbGm+hL0yTrFqMsWhimeWOvc8lXjdIWvhaGsy+MKV1yJaHSagWzJJ2SnfLshMq3QqI4oed5nXIu8cGrl1gVrbCwySUAU2RTorQmCwTYMz8/RvR2HWObS/pbpENWdLG4akRhkW4Ai1unGBe9picekuPGZ2G5FXiVR39xbWwedcIA/g5BhilpKd7OTnrU0Mu8fEeyVe64CYT/3c/fNde7bvz9v3o54BF1ke7UOppHAR/xqmiS30ZJgpt/0rxjmDwaHjmPCBXunke1tY3J0tRUzEHlt0mUXqZ0SnQrLV9hgmYV32p1b1CT4TzqMJFHn80d15Skk47XUpUYt5YL72g03MrmbpkQ0tJT8mnJjd0nTtyWuJ66JuGUGGvUsUZZokb9VDp7ogcp9WCmKh623rG+3UA9B40VbLvem7ToBoqy/KZVYwb+qdxPtmZZ2OL8df9gGm2rZX8DII2Ccil9K2YgW+Eb0mdB/6hO7jvkO1oRaAly9KxwBZdBxM0ASd3Fai5KkidOH/u5rblJXhmhrKEX8LHdJGTt5gZ+/poDna6ux5CCHU4eH8iId3Nx0Ts5zAAgTeGH4XIJtsZOjxtQ9FDiEQyVUhAsOJso3LYWTFtVnKGBSmnSJR18KEgaR8m+PFkfz9WVl0wmdevQ5D4zJX80VHLMeolZBuf9eZqo+/BqlzthwRFPVBAfyK7cFlAYSpwsPRXky6yPAOiMj5fh2B22r/tH6Z6kPp+VfD2bE2yZKIyBDGbDnJkRmAZwkObxoW/so0AwTDVYEiUZ1EPwtwW7W2pCBD3IGSL+6YkkgTqDN80DGCV4CWeMMc9iSijinL198+7D+0+eRCOCRt1jBpXAB09xh7jkGpklR5lTalfSs2rky9pm8O7ysgnC97y0dQZv3wdCSMAFHUbnib056fxjTYor7lbnz1m7B55fXQc2rpGGsTvCcnhT+9hgBl+VElh0z9J3LzHdCtkR1vhPSwmTvtUtDvANNr5bTc10ZAqs0NaqHKOwarkUOE6FDlKvXDLnB5nM4Y8J4jwGeg/P7n8CVgAVLcK9vZZHkPWszVAastmvyolyjQWhhXQ+M8HZHVFCGiS92YRCwXa7oFWy3lVfx7wi2d466fcGb1X5SMoLN94gvR41+9NkvT6F8W7fh6n9cphS5Y5YuYDjhleFXnIZW9X4jhn0Q1322yzuOwg/Vh+r6tl+a7Vx4o3i9HtEe1pwmEEcvBGUaS8QwDL4sOPeVfGk8+pTxZ537gqUQdFaNfF76T2P7t1eqIS6H0RDAANufBD7tqhi/Sy4PGj77b+5WuUu)

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

Another way we might approach this is using `addProps()`. This could be used to add a `ref` to a single node, like in the previous example, or it could handle the more general case with multiple top-level nodes:

<<< @/examples/add-multiple-refs.js

As with the previous example, this example contains a circularity because it is rendering the `outerHTML` of the `ref` elements, but that's just for demo purposes and in real code you would do whatever you need to do with the elements/components, not just dump out their `outerHTML`.

Usage might be something like this:

<<< @/examples/add-slot-refs-example.vue

All of which gives:

<live-example class="button-example">
  <client-only>
    <add-slot-refs-example />
  </client-only>
</live-example>

See it on the SFC Playground: [Composition API](https://sfc.vuejs.org/#eNp9VVtv0zAU/itHAampaJIixEvoOhAvIDEJId6WiWXJaePNsS3bzTqV8Ns5di5Lu0uf7HM+f9+5pofgi1Jxs8MgDVam0ExZMGh3ap0JViupLRxA4wZa2GhZw4ygs9H1pSwvdtwyxfEXbkwPiZMTe3xr6E0mCimMhULuhIUzxxp+mGdilXS6pEgXi7XiuUW6AaxudtZKAZ8Lzoq7syzwb9+9y4I1SaySzu2hf1/Gk9ZFbqu4zvdhZ4jg/QKWc6L5hbVs8IhplZdlVPfhRxSl8WZyDLFBE22kJnoBTHT5EFUHIljJmvV3wsLhAALadpU4S8+RHCeYPCc2AQWLoKt1VOeK6igFNergnma9w2RBCt7ibNQed8+Cylpl0iQxm8K199bEUm8TOsWawmU1xmjq6EbLe4OaiLNgMXB8NndMW44OHTVClhjtLONe6JF4J9TdNi5knbyEp7SNPTUeyZbYHEsTOCFHg5pqIUrUqF9L5wT6JCVH22aipSo+HUkq5Djh1YLGMS8sa/D5ST8ANeqnlsqM/pfS9qOOe/+sxE1Oql1//F6FfxZEZri0xDQfGpck8LtiBnKt8we4Z5xDJXkJtkKwUkUcG+SAHGsU1iRUdSWFO47P+xqUcPPgXzmFztlvXcV46ZfUbV6Xanh5RfvXoTj2mK9+nHurppC1gHAOZ+shVmIccUS2HLBHShQO+YaahT5farevxnlMfOfncHm1OGUeOGgRvlM+e+J4FKO9H6XG0CZPnW2TQshoe05p3Y9tBt+Jo8/IVedyUL4iaQc+RrbUA4OeaXwScxRbW8F6EuprEgN+mtqJyvQ6uYzHdmzbWIfLSQn7BvRb5X5VOFMaZ4spDOBa7izqb78vfqRZJq4n+Gm49OEJj+MLkS+A+RJfvz2wNoW3B+TxyNZeT/Hz+FYyEc5IYkZxD2Y3ev2pO/js3LZmgvbV2AeOJi6M21OKvSvoTV7cbTVVrEzhDSJ+8kapafRTeK/2YCRnJbwpisK7FE0gE9sUPqo9GYg6E/1/xD+gr3LP+pRguVx6gjrXWyYi2kFyLz2JM+6je1baimwfB+OpVND+BzRxXJ0=) | [Options API](https://sfc.vuejs.org/#eNqFVdtO4zAQ/ZVRQGoRTVK04iVbuqB9WaRFWiHeCBIhmTYGx45stxSV7Lfv2Lk0aYFFPNhnZs7cfNKtd1WWwXqFXuTNdKpYaeaxYEUplYGrLLtZccNKjre40LBQsoBREO7hwbMexQIgFrhxcRkuErLD1qKpJDKBwuioBmCf14LVpGYAyBKTjE9aV4VmpUR7s2wrYSL4Vt8rFxoL+p+FXfV0MViUPDFIN4DZ08oYKeAy5Sx9uYg9R3J6GntzqmQW1mbn+v65P1zATWLyoEg24xrw4WwC0xOiucVCrnHANEuyzC+aLn1FbTqYDG1tsPYXUhG9ACbqxoiqbXSWsfX8mnxhuwUBVTULLdJwhMMGw4+S9Zy8iVev1C+SktYlBa3bzTRuDDr2uvXEHr0He4+93JhSR2GoF6l9JM86kGoZ0ilQVC4rMEBd+E9KvmpURBx7bo+W41K/MGU4Wm9/LWSG/sow7hLtiFeifFkG9EbCz/ypbW32wUHaDNfD1OQckmGNimYhMlSovmpnz/WgpfaR0RQPXz4NslHLFnKoGo0QOUmiM9B6/ihZ6s7+WbMU9LGKvlZFGMJdzjQkSiVv8Mo4h1zyDEyOYGTpc1wjB+RYWB2GO0n2CJr2M3h6c3GaS9OpLmc8sw1HcP/QjLlBf9aCnPYF2Wm55tzVzdH0okhRFFZbUil0Y6MgsrQjGxtqLDi21WjatBvJj4Ao399tLUCni3n/+2B5SAHXlHlDPLt0JPgm2eEALbKIYMxIMkNC+8cWrWUAA82JauuGc9+mfaC81r/vXNH4NTqqYVTAUSxNDvMem6v3P9nauIv9uEHW3aU7NofqpB3HXvxgaI2k+q/ufrB/2lb3IPLxqFQ4muxcAB7lyqD6dXfzO4pj8dj5HrRDX6Zxv/Qx8gkwt4zH4y2rIjjeIg86uupx530SPEsmxiPKMKK2avChOT309KvNG0fKqq1uqdZ6xE9J+rJU1G4WwREifnegVPR2IzgrN6AlZxkcpWnqTCU9TiaWEZyXGwKIOxbNb8ZfoK90w3pIMJ1OHUGRqCUTPkmTzFNHYsGN/8oykxN23oL7qbzqHxvhfis=)
