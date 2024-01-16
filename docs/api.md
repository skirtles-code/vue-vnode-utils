# API

## addProps()

### Type

```ts
function addProps(
  children: VNodeArrayChildren,
  callback: (vnode: VNode) => (Record<string, unknown> | null | void),
  options: IterationOptions = COMPONENTS_AND_ELEMENTS
): VNodeArrayChildren
```

### Description

Adds props to 'top-level' element and component VNodes in the passed array. Nodes directly in the array will be updated, as will the children of any fragment nodes in the array. Aside from fragment nodes, nested children will be skipped.

The [`options`](#iterationoptions) object can be set to `{ component: true }` or `{ element: true }` to limit iteration to just components or elements respectively.

Eligible VNodes will be passed to the provided callback. The callback should return an object containing props that need to be added to the VNode. The VNode itself will not be changed, it will be cloned using Vue's built-in `cloneVNode()` helper. Any ancestor fragment nodes will be cloned as required.

The passed array will not be modified, but if no changes were required then the same array may be returned.

### See also

* [Example - Adding a class](/examples.html#adding-a-class)
* [Example - Adding component v-model](/examples.html#adding-component-v-model)
* [Example - Adding a `ref` to a slot](/examples.html#adding-a-ref-to-a-slot)
* [Guide - Adding props](/guide/adding-props.html)

## betweenChildren()

### Type

```ts
function betweenChildren(
  children: VNodeArrayChildren,
  callback: (previousVNode: VNode, nextVNode: VNode) => (VNode | VNodeArrayChildren | string | number | void),
  options: IterationOptions = SKIP_COMMENTS
): VNodeArrayChildren
```

### Description

Inserts VNodes between adjacent 'top-level' siblings. The children of fragments will be considered 'top-level' nodes, and the children of different fragments will still be treated as adjacent siblings if there are no other eligible nodes between them.

The [`options`](#iterationoptions) object can be used to decide which node types should be passed to the callback. If no options object is passed then comment nodes will be skipped. If an `options` object is passed, all nodes will be skipped by default unless explicitly ruled in.

Each invocation of the callback will be passed two nodes, the `previousNode` and the `nextNode`. The `nextNode` for the current invocation of the callback will become the `previousNode` on the next invocation. If any of the children are not fully instantiated VNodes, such as strings of text, they will be converted to full VNodes prior to being passed to the callback.

If the callback returns `null` or `undefined` (or an empty array) then no change is made to the tree. If a single VNode is returned it will be inserted into the tree between the `previousNode` and `nextNode`. If an array of nodes is returned then they will all be inserted between the current two nodes.

The exact position of the newly inserted nodes within the tree is an implementation detail and should not be relied upon. The current pair of nodes might be in different fragments, or they might already have other nodes between them that are being skipped by the `options`. No guarantees are made about the positions of the inserted nodes relative to other nodes, only that they will be somewhere between the pair passed to the callback.

The passed array and its contents will be left unmodified. Any fragment nodes will be cloned as required to avoid mutating the input nodes. The returned array may contain some of the same nodes as the input array, as nodes are not cloned in cases where it can be avoided. If no nodes are inserted then the original array may be returned.

### See also

* [Example - Inserting between children](/examples.html#inserting-between-children)
* [Guide - Inserting new nodes](/guide/inserting-new-nodes.html)

## eachChild()

### Type

```ts
function eachChild(
  children: VNodeArrayChildren,
  callback: (vnode: VNode) => void,
  options: IterationOptions = ALL_VNODES
): void
```

### Description

An iterator for 'top-level' nodes, comparable to `Array.protoype.forEach`. The children of a fragment will be considered 'top-level' nodes rather than the fragment itself.

The callback will be passed fully instantiated VNodes. Children will be converted to VNodes as required.

The [`options`](#iterationoptions) object can be used to decide which node types should be passed to the callback. If no options object is passed then all nodes will be iterated. If an `options` object is passed, all nodes will be skipped by default unless explicitly ruled in.

### See also

* [Guide - Iterators](/guide/iterators.html)

## everyChild()

### Type

```ts
function everyChild(
  children: VNodeArrayChildren,
  callback: (vnode: VNode) => unknown,
  options: IterationOptions = ALL_VNODES
): boolean
```

### Description

An iterator for 'top-level' nodes, comparable to `Array.protoype.every`. The children of a fragment will be considered 'top-level' nodes rather than the fragment itself.

If the callback returns a falsy value then the iteration will exit and `everyChild()` will return `false`. Otherwise `everyChild()` will return `true` once all nodes have been iterated.

The callback will be passed fully instantiated VNodes. Children will be converted to VNodes as required.

The [`options`](#iterationoptions) object can be used to decide which node types should be passed to the callback. If no options object is passed then all nodes will be iterated. If an `options` object is passed, all nodes will be skipped by default unless explicitly ruled in.

### See also

* [Guide - Iterators](/guide/iterators.html)

## extractSingleChild()

### Type

```ts
function extractSingleChild(children: VNodeArrayChildren): VNode | undefined
```

### Description

Pulls out a single 'top-level' child VNode from an array of children. The extracted node must be either an element or a component VNode. If other non-empty children are found then a warning will be logged in development builds.

As with the other helpers, the children of fragments will be considered top-level children.

The intended use case is for components that only support a single child node in a slot, like Vue's built-in components `<Transition>` and `<KeepAlive>`.

### See also

* [`findChild()`](#findchild)
* [Example - Adding a `ref` to a slot](/examples.html#adding-a-ref-to-a-slot)
* [Guide - Other helpers](/guide/other-helpers.html)

## findChild()

### Type

```ts
function findChild(
  children: VNodeArrayChildren,
  callback: (vnode: VNode) => unknown,
  options: IterationOptions = ALL_VNODES
): (VNode | undefined)
```

### Description

An iterator for 'top-level' nodes, comparable to `Array.protoype.find`. The children of a fragment will be considered 'top-level' nodes rather than the fragment itself.

If the callback returns a truthy value then the iteration will exit and `findChild()` will return the current VNode. Otherwise `findChild()` will return `undefined` once all nodes have been iterated.

The callback will be passed fully instantiated VNodes. Children will be converted to VNodes as required. As a result, it is possible that the returned VNode is not actually present in the original array of nodes. In practice this should rarely be a problem, as slot functions return fully instantiated VNodes.

The [`options`](#iterationoptions) object can be used to decide which node types should be passed to the callback. If no options object is passed then all nodes will be iterated. If an `options` object is passed, all nodes will be skipped by default unless explicitly ruled in.

### See also

* [Guide - Iterators](/guide/iterators.html)

## getText()

### Type

```ts
function getText(vnode: VNode | string | number): string | undefined
```

### Description

Returns the text content of a text node. If the passed value is not a text node (consistent with [`isText()`](#istext)) then `undefined` will be returned instead.

### See also

* [Guide - Checking the VNode type](/guide/checking-the-vnode-type.html)

## getType()

### Type

```ts
function getType(vnode: unknown):
  'comment' |
  'component' |
  'element' |
  'fragment' |
  'static' |
  'text' |
  undefined
```

### Description

Returns a string describing the type of VNode passed. The passed node doesn't have to be a fully instantiated VNode, it supports a number of other values, consistent with `render` functions and the valid values for children of `h`.

If the passed value doesn't appear to be convertible to a VNode, the returned value will be `undefined`.

### See also

* [Guide - Checking the VNode type](/guide/checking-the-vnode-type.html)

## isComment()

### Type

```ts
function isComment(vnode: unknown): vnode is (null | undefined | boolean | (VNode & { type: typeof Comment }))
```

### Description

Returns `true` if the passed value is considered to be a comment. This could be a comment VNode, or `undefined`, `null`, `false`, or `true`. This is consistent with how `render` functions and `h` treat children, with all of those values being converted to comment nodes.

### See also

* [Guide - Checking the VNode type](/guide/checking-the-vnode-type.html)

## isComponent()

### Type

```ts
function isComponent(vnode: unknown): vnode is (VNode & { type: Component })
```

### Description

Returns `true` if the passed value is a component VNode. This includes both stateful and functional components.

### See also

* [`isFunctionalComponent()`](#isfunctionalcomponent)
* [`isStatefulComponent()`](#isstatefulcomponent)
* [Guide - Checking the VNode type](/guide/checking-the-vnode-type.html)

## isElement()

### Type

```ts
function isElement(vnode: unknown): vnode is (VNode & { type: string })
```

### Description

Returns `true` if the passed value is an element VNode, e.g. a `<div>` or `<span>`.

### See also

* [Guide - Checking the VNode type](/guide/checking-the-vnode-type.html)

## isEmpty()

### Type

```ts
function isEmpty(children: VNodeArrayChildren): boolean
```

### Description

A helper to check whether an array of VNodes is empty. Comment nodes and collapsible white-space are considered empty content. Fragment VNodes are treated as empty if all their children are considered empty.

CSS is not taken into account, so the resulting DOM nodes may not be visible. Content hidden with `v-show`, for example, will not be considered empty.

Component nodes are treated as non-empty, but in practice a child component might not render anything. `isEmpty()` is intended to be used during rendering, and child components aren't rendered until after their parent component. `isEmpty()` can only make a best guess, but a completely accurate check would need to be based on the DOM post-rendering.

This helper is written using `someChild()`. If the exact criteria it uses to decide emptiness are not correct for your use case then it can be used as an example and adapted accordingly.

### See also

* [`someChild()`](#somechild)
* [Example - Checking for empty content](/examples.html#checking-for-empty-content)
* [Guide - Other helpers](/guide/other-helpers.html)

## isFragment()

### Type

```ts
function isFragment(vnode: unknown): vnode is ((VNode & { type: typeof Fragment }) | VNodeArrayChildren)
```

### Description

Returns `true` if the passed value is considered a fragment. This could either be a fragment VNode or an array. This is consistent with how `render` functions and `h` treat children, with arrays being converted to fragments.

### See also

* [Guide - Checking the VNode type](/guide/checking-the-vnode-type.html)

## isFunctionalComponent()

### Type

```ts
function isFunctionalComponent(vnode: unknown): vnode is (VNode & { type: FunctionalComponent })
```

### Description

Returns `true` if the passed value is a VNode for a [functional component](https://vuejs.org/guide/extras/render-function.html#functional-components).

### See also

* [`isComponent()`](#iscomponent)
* [`isStatefulComponent()`](#isstatefulcomponent)
* [Guide - Checking the VNode type](/guide/checking-the-vnode-type.html)

## isStatefulComponent()

### Type

```ts
function isStatefulComponent(vnode: unknown): vnode is (VNode & { type: ComponentOptions })
```

### Description

Returns `true` if the passed value is a VNode for a stateful (i.e. non-functional) component. This includes async components

### See also

* [`isComponent()`](#iscomponent)
* [`isFunctionalComponent()`](#isfunctionalcomponent)
* [Guide - Checking the VNode type](/guide/checking-the-vnode-type.html)

## isStatic()

### Type

```ts
function isStatic(vnode: unknown): vnode is (VNode & { type: typeof Static })
```

### Description

Returns `true` if the passed value is a static VNode. Static VNodes are a special kind of VNode used to render large quantities of static HTML without incurring the cost of creating an individual VNode for each element. They aren't returned from slot functions, so in practice they're unlikely to be encountered in the normal use cases for `vue-vnode-utils`.

### See also

* [Guide - Checking the VNode type](/guide/checking-the-vnode-type.html)

## isText()

### Type

```ts
function isText(vnode: unknown): vnode is (string | number | (VNode & { type: typeof Text }))
```

### Description

Returns `true` if the passed value is considered to be text. This could be a text VNode, or a string, or a number. This is consistent with how `render` functions and `h` treat children, with strings and numbers being converted to text nodes.

### See also

* [Guide - Checking the VNode type](/guide/checking-the-vnode-type.html)

## IterationOptions

### Type

```ts
type IterationOptions = {
  component?: boolean
  comment?: boolean
  element?: boolean
  static?: boolean
  text?: boolean
}
```

### Description

Options that can be passed to the iterators to filter the node types that should be passed to the callback.

Some common configurations are available via the constants `ALL_VNODES`, `COMPONENTS_AND_ELEMENTS` and `SKIP_COMMENTS`.

## replaceChildren()

### Type

```ts
function replaceChildren(
  children: VNodeArrayChildren,
  callback: (vnode: VNode) => (VNode | VNodeArrayChildren | string | number | void),
  options: IterationOptions = SKIP_COMMENTS
): VNodeArrayChildren
```

### Description

Adds, removes or replaces 'top-level' VNodes in the passed array. Eligible nodes directly in the array will be passed to the callback, as will the children of any fragment nodes in the array. Aside from fragment nodes, nested children will be skipped.

The [`options`](#iterationoptions) object can be used to decide which node types should be passed to the callback. If no options object is passed then comment nodes will be skipped. If an `options` object is passed, all nodes will be skipped by default unless explicitly ruled in.

The callback will be passed the VNodes in tree order. If any of the children are not fully instantiated VNodes, such as strings of text, they will be converted to full VNodes prior to being passed to the callback. Nodes that aren't passed to the callback will retain their positions within the VNode tree.

If the callback returns `null` or `undefined`, the current node will be left in its current position in the VNode tree. If the callback returns a single VNode, it will replace the original VNode in the tree. If the callback returns an array, all the VNodes in the array will be used to replace the current node. The current VNode can be included in the returned array, allowing for nodes to be added around the current node. An empty array can be used to remove the current VNode.

The passed array and its contents will be left unmodified. Any fragment nodes will be cloned as required to avoid mutating the input nodes. The returned array may contain some of the same nodes of the input array, as nodes are not cloned in cases where it can be avoided. If no changes are required then the original array may be returned.

### See also

* [Example - Wrap children](/examples.html#wrap-children)
* [Guide - Replacing nodes](/guide/replacing-nodes.html)

## someChild()

### Type

```ts
function someChild(
  children: VNodeArrayChildren,
  callback: (vnode: VNode) => unknown,
  options: IterationOptions = ALL_VNODES
): boolean
```

### Description

An iterator for 'top-level' nodes, comparable to `Array.protoype.some`. The children of a fragment will be considered 'top-level' nodes rather than the fragment itself.

If the callback returns a truthy value then the iteration will exit and `someChild()` will return `true`. Otherwise `someChild()` will return `false` once all nodes have been iterated.

The callback will be passed fully instantiated VNodes. Children will be converted to VNodes as required.

The [`options`](#iterationoptions) object can be used to decide which node types should be passed to the callback. If no options object is passed then all nodes will be iterated. If an `options` object is passed, all nodes will be skipped by default unless explicitly ruled in.

### See also

* [Guide - Iterators](/guide/iterators.html)
