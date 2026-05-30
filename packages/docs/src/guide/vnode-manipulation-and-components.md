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

The complete code can be seen on the SFC Playground: [Composition API](https://play.vuejs.org/#eNqFVdtu2zAM/RXBGBAXje0B25PhBluLbuiAdUXb7WUuUCdSUrWy5EmymyLIv4+U71mSPUUmD8VzSIrZeJ+LIqxK5sVeYhaaF5YYZstilkqeF0pbsiGaLcmWLLXKyQSgk851m1GuzktrlWzcYTSw4b074K9alcUY60zhswFkKhdKGkvmqpT0VyZKRs4wuy9LIU5SmUQ1RSAHH5blhcgsgy9CEsqr2TnGkQoDY7LZDO/ZbpMIIR0WD3DUSCFYOVpVkCvKxFnq9YGp1yA77LzWG7s0gEVugLpWkiXREHIgsAqWSkMcB/6ES/J78oVrYydTMrljoJ/i6f6Jazp5SL0+D+IhD8hykShoT7bW6BTVahvdSdQVzJt6dVOCPMPSKwnt3yAY0jiHST2oYH1l6n0yL1xbwSJoaFBJKFJQWi4cKPWerC1MHEWlLF5W4ULl0SE8MDF21xgykwdzrV4N0yFlFfBJPcy8TeUWmI6GBHh2Y5lReqNVYbrZPJTWTRZbuzDKllkpIBwzsJxbE0MHyoJCXWLXftf2ycMUAQXej4AdD/rcM/EdYgps8K4pMUJZIHTS1k4DSEvin5CzWVdP21hbAb6LAu2Omn8yHeMHEZ0FbT2nuCYa9hbHvgWmdqLkz38kxsSX7NWdx+nqKBTk76nMlHRRwyTQrZ0jHBqEMwzb2e+Hfu/AiApmCafw5t+P3vrBxQSzVpSW0Z3t1K4RVxS4DQrLJatL7UQOK9c16k/JNaMxsRpePfJ1NWyXyUEUqAKVbUosWpfxEsfL3ztdgxD3Xr+jDwJbRTXPFdQDRmE8S7ut7rlCfVxLL57Y4oXRLvBoJ1vwHjH52xU243G4ZoJ3m9NTTreP/9/GzULiEhQR+1bgEnNXwVbrV20vf7js3C8aOIUvJNIt4kRkc6hVXG/RxpXgEyLRLImc98jiswbELflqZ+1h4blg+kdhOYgfrb9MCPX6zdmw7c3bghgsXW1fZsL0jmezrlfjjWaw1SpQ0vlspqGttfvy7pqt4dw5oSilAPQR5y0zSsBaU7KGncM/FfAe4BzdK/dGuFzdm8u1ZdK0qsbjDZUu2cUR7T3dD+HH7hlv/wIIl8g4) | [Options API](https://play.vuejs.org/#eNqdVW1r2zAQ/ivCDJzSxB5sn4wbtpZudLCutN2+1IU6kZKoVSRPkt2U4P++k+QXOW1CmQnYunvu/fRkG3wtiqgqSZAEqZpLWuhpxum6EFKj6xxTcVpqLThaSLFGYRR7MmMWDsHfpSiLIdaKokcFyIyTjcVisshLptE24wjNBTjghGuVOAHyA489iXVlzjVIzRvnOh8dtVaS6FLy9oTQTJQc/8lZSRLES8acvLYOMg6/NO4qhoMm64LlmsAJoRTTanpqHKDKedhuPYeortPYQDqsc55Kk+dkadtQTdYCE3aSBb1hFjTIDjtz/U1sGMDaTIPpJbQkjX3IHsNqshAS7CjkjyhHd+E3KpUOxyi8IXPBsfm6XVGJw/ss6OMYPMSBsqylKeiNaK3QVuSqbepO465hwThwSzBZ52bUgsM22TFAGKtQWdANNwu+qCcqNSMxLNCk4tCkSakps6AsWGldqCSOS148LSPYjngfHjJRelcYEbWezKR4VkRGmFSQTxa0M4dMB0sJeTbru0U5xldSFArVzQLvC7t3k8mamiW+C8sCNpMkdvx27OG93ePC+DeAHY3RScIxka+2uc1qpFdURR8UE1pBWTbq6GiMwOBk2u/87h1AqA+VIOujFzR3yzyh4L9fJZ2gESfP9nsYxTwuH1Py6I16x6iz7I3s1fM+aqvz59ITy4CPGNGIYnSCPv536732N2X4jfH697ekkmDolYTb6tJs+tQSwUGsT0+G2UptAO1MTY0/TVzPzRKK68fuDXFnWl3zurEpYwl9PluR+RPBAx/vGE9rtjuVQQmSgCnu83NJvVyYaTz4hDH5sD0+prh+eD+/NhRDOXQJ6ZfC0JJ1CTzVk2ffNJ++7NsIKIaTSaij1pTlM8JQ4nixUaXm5qB4msZWe4DKtALWXNDlDpGZYVJG5K9CU8GHhJYzJp5/WJlZhWZAYGM67OSLnKle8ag2juyuJAGeqqCSTqdzCSvh1Oc3l2QD350SmlIyQB9QXhMlGBCV4A52Cv89kLeHs+leWN6jfHmrzjeacNVW1S6z2zPodEnODtTep/sp+tzd5/oftonCLA==).

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
