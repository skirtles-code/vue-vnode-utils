# Checking the VNode type

Vue has a built-in function, [`isVNode()`](https://vuejs.org/api/render-function.html#isvnode), for testing whether something is a VNode.

Most of the helpers provided by `vue-vnode-utils` require a callback that will be passed eligible VNodes. These will always be full VNodes, so it isn't necessary to use `isVNode()` within those callbacks.

It is common to want to handle different types of VNode differently inside the callback. For example, you might want to detect text VNodes. The type of a VNode can be checked using `getType()`:

```js
const children = addProps(slotVNodes, (vnode) => {
  switch (getType(vnode)) {
    case 'component':
      // ...
    case 'element':
      // ...
    case 'text':
      // ...
    case 'comment':
      //
  }
})
```

In addition to the values shown above, `getType()` can also return `'static'`, `'fragment'` and `undefined`. Of those 3 values, only `'static'` can be encountered in the callbacks, but in practice that shouldn't happen if the VNode came from a slot.

The value passed to `getType()` doesn't have to be a fully instantiated VNode. It also supports being passed any value that can be converted to a VNode. So, for example, a string would be considered a text node. If you need to check that something really is a VNode then use `isVNode()`, but in practice this shouldn't be necessary for the values passed to callbacks by `vue-vnode-utils`.

There are also helpers for checking an individual type:

* [isComponent()](/api.html#iscomponent)
* [isElement()](/api.html#iselement)
* [isText()](/api.html#istext)
* [isComment()](/api.html#iscomment)
* [isFragment()](/api.html#isfragment)
* [isStatic()](/api.html#isstatic)

For example:

```js
const children = replaceChildren(slotVNodes, (vnode) => {
  if (isText(vnode) || isComment(vnode)) {
    // ...
  }
})
```

It should be noted that most of the callbacks can be pre-filtered by passing [`IterationOptions`](/api.html#iterationoptions), so it's only necessary to do explicit checks if the callback needs to handle multiple types.

Component VNodes can be split into two further categories using [isStatefulComponent()](/api.html#isstatefulcomponent) and [isFunctionalComponent()](/api.html#isfunctionalcomponent). The component itself is available via the VNode's `type` property. For an element VNode the `type` will be the tag name.

`getText()` can be used to read the text from a text node. As well as text VNodes, it also considers strings and numbers to be valid text nodes, consistent with `isText()`. If the passed value is not a valid text node then `undefined` will be returned.
