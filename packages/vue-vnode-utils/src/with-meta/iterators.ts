import type { VNode, VNodeArrayChildren } from 'vue'

import type { IterationOptions } from '@skirtle/vue-vnode-utils'
import {
  addProps as addPropsRaw,
  ALL_VNODES,
  betweenChildren as betweenChildrenRaw,
  COMPONENTS_AND_ELEMENTS,
  countChildren,
  eachChild as eachChildRaw,
  everyChild as everyChildRaw,
  findChild as findChildRaw,
  reduceChildren as reduceChildrenRaw,
  replaceChildren as replaceChildrenRaw,
  SKIP_COMMENTS,
  someChild as someChildRaw
} from '@skirtle/vue-vnode-utils'

// TODO: Should probably move `checkArguments` elsewhere
import { checkArguments } from '../iterators'

type AnyFunction = (...args: never) => unknown

function checkFunction(method: string, callback: AnyFunction) {
  checkArguments(method, [callback], ['function'])
}

export type IterationMeta = {
  readonly index: number
  readonly length: number
}

function setPropertyValue(obj: object, key: string, value: unknown): any {
  return Object.defineProperty(obj, key, {
    value,
    enumerable: true
  })
}

function createMetaFactory(children: VNodeArrayChildren, options: IterationOptions): () => IterationMeta {
  let index = -1

  const baseMeta = {
    get length() {
      const length = countChildren(children, options)
      setPropertyValue(baseMeta, 'length', length)
      return length
    }
  }

  return () => {
    return setPropertyValue(Object.create(baseMeta), 'index', ++index)
  }
}

function withMeta<IteratorReturn, CallbackReturn>(
  iterator: (children: VNodeArrayChildren, callback: (vnode: VNode) => CallbackReturn, options: IterationOptions) => IteratorReturn,
  children: VNodeArrayChildren,
  callback: (vnode: VNode, meta: IterationMeta) => CallbackReturn,
  options: IterationOptions
): IteratorReturn {
  const metaFactory = createMetaFactory(children, options)

  return iterator(children, (vnode: VNode) => {
    return callback(vnode, metaFactory())
  }, options)
}

export const addProps = (
  children: VNodeArrayChildren,
  callback: (vnode: VNode, meta: IterationMeta) => (Record<string, unknown> | null | void),
  options: IterationOptions = COMPONENTS_AND_ELEMENTS
): VNodeArrayChildren => {
  if (__DEV__) {
    checkFunction('addProps', callback)
  }

  return withMeta(addPropsRaw, children, callback, options)
}

export const replaceChildren = (
  children: VNodeArrayChildren,
  callback: (vnode: VNode, meta: IterationMeta) => (VNode | VNodeArrayChildren | string | number | void),
  options: IterationOptions = SKIP_COMMENTS
): VNodeArrayChildren => {
  if (__DEV__) {
    checkFunction('replaceChildren', callback)
  }

  return withMeta(replaceChildrenRaw, children, callback, options)
}

export const betweenChildren = (
  children: VNodeArrayChildren,
  callback: (previousVNode: VNode, nextVNode: VNode, meta: IterationMeta) => (VNode | VNodeArrayChildren | string | number | void),
  options: IterationOptions = SKIP_COMMENTS
): VNodeArrayChildren => {
  if (__DEV__) {
    checkFunction('betweenChildren', callback)
  }

  const metaFactory = createMetaFactory(children, options)

  return betweenChildrenRaw(children, (previousVNode: VNode, nextVNode: VNode) => {
    return callback(previousVNode, nextVNode, metaFactory())
  }, options)
}

export const someChild = (
  children: VNodeArrayChildren,
  callback: (vnode: VNode, meta: IterationMeta) => unknown,
  options: IterationOptions = ALL_VNODES
): boolean => {
  if (__DEV__) {
    checkFunction('someChild', callback)
  }

  return withMeta(someChildRaw, children, callback, options)
}

export const everyChild = (
  children: VNodeArrayChildren,
  callback: (vnode: VNode, meta: IterationMeta) => unknown,
  options: IterationOptions = ALL_VNODES
): boolean => {
  if (__DEV__) {
    checkFunction('everyChild', callback)
  }

  return withMeta(everyChildRaw, children, callback, options)
}

export const eachChild = (
  children: VNodeArrayChildren,
  callback: (vnode: VNode, meta: IterationMeta) => void,
  options: IterationOptions = ALL_VNODES
): void => {
  if (__DEV__) {
    checkFunction('eachChild', callback)
  }

  return withMeta(eachChildRaw, children, callback, options)
}

export const findChild = (
  children: VNodeArrayChildren,
  callback: (vnode: VNode, meta: IterationMeta) => unknown,
  options: IterationOptions = ALL_VNODES
): (VNode | undefined) => {
  if (__DEV__) {
    checkFunction('findChild', callback)
  }

  return withMeta(findChildRaw, children, callback, options)
}

export const reduceChildren = <R>(
  children: VNodeArrayChildren,
  callback: (previousValue: R, vnode: VNode, meta: IterationMeta) => R,
  initialValue: R,
  options: IterationOptions = ALL_VNODES
): R => {
  if (__DEV__) {
    checkFunction('reduceChildren', callback)
  }

  const metaFactory = createMetaFactory(children, options)

  return reduceChildrenRaw(children, (previousValue: R, vnode: VNode) => {
    return callback(previousValue, vnode, metaFactory())
  }, initialValue, options)
}
