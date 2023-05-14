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

See it on the SFC Playground: [Composition API](https://play.vuejs.org/#eNqtVtuO2zYQ/ZWp9sFerCVt7oBq7yYB2ucAaZ6ioJBJymKXJlWS8tow9O8dkpYsy3YuQPdlxZk5c4bDM6T30Ye6TjYNi7JobojmtQXDbFM/5JKva6UtfCwMJx8IUZpyJaHUag2TJD01uxSTK5BPhWTiCs77DuB5GgpAalxYtq5FYRmuAOZLh4qLDuaN5+a49lSWW8EWefQn18bm0SEYwK8hxBAlLZP2kCe9mOjnWD4zzEUHNMHwv/P8VXE9pPHrX2U586F1ng56Hc2icIjxuqiTf4ySqIy9g+YHh8mjDLzF2d6bJ66xwBTPMN5IRVncWC58UB5V1tYmS9NG1k+rhKh1ei0+pdzYsTFhZh0vtXo2TCeUbbCePHLMbS5brPRcg0cZHwW8h2oGmpXQHkR4otU9FJR+0qo2vf9ajQjKJdt6GGVl0QiEu3L8xEz/nmEyI5TFTLddh/BkUHMIKiRlNIzCwlUzlY0Qty6jC9OYQUuY3sLioYMCCGYxQSMtQu670C4nqbigmkn0dTuYenbslK/tMcF0j4/w9dtsnLjLwbGoLSbwJHd3R4q+ogEEIE3hi+FyBbZiByw3oDZMix0YbKjAQ+RkBFk2eKc0ZckJM1AqjWhEsW2B8WwY23Up6+paLE47l2wK0bDZEDNR8ktNUbtZFznJYNp9j3ft/ng59I+cxyIGhNggX9BpaAtMGGwDpvtuuT/N4QQxohguB4v+s+0F1B9YNZ1Qvpk4LRJRGAMZTPppn0A764WD2D6ZG6jxDWzsTjAwRNWMoiXps4QNLQvytNIoHDyvG8bY796IEUxn8KLeglGCU7ghhHgXUUKh5+bli1dvXr/zJpx5vHd2GZSCbb3FfcSUa0YsEmUO1Kyld1WMryqbwav7+zoEP3Nqqwxevg6GsAFXdLjHrrw0F166MAy1vwQWbrS5ZGGg/E6PujycpN3VLIOPSglW+P63qEn339/VfZhm/za4FcRZ3cs2YD9bjXPUdd6f4uGmWHM37aGGP3Bhpl8nzUjh3wYAq1YrPKbFcMRdkukZaga/+S0mvfovHPrps4tKCirC92f0nOQRZJ1r37cIt9O9UCfgihWoC8S8J4KTJ7SEujF6vw9tg7ad4yuwGcI3MS8xtsuO+C7hUtEdgufuxoP04Yjsvk5ete+p+fDM+sb9giCxcxey3MHlxOtCr7iMrar9bPT40JfxQMXdrLC35duy/OFkNdq48Fpx/BmgvS0QZhAHNsAfCpSi5DJ4M6B3XbxKXr4ryY/JXYMyKBqrTnjvPfOR3j0SpVDPfWgooNeNL2KcCzvWTf392YC3/wFNZJa7) | [Options API](https://play.vuejs.org/#eNqtVduO2zgM/RWup0BSTBynd8CbzLR92OcC3T7VfXBsOtaOInklOZMgyL+Xliw7zqUzBRoEiUTykBR1SO2DT1U13dQYxMFcZ4pV5i4RbF1JZeBzqln2KcukypkUUCi5htE0Goob8OgK5EsqkF/BWV0LTgRuLTzHIq25gX0iADJJPgUKo2MngBP3k0tC67dRHBJB33nUnYo2BtcVTw3SDmC+bIBh6pFWeC4OK3sKwwzHRRL8w5Q2SdAaA9g9OJtMCkP5tn6ii46eF+Urkq/8KIwT/PE4/5ZMHYex+9+NcqYj6Tw6qnUwCRw/wnVaTf/TUhDd7JUmrUInQXfJSfBRPzBFCUZEj3AjZI5hbRi3RklQGlPpOIpqUT2spsSS6Jp9lDNtToVT1OtwqeSjRjXNcUP5JIEnDGV6Tu9LvbGHcgIKCzi0/B60wR7SPP+iZKU7/bUcr9I/T006fumLotDUSvgdACFSkWNu6R6DqLklvT0F/VBrNP8KyUb1XjgautZaGFjAzJk0fSaIwVnJeE72pPG5j03J9PSF5tJoqpTN7X5K3u7v4fuPCdBqcden5PwwirglJzbM7a0Pcn4CgCiCb5qJFZgSWxzTIDeo+A40lZLT9bFsAFjWBnRdFCxDDYVUhCUMblOyxt7Slyf2+SwW1nI6qFs7QJrPSIpvFZUcY28ximHs18ODNh9WHGsHKrgQiQpiEzm2OwByTQcnT79K8nneewK0zvtNt2wXh5f+UtorKcejnG1GE6JtxlOtIYZR18sjIlNHDkJeHqza7DiCzmSFOUmmHdwlv0yzh5UiRtCF3CDi31ZIFqhieFVtQUvOcrjJssyqMsklaW5ev3rz7u0HK6JWpnGyi6HguLWSZhHmTGFmKFDcgOq1sKoS2ao0MbyZzSpn/MhyU8bw+q0TuAM0SbvxdOVtGnT+pSbFNWuep++j+oQ8P9oOrJpG6kZbT8vuTs2uwhg+S8kxba/Fdy8pmzF9ZKzw/5oOTHijauzo63x8NYqa6cIUWKMpZd5nYeRqxbGfCi2lXjSHGZ+dZAJ/DRhnOeAjPPnGErEcqeixOXk7kgBir9p3pSGf/jkagEtMiS2E+Zhxlj2QxB2DrPd7Vyg4HOY08jfH8E3ICrL13gnvHS5lviPwvBlvEN31SL8aPGG/4nj7prqp/XyaUuUueLmFy47XqVoxERpZ2Y7p8K4up20W+g7C98X7oniy32qlG/NKMnrzlZW5gDGELhpRmd4FIlgM747CN1W8Grz4UGRPB28KFENaGzmIO7OR+/DNu1Bw+diZugQ63tgkTn1RxfwsmJ21/eEn39+uqw==)

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

See it on the SFC Playground: [Composition API](https://play.vuejs.org/#eNqdUsGOmzAQ/ZWR9wCRAm6vlE3aQ29VD70uq4rgIXFjbMs2NCvEv3cwNE1bRVrtCfzG783zzBvZJ2vzoUdWsNI3TtoAHkNvd5WWnTUuwDf0vQr+i/QBWmc6SHJ+g+U/fFLpki9kotEhYGdVHZBOAKV1uHt6Lvn8jYBb2JkiekQIUxKGrDXusWJLGaSGp+eK7cYRVmSaSq7kosH/E1n6JA5FsoXk6BD1/HNQPSZv635H69WeSn4zCDr68KIQfGMsCkLIEYwz8VA356MzvRYFPCDihwgaJ9AV8N5ewBslBTw0TRNLthZC6iPV3tkLIVOc/yxOqmzLlsVlXW1pOUbTamObai34ihVL4xn76M/SBYWcQpAN2gjM+iBVvFSxUwjWF5z32p6PeWM6fu8+F/Tof8EcfZcdnPnp0eUCB/JTsbkzWZ7I6d85IqNr5kY4wbSmjSQpYNeC9J87G16u5Xt+iFNpvESWwLael9X2ugnS6NtMp9+3pOqVCR6mzTKXxmgKe3OSSjjU8LiU6QFRZp+nG9jv53RSCwDZQrq6Sn9zNqsSUE5C7zSc0kTIYQ7RV7NmxyebdRTz58+9XtG1q1BcL5t+Ad88RD8=) | [Options API](https://play.vuejs.org/#eNqdU01v2zAM/SuEenACxNZ2zdxkO+w27LBrVQyORSdaZEmQZC+F4f8++iNetiJA0ZOs98hHinzu2BfnsrZBtmV5KL1ycSeMqp31EX5gaHQM31SIUHlbQ5LxGyz7FRJhAITByxgvsSqIhG5AS0siBk0M2wmAW70B6IXph+ycL4XpErF2uohIN4Dcedw9Ped8OEfATxqpJpERIUwraNPK+kfBJhqUgadnwXZdBzPS9znXatLgr0SmOolHmWwgOXpEM3wcdIPJ+6rf0XpzTzm/GQRdQ3zRCKG0DiUh1NE01UNRno/eNkZu4QERP42g9RL9Fj66CwSrlYSHsixHyhVSKnMk7oO7EEJLoPkP4qTKNmxafVoXjtZrDdliLCNmIgi2rFOwz+GsfNTIyUBpa6zEtIlKj0GCnWJ0Yct5Y9z5mJEf+L14LunR/4MZhjo9ePs7oM8kttSPYFffUKf/OpEanV3bwQn62a8kSRZdCBW+1i6+LPS9fijnlamrxpRRWXPr4tXPDakGbWOAfn31vaHfpTwpLT0aeJxoesAos89Wa9jvB3dSCQBVwWruanXNWc9KQD6JjTdwWiVStYOJvtvZOyFZz6MYjr9xjaawRWhcL+v/ANFaWQ8=)

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

See it on the SFC Playground: [Composition API](https://play.vuejs.org/#eNp9VF1P2zAU/StXGVJT0SRFEy9ZKaC9DGlIE+KNoJEmt42pY1u2W4q67LfvxvkgLbA+xfcen3Puh7v3rpUKtxv0Ym9mMs2UBYN2o+aJYKWS2sIeNC6hgqWWJYwIOupT13l+u+GWKY53uDQtJIyO4uGzoTuJyKQwFjK5ERYualb/6zgRs6jRJUU6WCwVTy3SCWC22FgrBVxlnGXri8Rzd09PE29OErOoSTvon8/xpHWb2iIs053fBAI4m8B0TDR3WMotHjDN0jwPytZ+QC6NC1Oi8wbbYCk10QtgoqmHqBoQwXK2nd8QFvZ7EFBVs6iOtBzRYYHRR2IDkDfxml4HZaqoj1LQoPb11aRNmMSLwUXq2JVZM205RjSnYCtkjsHGMu5AiVdYq0wcRRuh1qswk2X0GZ4sG3scDNGUwULLF4M6zHFLfhKvVq4SUZHT92Mns/0WFRMaeZpZtsWPt2kP1IxfWirT5z+z59YJd+5ajsuUVJseuN31f0+IzHBpiWncNSeK4L5gBlKt01d4YZxDIXkOtkCwUgUct8gBOZYorImoO0qK+rO/rlHkqDGHxau7VSs0yXazC8Zz9xDq7W5K9R8eaccbFMcW892tTBvVZFkL8MdwMe+8EmOPI7Jphz1QIjuU63rmu3ppLK4blyHxXV7Cw+PkmLnjoGW7oXp2xPEmRm+rl+qtDa7WsWUMPqMNPaatf2zZ5Y4SbUV1dx465UeSrsGHyIpmYNAx9VdCjmJlC5gPrP5PosMPSztSGR4Hh/6z6sfW9+Fh0MJ2AJO3UOGPlMbRZAgDeJIbi/rH/e3POEnE0wA/tEuP2z/05yOfAHMtfjrZsyqGkz3ysGernob4cfgsmfBHJDEi3124Xr32q/lw1dWvNRH0Xo195WjCzNTvlLw3DV2k2XqlqWN5DF8Q8ZsLSk2rH8OZ2oGRnOXwJcsyl1K0gUysYjhXOwoQdSLa/+G/QP98Let7gul06gjKVK+YCOgNUnrqSOrgLnhhuS0odt4Fj6W86h8K7SYa) | [Options API](https://play.vuejs.org/#eNqFVNtu2kAQ/ZWRGwmiYJuoyosLNFFfGqmRqihvMRLGHvCG9a61uxAi4n57x+sLNiRtlAfvmZkztzMcnLs893ZbdAJnomPFcjMLBctyqQzcJcnDlhuWc3zElYaVkhkMPP8E9170IBQAocC9jUtwFZEdDiUaSyITKIwOKgBOeUuwGFUMAElkouFl46rQbJVoXiXbVpgAvlbvwoaGgv4nfls9PQxmOY8M0gtgstwaIwXcxpzFm2noWJKrq9CZUSUTvzJb1/fP/WEKD5FJvSzaDyvAhesRjC+J5hEzucMe0yRKEjeru3QVtWlhMjS1wc5dSUX0ApioGiOqptFJwnaze/KFwwEEFMXEL5Gaw+836H+UrOPkjJxqpW4W5bQuKWjddqZhbdCh064ndG71hinD0SdhuDshE3S3hnHrFDqpMbkOfH8r8s3ao/36n/lTydqcgh7qzF0q+apReQnuqJ7QaRZJlZ6ri4qtFXmAFIpah0RLsmsNNILfSua6tX9WFAV9rNR/K8/34SllGiKlojd4ZZxDKnkCJkUwMnc57pADcsxKrftH2XcIFIoEFSawfLNxmkvTKjtlPCkbDuB5bq+hRX9Uoh93Rd/eS8V5rJuj6USRaimsssRS6NpGQWRpRjY01Jh3UVajaSN2JN89onx/L2sB+prOujdY8pDK7inznniO6eio6mTnAyyRVQBDRrLsE5Z/bNVYejDQnKi2djjPTdo55S39u84FjV+jpepHeRzF2qQw67DZev+TrYmbnsb1sh4f7Wf9UVw24ziJ7w2tvrqu6p57+6dttYJIh4Nc4WB0dAFYyK1B9fPp4VcQhmLR+p61Q9c/7JY+RD4CZpexuDiwIoCLA3KvpSsWR+9L70UyMRxQhgG1VYHz+mveuV9t3jhSVl3eLdVajXgZxZu1onaTAL4g4jcLSkXaDeA634OWnCXwJY5ja8pJnEysA7jJ9wQQdyjq3+U/QL+ENes5wXg8tgRZpNZMuHSaZB5bkhLcu68sMSlhNw14msop/gLFtkeo)
