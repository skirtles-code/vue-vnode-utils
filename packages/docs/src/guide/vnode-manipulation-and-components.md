<script setup>
import RadioGroupExample from '../examples/radio-group-example.vue'
</script>
# VNode manipulation and components

Manipulating VNodes in `render` functions tends not to work out so well, even if you've taken account of fragments and comment nodes. Why not? The main source of problems is the use of child components.

Components typically have a single root DOM node. That's certainly the mental model that most of us have for them. When we position a component within a container layout we're generally thinking of it as a rectangle, just like a DOM element, and we pass attributes like `class`, expecting them to be applied just like we're interacting with a DOM element directly.

But components don't have to render a single root node. It's pretty common for a component to render nothing, with a `v-if` on the root element. For attribute inheritance that case is easy enough to handle, just throw the attributes away, but it's not always so simple for parent components that do VNode manipulation.

Let's imagine a component that inserts a horizontal separator line between its children. There's [an example of how to do this](/examples.html#inserting-between-children) on the Examples page. Now let's consider the case where the children are components:

```vue-html
<insert-horizontal-separators>
  <child-component-a />
  <child-component-b />
  <child-component-c />
  <child-component-d />
</insert-horizontal-separators>
```

When `insert-horizontal-separators` renders, it will only see the 4 component VNodes. It has no idea what they actually render. Perhaps that's what we'd want anyway, perhaps it isn't. If one of them renders nothing then we'll end up with two adjacent separators, or maybe a stray separator at the beginning or end. In this case we might be able to fudge it by using some clever CSS to hide the extra separators.

A closely related problem is detecting whether a slot is empty. `vue-vnode-utils` provides an `isEmpty()` helper, but if it encounters a component VNode it just has to assume that it will render something. There's no way for it to know because the child component won't render until after the parent has rendered.

The flip side of this is that components might render a fragment, effectively multiple root nodes. Should the separators example insert separators between those nodes or not? Maybe, maybe not, but in practice it'll just see the component node and won't know that it renders multiple things.

It can be tempting to use VNode manipulation to implement tightly coupled components. For example, consider this radio group component:

```vue-html
<radio-group v-model="boundValue">
  <radio-button :value="null">None</radio-button>
  <radio-button
    v-for="item in ['First', 'Second', 'Third']"
    :value="item"
  >{{ item }}</radio-button>
</radio-group>
```

Here's a running example:

<live-example>
  <radio-group-example />
</live-example>

This component can (and probably should) be implemented using `provide` and `inject`, example [here](https://skirtles-code.github.io/vue-examples/components/radio-group.html). But it is possible to implement it by manipulating the VNodes directly. The `<radio-group>` component could add props to its children to emulate a `v-model`, passing on the value for its own `v-model`:

```js
return addProps(this.$slots.default(), () => {
  return {
    modelValue: this.modelValue,
    'onUpdate:modelValue': (newValue) => {
      this.$emit('update:modelValue', newValue)
    }
  }
})
```

The complete code can be seen on the SFC Playground: [Composition API](https://play.vuejs.org/#eNqFVNtu2zAM/RXBGGAH9WXPhhtsHbZhDxuG3V7mAnUipdViS5okuysC//tI2ZadLFmfLJOH4jkkxUPwWqm0a1mQB4XZaq4sMcy2al0K3iipLTkQzXakJzstGxICNPSuLxXl8qa1VorRnWYLG957An6vZauOsc6U/jKALMVWCmPJRraC/qjqlpFrzB6Jtq5XpSiygSKQgx/LGlVXlsEfIQXl3foG40iHgTk5HJb39H2RIcRj8QBHjRSSe0erSxpJWX1dBnNgGYxIj90MenOXBrDIDVCfpGBFtoRcCOySndQQx4E/4YL8DN9xbWwYk/ArA/0UT98euKbhbRnMeRAPeUCWi0RBZ7JNRqdoUDvqLjJfsCAOhqYkTYWllwLaf0AwpHEOUwZQweHKMnhl9lzbmmXQ0KQTUKSktbx2oDJ4sFaZPMtaofb36VY22SU8MDH21Jgy0yQbLR8N0yllHfApA8zcl6IHpkdDAjz9WFaUftZSGT+bl9K6yWJ/XBhlu6qtIRwzsIZbk0MHWkWhLrlrv2t7eBsjQOH9CDjxoM89k8ghYmCDd8XE1NICodVUOw0gLUi0ItdrX087WicBkYsC7Y5atIqP8YsIb0HbzCkfiKazxbGfgKUNpfj+j8ScRII9uvNxuiEKBUVnKhMTH7VMAt06OcJhRDjDsp3zfpj3DoxozSzhFN78y6O3fnExwayp1jJ6sp2mNeKKArdBYblgQ6mdyGXlfKN+t1wzmhOr4dUjX1fDaZlcRIEqUDmlxKL5jG9xvKKz07UIce/1I/ogcFI08LyHesAoHM/SaatnrlAf19I3D2y7Z9QH/reTE/iMmObpAzbjbrlmkheHqytO+7vnt/G4kLgARcQ+KVxi7irYavOqneUvl537ooFT+EMifhEXdbWBWuXDFh1dBT4hkq2LzHkvLr7+L+FzXu4=) | [Options API](https://play.vuejs.org/#eNqdVNtq3DAQ/ZXBFLwha7vPxlnaFFr60FJ6e4kD8a6UrBpbciXZaVj8752Rb/ImW0KXBdujM9czOofgbV3HbcODNMjMTovabnIpqlppC18LJtRlY62ScKtVBWGceDZyC5fgD1o19RLrTPEvg8hc8j8Oy/ht0ZQWDrkE2CkMILm0Ju0N4CdeexYXir47tNKTFbZYnY1emttGy/ELYKsayX4WZcNTkE1Z9vbOBcgl/rNk6hg/LK/qsrAcvwAyJtrNJQWAto9wOHgBoeuyhCATtg+eaaozunNjaKNKMV5e5MHsmAcDcsJu+/mmLg1iXaXB5jOOJEt8yAnHNrpVGv0E1g9CwlX4XmhjwzWE3/hOSUZv3/dCs/A6D+Y8hMc82JbzpIaeyTYaXUd9t0PfWTINLFgH/RJEVUFUK4nb5GjANO7A5MFEbh68MfdC25InuEBRK3FIUWNF6UB5sLe2NmmSNLK+v4txO5JTeKzE2GNjzE0VbbV6MFzHjLdYTx6MnGOli6XEOof1PUDB2BetagPdsMCn0p7cZF4JWuKrsKlxM3nq6He0h9duj2uKT4CjEzrTXDKun2zzWNXK7oWJX5lSWYNtuayrszWgw8Vm3vnjOwAwp0rBxZgNw92iX6jkjydFp7CS/MG9L7PQr6+HWl490+8aJs/ZyV0976VzZz4vs7As9KjkFgSDC3j936P3xj+04Q/Gm9/vRmjOcFYab2tf5jCnUQj+ifXliZStsQQYOaUeP1FeL8wdNjfT7pF4xNY0vIk2Q54453d7vrvnbBHjBfSMbsesLFrQHF3ZXF9f1ONHYuPGF4zo1eH8XLDu5uX6OkiMkDglsI81yZILiTo1i+c8NF++3JMMguEXFTRJa1YWW15C2uvicJTRzYFkkyXu9KSUdX8BSUBY4g==).

We can see a similar approach being taken with the `<basic-accordion>` component in [the examples](/examples.html#adding-component-v-model).

For an accordion it makes sense for the panels to all be laid out as a vertical stack, but for a radio group we may want to use different layouts for the radio buttons. While this could potentially be handled by the `radio-group` itself, we might prefer to leave that to the consuming code. Perhaps we have a `row-layout` component we could use to group the buttons horizontally:

```vue-html
<radio-group>
  <row-layout>
    <radio-button ... />
    <radio-button ... />
  </row-layout>
  <row-layout>
    <radio-button ... />
    <radio-button ... />
  </row-layout>
</radio-group>
```

The problem is that the `row-layout` components now block access to the `radio-button` components, so we can't directly manipulate those VNodes. You might think that we could access them by walking the tree, but those `radio-button` VNodes won't be created until the `row-layout` components render. They will exist eventually, but not at the point we need to access them. If we'd used `provide` and `inject` instead then we'd be free to put whatever we want in the slot, without impacting the communication between the radio group and radio buttons.

In general, this is the problem with an approach based on VNodes. The parent component will only be able to see some of its child VNodes at render time, but there may be others inside wrapper components or slots that won't be available until after the child components have rendered. Any logic that relies on being able to access those VNodes directly, to inspect or manipulate the props of the child, won't work unless they are direct children of the parent.

This impacts some use cases more than others. For the accordion example mentioned earlier, this may not be a serious problem. A wrapper component that wraps a single child `<basic-accordion-panel>`, using it as its root node, will pass on the extra props via attribute inheritance, allowing everything to work as expected. So long as we don't want to wrap multiple child panels in a single component we should be fine. That said, using `provide` and `inject` also works fine and doesn't impose any restrictions on wrapping the children.
