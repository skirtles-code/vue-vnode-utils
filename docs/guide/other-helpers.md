# Other helpers

## Extracting a single child

Slots return an array of children, but some components only allow for one child in their slot, like Vue's built-in components `<KeepAlive>` and `<Transition>`. `extractSingleChild()` can be used to pull out a meaningful root node from a slot. It skips over fragments, comments and text nodes, trying to find a component or element node.

In development builds, `extractSingleChild()` will log warnings if it finds multiple eligible nodes. It'll also log warnings if it encounters text nodes, unless they only contain collapsible whitespace.

In the example below, the `<MeasureWidth>` component expects its slot to contain a single child, either an element or a component. It'll extract that child, ignoring any comment nodes, then add a `ref` prop using `cloneVNode()`. Once the corresponding `ref` is populated it can then be used to track the width of the child.

```js
import { cloneVNode, h, ref } from 'vue'
import { extractSingleChild } from '@skirtle/vue-vnode-utils'
import { useMeasureWidth } from './useMeasureWidth.js'

export default {
  setup(_, { slots }) {
    const elRef = ref(null)

    const { width } = useMeasureWidth(elRef)

    return () => {
      const slotVNodes = slots.default?.() ?? []
      const child = extractSingleChild(slotVNodes)
      const childWithRef = child && cloneVNode(child, { ref: elRef }, true)

      return h('div', [
        h('div', `Width: ${width.value}`),
        childWithRef
      ])
    }
  }
}
```

See it on the SFC Playground: [Composition API](https://sfc.vuejs.org/#eNqNVl2vm0YQ/SsTmsZYMuA+9MW1c1NFeWwjpWnzEKIGw2DIXXbR7mK7tfzfO/sBBnLdRLq6ht2ZMzNnZs9yCX5t2/jYYbAJtiqXdatBoe7alymvm1ZIDReQWK6ggiuUUjSwIOvFsPsbZqqT+KEudOX342S8GH9RZJ3yXHBF2JU4wc4ghlp2uLztvK5qVrwWhMqRa7K5pBxcLuHfK8pCMaEVXJduAwhDd5JDuITdy35tWK3CRVEfF8YvZ5lSG1hUGSujk0lpAdeVg4sLLLOO6XBJmRj3q/mhf/S3TRwfxAS9aGxalmmkN4DtvtNacHiVszp/3KWBL+uZ+U0DawPwXhwODK194hyc85gdb7p9FkXwvqoV4DmjQAidQgUZB2TYEB9xHEMU9dZUGhyjuvSR08AVSa97IQuUQwrQ90eBrhBs9SBKeqmVx0oIzOU1adv/p0rpnCqUtGuhgHrmM4Z8aOEt31lvvzP1jBeTRKcoT+e8TYZGBavAzWjUZC1NoeA043ZOUr+h0mDTT04a0Fib9zSotG7VJklUmZuT8UXFQh4Seoplx3XdYIyqifZSnBRKAk6DVY/xSj3WUjM01tGRiwKjTtfMBroBd7x9PMREVHLPnpqi9HxxErbA4zQ0GSe0cUQZSeTEpOHyfjkz069K6s8BsTg7zcTioAw5o1789TulSAKxMsd6ohKU101F8Kxllus/ak6nwvZysL1HwxSABmyiNr13nMx2jOQYz5Tj2fr6U/5NSXFKhOwd1eFEineMeWkYm1z8UbqS2Sx4aN0nPk8rlRdESsESqAhqokkPMTk8PMDHT1OP3FK3e4LP8Abm4098PtS6cpU5iBcvRv0L7ZohhcreeA5IJr1KO7B7Ivux34Db2mfLxgaeXyxV8TFjHV4/L/3A2txGWfWrn+ZCTAP4dXvHMyj4n7wRdDKR0rdX1SnT+fy6GmbBETKfpR34vg0tcnauzW4W7GXVbxxQv2HGzejdW/mGWc/+5SF+jsw0r1+wsjM4d21BCjVEHs9FP4K0bkO4tBx7npoRn2YMKA79i0VZ0mQ7zA10dKzLmmPhabzFprug/hff7p0AEADHE7ybLIaj/HzRllKXywpCcjE6bApbgXCiPHAwKYQ2LU2ulrHp2IrwRlYjdB8doC7BeJsQo6t+nHTcceEeveEwRzcEG+c+Qu/vzGb+I07MJNCOT240f+GklTN0knSqlmNOXxtjf3+YBklxM6/0PwxVnCsz6/5zw+I2mTzUPNoLWmo28NO6Pf9iv1dSHrsr1Nm5ZzJoz6AEqwv4Yb1ek2kPMfgCtFlRkIzM0G4fTA7RPm7g5/WPxiS4/gdNrWtD) | [Options API](https://sfc.vuejs.org/#eNqNVk2P2zYQ/SsTdRtrAYtyD724djZFkGMbIE2bQxQ0skRZylKkIFK2k4X/e4YfoihlNwiwWEvDmTfDN8MnPkR/dh05DTTaRjtZ9E2nXmS8aTvRK3iAGq5Q9aKFFbqs/MJfNJdDT983pardOklDI/ks0Tvj9GL8S1rlA0PAjAMUAkE45UpurQFmeGsdp42v6oaVr0Zn7wvQU17SPr6dLNqmhp5DHa/K5rRaY+kFyyVmWNU5q5KzRl7BdQ2qbiS5kUwoSVxZ8e3tCHS1D+bn6iopc5VPyVwin1rW4rwF1Q80DM04/u1STyi+KNp2LFcU3wB2h0EpweFlwZrifp9FGgb28Ez/ZpHxAXgnjkdmcHepDbDBIV3OdfcsSeAd7g3oJcdEFAZJJeQcKKMt8kcIgSQZvZEkOCVN5TJnkaULXw+iR3J9Cb43EpmjYHgEURkaHVaKYLau2Qj8uFQs51zTHlcNFGCPXcXTfAT1zmfhZ0vPeTkrdI7yeM271DcqWkd23pM273CiBcdDYhqfuQWZRX4uswiPiH7PolqpTm7TVFaFPlqfJRH9McUn0g9cNS0lVLbJoRdnSXsEziIcNYvxUt43vWJUeycnLkqaDKphJtEEPPDu/kiQqPQpf2yKVEvjLG1JT/PU6Jziwon2iT1hmsunt7Nw/W5L4zlAFhfKgCx6gSkY9uK/v7HENdRrPF3VTHGwrkmM6EX1eaH+aTieCtNL7/sUDXMAHLCZco3RJF2saPnSkY8LmEQJ6OL/tcgYHYGrV4dCcKnwyL3Ffez1bmI+MObkJXR5cEfpim6L5LEJn8U40UEV2r+YpMci6RIMgRKhZrp2RzDg7g4+fJxHFIa6/SN8xhOYl8Qg5n2jarszC/H8edC/2Ng0KbjtreNACy5KowebJHwu1x8mJfe2T4aNLdw8GKrIKWcDvX66dQNraguqGq0fXTIvxDiA37c3nEHB/+WtwJNJsXwsfg3nXBXLT5+fBUvIcpb24PrmW2T9bJvtLGBl08KRqtdMh2m9e9O/ZiZyfLkjN5Tp5o0GIzs+eOjwqzRlDudiHEG0mxS2LMueoybgU48B5sF/RFQVTrbF3MKAx7pqOC0djVNu/BY0X+mbgxUABOD0DG9nxjioz23aUGprWUOMIVqH9cbWIKwoew5mG8FFQ5PdS+gaeiFe4BWgu+wATQU6WqcILhJh0WTgwj46Rz9HE4LJ8zTCGG/dFvEBJ3oScMUVF8xfPGvlAh0lHXfLaYE3ljB+vJKMkmJnXqovjEpSSD3r7rphcNu8PzY8OQg0tVv4bdNd/jD3lYwT+wm1fvYZHboLSMGaEn7ZbDboOkL4WIAuL0uUkQXadPWyiOZxC79vftUu0fUbfgl9kA==)

`extractSingleChild()` uses `findChild()` internally. If the exact criteria used to extract a child aren't what you want then you can implement an alternative using `findChild()` directly.

## Checking for an empty slot

Another common need is to detect whether a slot is empty.

In general this is very difficult. The definition of 'empty' is not at all clear.

The `isEmpty()` helper can be used to check an array of VNodes to determine whether they appear to be empty. Comments are considered empty, as are text nodes that only contain collapsible whitespace. Elements are not considered to be empty, nor are components. A component VNode might ultimately not create any DOM nodes, but that isn't taken into account. Nor is CSS, so `v-show` won't be factored in either.

```js
const slotVNodes = slots.default?.() ?? []
const empty = isEmpty(slotVNodes)
```

A common mistake is to call the slot function twice, once to pass to `isEmpty()` and then again to do the actual rendering. Don't do it. Everything should happen within the same invocation of the render function and the slot should only need to be called once to obtain the array of VNodes. You should also avoid caching the same VNodes across multiple renders, e.g. in a `computed` property.

If the definition of 'empty' is not quite what you need then you can implement an alternative using `someChild()`.
