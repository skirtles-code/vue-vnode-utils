import {
  Comment as CommentVNode,
  type Component,
  type ComponentOptions,
  Fragment as FragmentVNode,
  type FunctionalComponent,
  isVNode,
  Static as StaticVNode,
  Text as TextVNode,
  type VNode,
  type VNodeArrayChildren
} from 'vue'

export const isComment = (vnode: unknown): vnode is (null | undefined | boolean | (VNode & { type: typeof CommentVNode })) => {
  return getType(vnode) === 'comment'
}

export const isComponent = (vnode: unknown): vnode is (VNode & { type: Component }) => {
  return getType(vnode) === 'component'
}

export const isElement = (vnode: unknown): vnode is (VNode & { type: string }) => {
  return getType(vnode) === 'element'
}

export const isFragment = (vnode: unknown): vnode is ((VNode & { type: typeof FragmentVNode }) | VNodeArrayChildren) => {
  return getType(vnode) === 'fragment'
}

export const isFunctionalComponent = (vnode: unknown): vnode is (VNode & { type: FunctionalComponent }) => {
  return isComponent(vnode) && typeof vnode.type === 'function'
}

export const isStatefulComponent = (vnode: unknown): vnode is (VNode & { type: ComponentOptions }) => {
  return isComponent(vnode) && typeof vnode.type === 'object'
}

export const isStatic = (vnode: unknown): vnode is (VNode & { type: typeof StaticVNode }) => {
  return getType(vnode) === 'static'
}

export const isText = (vnode: unknown): vnode is (string | number | (VNode & { type: typeof TextVNode })) => {
  return getType(vnode) === 'text'
}

export const getText = (vnode: VNode | string | number): string | undefined => {
  if (typeof vnode === 'string') {
    return vnode
  }

  if (typeof vnode === 'number') {
    return String(vnode)
  }

  if (isVNode(vnode) && vnode.type === TextVNode) {
    return String(vnode.children)
  }

  return undefined
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
      if (type === FragmentVNode) {
        return 'fragment'
      } else if (type === TextVNode) {
        return 'text'
      } else if (type === CommentVNode) {
        return 'comment'
      } else if (type === StaticVNode) {
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
