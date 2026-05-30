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

See it on the SFC Playground: [Composition API](https://play.vuejs.org/#eNqtVlFv2zYQ/is35cEOYklpk7aAZidthgzYHrZgaZ/qYlCkk8WGJjWScmwY/u87kpYsK3baAvWLxbv77o5335FcBx+qKlrUGCTBWGeKVQY0mrq6mgo2r6QycJNqln3IMqlyJgUUSs5hEMX7YuticARylwrkR3BOtwWPY58AhaaFwXnFU4O0Ahg/WFSYNjAnfC4OKxfKMMNxMg1+Z0qbabA1BnBr8DaZFAaF2fqJDzr6vij3SL7yThgv+OlxPpZMdcO49Y9GeaYj6Tju1DoYBb6J4Tytoq9aCmLG2kKnW4WeBgk4iZW9149MUYIx9TBcCJljWBvGndE0KI2pdBLHtageZ1Em5/Ex+zhn2vSFEep5+KDkk0YV5bigfKaBjbyZig1l+pyDOxrvCLyGcgQKC9hsSbjH1TWkeX6nZKVb/bEcCTQVuHSwHIu05gS36biJGf47ImeaS0OeTpsKUWeIcwRKRY65H4WJzWYoas5PrUdrpsiDEjA8hclVAwXgaMhBLQxBzhvTxmdWMp4rFKRrdjB00alSLrfriNxdX8PnL6O+48YHo6SW5MAFOTvbhWgz6kAA4hg+aSZmYErcYpkGuUDFV6CpoJyayLIe5KGmM6UuCpahhkIqQhMKlynZY9e2qVLS5DWZ7FcuWqS8xlEXM5DiU5UTd5PGcpDAsPnu79r+WNHV95S7JDoBqUAuoX3TDSDXVAZy92K63x3DEqIXorvsLNrPTUugtmHlcJCzxcByMeOp1pDAoJ32AWxGLXEI2zqzA9U/gbVZcQSdyQpzkkStF7+hhzR7nCkiDvXrBBF/dUKyQJXAq2oJWnKWw0mWZU6VSS5Jc/L61cWby3dORDNP584qgYLj0knsR5gzhZmhQIkF1XPhVCWyWWkSuDg/r7zxE8tNmcDrSy/wG7BJ+3PsyE1z4Kbzw1C5Q2BiR5sJ9APldrrj5baTZlVhAjdSckxd/TfESfvvzurWTOF/NW2FcEa1tPXYe6NojprKuy5uT4o5s9Puc7ilhR5+HtQ9hn/pAIyczahNk+6IWyfDZ6gR/OK2GLXsP9D0/WuXmORZRPdP7zqZBpA0qnVbItpOc0PtgUtMiReEeZ9xlj2SxOdN1uu1LxtsNmO6BRZd+CJkBdk23gnfOHyQ+YrAY3viQXy1QzZfe7faS2zeXrOucD9ASKrcAS9ncNjxPFUzJkIjKzcbLd7XpT9QYTMr+LZ4WxTfnKxaaWteSUbPAOVkPmACoY8G9FDIc6JcAm864W0VjwYv3hXZt4PbAiWQ1kbuxT13kXfh7SVRcPnUmvoEWt64JPq+qGLN1J8fGHBD3RQFm/WeKfTMqBhH9XdlW7b/XEk55fCnk3VmkjAlZo9eXqR0rLeKr3rpnzJ3CukVsiDGtjpDe0V6YFr17f1fuKTvVjmXeW35/YLyH6Ra0stCCm92Q9WnvDt2Lt0/3EOFevdR3y7pmaebXdkdNKePtabD7bcX9r5L9yK6bF9Rm/8Bv30AFA==) | [Options API](https://play.vuejs.org/#eNqtVltv2zYU/itnSgGniC2lTdoCmpO0GTpge9iCpX2q+qBIRxYbmtRIynFg+L/vkNTF8iXJgAZBQp375TuHXAWfqipc1BjEwVRnilXmMhFsXkll4DrVLPuUZVLlTAoolJzDKIyGZKs8OqBykwrkB/Qcr1FOBC6deo5FWnMDq0QAZJJsChRGx54AW+bH+4jOrmWsE0G/06jLij4MziueGqQvgOmdVZykraYj7pInlcvCMMPxIgl+Z0qbJGiEAdw3eJlMCkPxNnaivYZe5uUWyVa+4cYTfrqfLyVTm27c9//1ssMj6jTaqHUwDjw+JvO0Cn9oKQhurqVJw9BJ0DU5CT7qe6YowIjgMVkImeOkNow7oSQojal0HEW1qO5nIaEkOiQf5UybbWKIej65U/JBowpzXFA8SdAChiLdhfe+2VhBOQaFBawbfA/GYAVpnt8oWemOfyjGg/DPU5Mev26LotDUSrRfAKSRihxzB/cYRM0d6F0W9IdGw/5XSDKqt8LRUFtrYeACTr2InTNBCM5KxnOSJ04b+7EpmQ5faS6Npkq52K5CsnZ1Bd++j4FOF5d9SN4OI49LMuLcnJy0TnYzAIgi+KqZmIEpsdFjGuQCFX8ETaXk1D6WDRTuagO6LgqWoYZCKtIlHVymJI29ZFueuI3n4sJJhoO6NQvE/oyk+FpRyTFuJUYxHLfnYaL2hxWb3AEL9niigrhANuXWgFxT4mTpqSBfZr0HQGO8/+iOzWH9um1K05LyeJSzxWhMsM14qjXEMOpmeURg6sBBmvsXqzaPHEFnssKcKGGn7oO/S7P7mSJEUEOOEPFXRyQJVDG8qZagJWc5HGVZ5liZ5JI4R2/fnL07/+BINMq0Th5jKDguHcUeJjlTmBlyFFulei4cq0Q2K00MZ6enlRd+YLkpY3h77gk+ARu0X08H7qbB5O8bUpwzez19G9Vb4PneTGBlB6lbbT0su56axwpjuJaSY9q0pZ1eYto1vSGs8N+aEiZ9o2rs4Ott3BpFw7RnC8zRlDLvozByNuPYb4UGUq9sMsc7mYzhlwHiHAZaD8/esQQsDyq6bLbujiSAuGWtutKQzfY6GiiXmBJaSOdjxll2TxSfBkmvVr5QsF5PaeUvNtUXE1aQbGud9FuDdzJ/JOWpXW8QXfaa7WlwhT2F8eZO9Vv75TClyu2xcgL7Dc9TNWNiYmTlJqbT93XZHrNJO0H4vnhfFM/OW620Fa8koztfOZp3GMPEeyMo071AAIvh3YZ7W8WDzosPRfa8c1ugGNLayIHfU+e5d2/vhYLLh07UB9DhxgWxbYsq1u6C0z1jb6ibomCzrTeJfXkyjurvyrZs+DZJOcXwp6NtzCDplJjde3qR0l7vGD/00r9bbhTSk2NBiO14hnJFek1a9ufbv3BJ5445l3lt8f0E8x+kWtIzQgovdk3Vp7g35Fy4f7hXCfXui/68pDedbrOyGbSbwkrTyvvtidz7cM/C8+7JtP4P51kYBA==)

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

See it on the SFC Playground: [Composition API](https://play.vuejs.org/#eNqdUstu2zAQ/JWFcpAN2FKL9uQ6dh/woUWRFm1vUVDI4spmTJEESTkKDP17V6QsOykcFD1JnH3N7swh+qB1sq8xmkVzWxiuHVh0tV5kkldaGQc/0NbC2a/cOiiNqiBO0jMsubdxJudpKKYyejistMgd0gtgrg0ubu/maff1gAnVU0HlHiFMcNhPS2WusyiEgUu4vcuixeEAPdK281Tw0CP9q0mYExtk8QTijUGU3c9a1Bj/3/QLvf6Z0zw9OwQ9rXsUCLZQGhkhxAgOXeE6L3Ybo2rJZnCFiO88qAxDM4PXugGrBGdwVRSFD+mcMS43FHulG0Jaf/+uOXWNJlEQblrlmsRRkqT1Y7I+YLNoFgZ32Hu748YJTMkE071UDKe148InZdHWOW1naVpLvdskharSS/kpo6Wfgwnaaro26sGiSRjuiU8WdZOJcktMn/qIiPaeO8AW2t5t1JIMNgS4XVXaPQ7hS3yoJpPY+CqGZd6JVdaycFzJc0+Pfk+oqxXKWWjH4S6FkmT2YssFMyjhOoRpAd9mmYzGsFx27qQRALyEUc9qdKwZ952AfOJqI2E7ihnfdya6Ub13bDzuT9F9Tnm1oLShkZeXTuXIN7Lkm2eSkiSaCzTfdLfYU2lzIdTDF485U+PkiBdbLHYBL3NhT4F72wTZvxNDNHvMoiHmcrNBF8KrnzfY0P8QrBSrBWW/EKSTK0HKKBnSPpLdifdZnqf72etM7v5lV41DaY9bdRv4c/n8LCK5P72w+4num+Tt4Lj2D+7KrYk=) | [Options API](https://play.vuejs.org/#eNqdU8tu2zAQ/JUFc5AN2FKL9uQ6SR/IoUWRFm1vYVDI4spmTJEESTkODP17V5QsOwkcFDlJmlkOd3dGO/bJ2nRTI5uxuS+ctOGCa1lZ4wL8Ql+r4L9LH6B0poIkzY6w9M4nXANwjdtYL7DMiYRdixaGRDTq4GcdAMd6LdBw3bSn59lwMX0ErKzKA9IXwNw6vLi5nWftMwKu05gqEokIYUrCZload85ZR4PUcHPL2cVuBz3SNPNMyU4jeybS3ZM4FMkEkqVD1O3LQtWYvO72E1r/3dM8O1oEffrwoBB8YSwKQqijbquLvFgvnam1mMEZIn6IoHEC3Qze2i14o6SAs6IoImVzIaReEvfGbgkhE2j/rTipsgnrrJ9WuSV7jaZYxGt4T3jOBjs5++jX0gWFGQVoutFG4LQOUsUizlYhWD/Lslrb9TKlPGSn6jNBQz8FU/TVdOHMvUeXCtxQP5ztc0OdPk4iNdqndgcraPq8kiRFdCCkv6pseBjoU/3QmWehLmtdBGn0cYpHfyek6pUJHprxPveafpdiJZVwqOG8o2mAKHOZjsZwedmmk64AkCWM+q5G+zPjXgkoJ6F2GlajRMhNG6Jr02fHJ+N+Fe3jUFcrKhuEor20qkC50aVcPrG0/UWlQvfDtoM9tjZXytx/i1hwNU72eLHCYt3hZa78gbjz2872n9Qhug1yNnAhd0sMHX31+xq39D6QlRG1ouoXSFq5UeSM0V3ZZ4o79X1UF9v9Gn2mdP/xV9uA2u+naieI64r1nJHdX16Y/dDuu/T9kLjmH3gtwlk=)

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

See it on the SFC Playground: [Composition API](https://play.vuejs.org/#eNp9VG1v2zYQ/isHtYBl1JJcdP3iOU67osAyLFuR5VsULIp0thhTpEBSigJP++09Ui+R3Sb6RN09fO65F97B+1yWYV2ht/LWOlWsNKDRVOUmFqwopTJwAIVbaGGrZAEzgs5G1+csu6y4YSXHK9zqHhJGJ/bwQdOdWKRSaAOprISBM8vqf5jHYh11cSki/RgsSp4YpD+A9X1ljBTwKeUs3Z/Fnrv77l3sbSjEOurcDvrfy3iKdZmYPCySxu8MAbxfwHJONFdYyBqPmNZJlgVFLz8gldqZyTFogzrYSkX0Apjo8iGqDkSwjNWbC8LC4QAC2nYdWUvPER0nGP0s2ATkLbyu1kGRlFRHKahRB3s17h069lbgLNb2Se+ZMhwj6lNQC5lhUBnGHSj2cmNKvYqiSpT7XZjKInoJT5K1OTWGqIvgXslHjSrMsCY9sWcjt7FoSemPbSex4xTlC2p5khpW48+n6QBUjG9Klnr0vyTPjRM27lqG24SidjVws+v/uyAyzaUhpvlQnCiC65xpSJRKnuCRcQ655BmYHMHIMuBYIwfkWKAwOqLqlFLY43hdochQYQb3T+6WjdA5+8nOGc/cQ7DT3aXq39zSjHcojj3mixuZ3qpIshLgz+FsM2glxhFHZMsBexSJ5JBvqJnv8qW2uGqch8R3fg43t4tT5oGDhu2C8mmI4zkYva0x1ChtctXativwGU3oKa392HbwnTj6jGx1bobItxTago+RLfVAo2Mar4Qcxc7ksJlIfS3EgJ+mdhJl+jv5GY/t2LaxDjeTEvYNWDybcn9WKpwtpjCAO1kZVL9fX/65imNxN8FP5dLj9o/1+cgXwFyJ794eWLuCtwfk4cjW3k3x8/BBMuHPKMSMdA9mO3r9qTu47OxrjQW9V22eOOow1fadkvauoPdJut8pqli2gjeI+KszSkWjv4L3ZQNacpbBmzRNnaukCWRit4KPZUMGoo5Fv4f/B9p8PeuPBMvl0hEUidoxEdAbJPfSkVhjEzyyzORk+zgYT0NRDkbTNG/Z7mQ32tfLOKq/S8No2o92ZMK5fPzD2YyqsG8J3ckx3Xf2bUIjODoedNPtz28KafXVGHujz5B4pPVv3V//+QsbOo/OQmYVJ/QrziukatBOk6KD/UZ1J90TnJN74VYk5X6tvzYGhR6yshm4pjp87NGi/PJK7s9yP4S/jKu7/Q6W749k) | [Options API](https://play.vuejs.org/#eNqFVdtu00AQ/ZWRqZRUxHYQ8GLScBMSRRRQ6Vtdqa49ibdZ71q769RVar6d8foSO6Wl6oN3LmduZyY752Oee9sCncBZ6Fix3CxDwbJcKgMfk+Ss4IblHM9xpWGlZAYTzz+Qe7d6EgqAUGBp/RJcRaSHXS2NJYEJFEYHjQAOcWthNWsQAJLIRNPjzlShKZToXjVaIUwAr5t3ZV1DQf8Lv8+eHgaznEcG6QWwuCmMkQI+xJzFm5PQsSAvX4bOkjJZ+I3amj48bQ8ncBaZ1MuictoIXHg1g/kxwZxjJrc4QlpESeJmbZWuojKtmBRdbrB1V1IRvAAmmsIIqit0kbDt8pRsYbcDAVW18GtJi+GPC/T/FWxg5MycZqRuFuU0Lilo3LanYavQodOPJ3Q+6A1ThqNPxHC3QiboFoZxaxQ6qTG5Dny/EPlm7dF8/afsKWVtDoUe6sy9UfJOo/IS3FI+odMNkjJ9zC5KtmXkDlKoWh4SLNGuV1ALfimZ617/VFLk9G+mPs8834eLlGmIlIru4Y5xDqnkCZgUwcjc5bhFDsgxq7nu72k/AFAoElSYwM299dNcmp7ZKeNJXXAAl1d2G3rp54b08yHp+31pMPd5czQDL2ItuTWaWArd6siJNF3LpoYK847qbDRNxLbkvUeQDw91LkBfJ8vhDtY4xLJTilwSzj4cLVUb7HEDa8kqgCkjWo4B6z+26jQjMVCfKLe+OZdd2CuKW9sPjStqv0YLNfbyOIq1SWE5QLP5/ida53dy6DeKun/0n+1Hddy148B/1LR264asuxzNn6bVEyKdTnKFk9neBOBaFgbV14uz70EYiuve9lE5tP3TYepT5DNgdhjXRztWBXC0Q+71cNX13vrYu5VMTCcUYUJlNcKr9utqsL/a3HOkqLreW8q1afFNFG/WispNAniBiO+sUCribgCv8hK05CyBF3EcW1VO5GRiHcDbvCQBYYeivct/gC5hi/oYYD6fW4AsUmsmXFpNUs8tSC0s3TuWmJRkbzvhYSiqwWgi+YqtD25lvdSMo/qZG0ZLMLqZEefy7puVGVVgOwTySTHeNPJVRPTsFbe6bO7pL4V0CrcYOr3OUPJIPwe1+svvH1jSd6/MZFJwsn5GeY7UDbp2UjRmn6jvlPfAzqZ7ao8n1X6hv5QGhe6qqisYnBmHTujnZ2rfp/vae9NTofoLMK6w8g==)
