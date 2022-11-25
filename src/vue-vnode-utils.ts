import {
  cloneVNode,
  Comment,
  type Component,
  type ComponentOptions,
  createCommentVNode,
  createTextVNode,
  Fragment,
  type FunctionalComponent,
  isVNode,
  Static,
  Text,
  type VNode,
  type VNodeArrayChildren,
  type VNodeChild
} from 'vue'

// @ts-ignore
const DEV = process.env.NODE_ENV !== 'production'

export const isComment = (vnode: unknown): vnode is (null | undefined | boolean | (VNode & { type: Comment })) => {
  return getType(vnode) === 'comment'
}

export const isComponent = (vnode: unknown): vnode is (VNode & { type: Component }) => {
  return getType(vnode) === 'component'
}

export const isElement = (vnode: unknown): vnode is (VNode & { type: string }) => {
  return getType(vnode) === 'element'
}

export const isFragment = (vnode: unknown): vnode is ((VNode & { type: typeof Fragment }) | VNodeArrayChildren) => {
  return getType(vnode) === 'fragment'
}

export const isFunctionalComponent = (vnode: unknown): vnode is (VNode & { type: FunctionalComponent }) => {
  return isComponent(vnode) && typeof vnode.type === 'function'
}

export const isStatefulComponent = (vnode: unknown): vnode is (VNode & { type: ComponentOptions }) => {
  return isComponent(vnode) && typeof vnode.type === 'object'
}

export const isStatic = (vnode: unknown): vnode is (VNode & { type: typeof Static }) => {
  return getType(vnode) === 'static'
}

export const isText = (vnode: unknown): vnode is (string | number | (VNode & { type: Text })) => {
  return getType(vnode) === 'text'
}

export const getText = (vnode: VNode | string | number): string | undefined => {
  if (typeof vnode === 'string') {
    return vnode
  }

  if (typeof vnode === 'number') {
    return String(vnode)
  }

  if (isVNode(vnode) && vnode.type === Text) {
    return String(vnode.children)
  }

  return undefined
}

type ValueTypes = 'string' | 'number' | 'boolean' | 'undefined' | 'symbol' | 'bigint' | 'object' | 'function' | 'array' | 'date' | 'regexp' | 'vnode' | 'null'

const typeOf = (value: unknown) => {
  let t: ValueTypes = typeof value

  if (t === 'object') {
    if (value === null) {
      t = 'null'
    } else if (Array.isArray(value)) {
      t = 'array'
    } else if (isVNode(value)) {
      t = 'vnode'
    } else if (value instanceof Date) {
      t = 'date'
    } else if (value instanceof RegExp) {
      t = 'regexp'
    }
  }

  return t
}

const warn = (method: string, msg: string) => {
  console.warn(`[${method}] ${msg}`)
}

const checkArguments = (method: string, passed: unknown[], expected: string[]) => {
  for (let index = 0; index < passed.length; ++index) {
    const t = typeOf(passed[index])
    const expect = expected[index]

    if (expect !== t) {
      warn(method, `Argument ${index + 1} was ${t}, should be ${expect}`)
    }
  }
}

export const getType = (vnode: unknown) => {
  const typeofVNode = typeof vnode

  if (vnode == null || typeofVNode === 'boolean') {
    return 'comment'
  } else if (typeofVNode === 'string' || typeofVNode === 'number') {
    return 'text'
  } else if (Array.isArray(vnode)) {
    return 'fragment'
  }

  if (isVNode(vnode)) {
    const { type } = vnode
    const typeofType = typeof type

    if (typeofType === 'symbol') {
      if (type === Fragment) {
        return 'fragment'
      } else if (type === Text) {
        return 'text'
      } else if (type === Comment) {
        return 'comment'
      } else if (type === Static) {
        return 'static'
      }
    } else if (typeofType === 'string') {
      return 'element'
    } else if (typeofType === 'object' || typeofType === 'function') {
      return 'component'
    }
  }

  return undefined
}

const isEmptyObject = (obj: Record<string, unknown>) => {
  for (const prop in obj) {
    return false
  }

  return true
}

const getFragmentChildren = (fragmentVNode: VNode | VNodeArrayChildren): VNodeArrayChildren => {
  if (Array.isArray(fragmentVNode)) {
    return fragmentVNode
  }

  const { children } = fragmentVNode

  if (Array.isArray(children)) {
    return children
  }

  if (DEV) {
    warn('getFragmentChildren', `Unknown children for fragment: ${typeOf(children)}`)
  }

  return []
}

export type IterationOptions = {
  element?: boolean
  component?: boolean
  comment?: boolean
  text?: boolean
  static?: boolean
}

export const ALL_VNODES: IterationOptions = Object.freeze({
  element: true,
  component: true,
  comment: true,
  text: true,
  static: true
})

export const COMPONENTS_AND_ELEMENTS: IterationOptions = Object.freeze({
  element: true,
  component: true
})

export const SKIP_COMMENTS: IterationOptions = Object.freeze({
  element: true,
  component: true,
  text: true,
  static: true
})

const promoteToVNode = (node: VNode | string | number | boolean | null | undefined | void, options: IterationOptions): VNode | null => {
  const type = getType(node)

  // In practice, we don't call this function for fragments, but TS gets unhappy if we don't handle it
  if (!type || type === 'fragment' || !options[type]) {
    return null
  }

  if (isVNode(node)) {
    return node
  }

  if (type === 'text') {
    return createTextVNode(getText(node as (string | number)))
  }

  return createCommentVNode()
}

export const addProps = (
  children: VNodeArrayChildren,
  callback: (vnode: VNode) => (Record<string, unknown> | null | void),
  options: IterationOptions = COMPONENTS_AND_ELEMENTS
): VNodeArrayChildren => {
  if (DEV) {
    checkArguments('addProps', [children, callback, options], ['array', 'function', 'object'])
  }

  return replaceChildrenInternal(children, (vnode) => {
    const props = callback(vnode)

    if (DEV) {
      const typeofProps = typeOf(props)

      if (!['object', 'null', 'undefined'].includes(typeofProps)) {
        warn('addProps', `Callback returned unexpected ${typeofProps}: ${String(props)}`)
      }
    }

    if (props && !isEmptyObject(props)) {
      return cloneVNode(vnode, props, true)
    }
  }, options)
}

export const replaceChildren = (
  children: VNodeArrayChildren,
  callback: (vnode: VNode) => (VNode | VNodeArrayChildren | string | number | void),
  options: IterationOptions = SKIP_COMMENTS
): VNodeArrayChildren => {
  if (DEV) {
    checkArguments('replaceChildren', [children, callback, options], ['array', 'function', 'object'])
  }

  return replaceChildrenInternal(children, callback, options)
}

const replaceChildrenInternal = (
  children: VNodeArrayChildren,
  callback: (vnode: VNode) => (VNode | VNodeArrayChildren | string | number | void),
  options: IterationOptions
): VNodeArrayChildren => {
  let nc: VNodeArrayChildren | null = null

  for (let index = 0; index < children.length; ++index) {
    const child = children[index]

    if (isFragment(child)) {
      const oldFragmentChildren = getFragmentChildren(child)
      const newFragmentChildren = replaceChildrenInternal(oldFragmentChildren, callback, options)

      let newChild: VNodeChild = child

      if (oldFragmentChildren !== newFragmentChildren) {
        nc ??= children.slice(0, index)

        if (Array.isArray(child)) {
          newChild = newFragmentChildren
        } else {
          newChild = cloneVNode(child)

          newChild.children = newFragmentChildren
        }
      }

      nc && nc.push(newChild)
    } else {
      const vnode = promoteToVNode(child, options)

      if (vnode) {
        const newNodes = callback(vnode) ?? vnode

        if (DEV) {
          const typeOfNewNodes = typeOf(newNodes)

          if (!['array', 'vnode', 'string', 'number', 'undefined'].includes(typeOfNewNodes)) {
            warn('replaceChildren', `Callback returned unexpected ${typeOfNewNodes} ${String(newNodes)}`)
          }
        }

        if (newNodes !== child) {
          nc ??= children.slice(0, index)
        }

        if (Array.isArray(newNodes)) {
          nc && nc.push(...newNodes)
        } else {
          nc && nc.push(newNodes)
        }
      } else {
        nc && nc.push(child)
      }
    }
  }

  return nc ?? children
}

export const betweenChildren = (
  children: VNodeArrayChildren,
  callback: (previousVNode: VNode, nextVNode: VNode) => (VNode | VNodeArrayChildren | string | number | void),
  options: IterationOptions = SKIP_COMMENTS
): VNodeArrayChildren => {
  if (DEV) {
    checkArguments('betweenChildren', [children, callback, options], ['array', 'function', 'object'])
  }

  let previousVNode: VNode | null = null

  return replaceChildrenInternal(children, vnode => {
    let insertedNodes: VNode | VNodeArrayChildren | string | number | void = undefined

    if (previousVNode) {
      insertedNodes = callback(previousVNode, vnode)

      if (DEV) {
        const typeOfInsertedNodes = typeOf(insertedNodes)

        if (!['array', 'vnode', 'string', 'number', 'undefined'].includes(typeOfInsertedNodes)) {
          warn('betweenChildren', `Callback returned unexpected ${typeOfInsertedNodes} ${String(insertedNodes)}`)
        }
      }
    }

    previousVNode = vnode

    if (insertedNodes == null || (Array.isArray(insertedNodes) && insertedNodes.length === 0)) {
      return
    }

    if (Array.isArray(insertedNodes)) {
      return [...insertedNodes, vnode]
    }

    return [insertedNodes, vnode]
  }, options)
}

export const someChild = (
  children: VNodeArrayChildren,
  callback: (vnode: VNode) => unknown,
  options: IterationOptions = ALL_VNODES
): boolean => {
  if (DEV) {
    checkArguments('someChild', [children, callback, options], ['array', 'function', 'object'])
  }

  return someChildInternal(children, callback, options)
}

const someChildInternal = (
  children: VNodeArrayChildren,
  callback: (vnode: VNode) => unknown,
  options: IterationOptions
): boolean => {
  for (const child of children) {
    if (isFragment(child)) {
      if (someChild(getFragmentChildren(child), callback, options)) {
        return true
      }
    } else {
      const vnode = promoteToVNode(child, options)

      if (vnode && callback(vnode)) {
        return true
      }
    }
  }

  return false
}

export const everyChild = (
  children: VNodeArrayChildren,
  callback: (vnode: VNode) => unknown,
  options: IterationOptions = ALL_VNODES
): boolean => {
  if (DEV) {
    checkArguments('everyChild', [children, callback, options], ['array', 'function', 'object'])
  }

  return !someChildInternal(children, (vnode) => !callback(vnode), options)
}

export const eachChild = (
  children: VNodeArrayChildren,
  callback: (vnode: VNode) => void,
  options: IterationOptions = ALL_VNODES
): void => {
  if (DEV) {
    checkArguments('eachChild', [children, callback, options], ['array', 'function', 'object'])
  }

  someChildInternal(children, (vnode) => {
    callback(vnode)
  }, options)
}

export const findChild = (
  children: VNodeArrayChildren,
  callback: (vnode: VNode) => unknown,
  options: IterationOptions = ALL_VNODES
): (VNode | undefined) => {
  if (DEV) {
    checkArguments('findChild', [children, callback, options], ['array', 'function', 'object'])
  }

  let node: VNode | undefined = undefined

  someChildInternal(children, (vnode) => {
    if (callback(vnode)) {
      node = vnode
      return true
    }
  }, options)

  return node
}

const COLLAPSIBLE_WHITESPACE_RE = /\S|\u00a0/

export const isEmpty = (children: VNodeArrayChildren): boolean => {
  if (DEV) {
    checkArguments('isEmpty', [children], ['array'])
  }

  return !someChildInternal(children, (vnode) => {
    if (isText(vnode)) {
      const text = getText(vnode) || ''

      return COLLAPSIBLE_WHITESPACE_RE.test(text)
    }

    return true
  }, SKIP_COMMENTS)
}

export const extractSingleChild = (children: VNodeArrayChildren): VNode | undefined => {
  if (DEV) {
    checkArguments('extractSingleChild', [children], ['array'])
  }

  const node = findChild(children, () => {
    return true
  }, COMPONENTS_AND_ELEMENTS)

  if (DEV) {
    someChildInternal(children, (vnode) => {
      let warning = ''

      // The equality check is valid here as matching nodes can't come from promotions
      if (vnode === node) {
        return false
      }

      if (isElement(vnode) || isComponent(vnode)) {
        warning = 'Multiple root nodes found, only one expected'
      } else if (isText(vnode)) {
        const text = getText(vnode) || ''

        if (COLLAPSIBLE_WHITESPACE_RE.test(text)) {
          warning = `Non-empty text node:\n'${text}'`
        }
      } else {
        warning = `Encountered unexpected ${getType(vnode)} VNode`
      }

      if (warning) {
        warn('extractSingleChild', warning)
        return true
      }
    }, SKIP_COMMENTS)
  }

  return node
}
