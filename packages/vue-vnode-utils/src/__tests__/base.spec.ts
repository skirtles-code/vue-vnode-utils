import { describe, expect, it } from 'vitest'
import {
  createCommentVNode,
  createStaticVNode,
  createVNode,
  createTextVNode,
  defineAsyncComponent,
  Fragment,
  h,
  Text
} from 'vue'
import {
  getText,
  getType,
  isComment,
  isComponent,
  isElement,
  isFragment,
  isFunctionalComponent,
  isStatefulComponent,
  isStatic,
  isText
} from '../base'

describe('isComment', () => {
  it('isComment - 194a', () => {
    expect(isComment(undefined)).toBe(true)
    expect(isComment(null)).toBe(true)
    expect(isComment(false)).toBe(true)
    expect(isComment(true)).toBe(true)
    expect(isComment(createCommentVNode('Text'))).toBe(true)

    expect(isComment('')).toBe(false)
    expect(isComment(0)).toBe(false)
    expect(isComment(NaN)).toBe(false)
    expect(isComment(0n)).toBe(false)
    expect(isComment(createTextVNode('Text'))).toBe(false)
    expect(isComment({})).toBe(false)
    expect(isComment([])).toBe(false)
  })
})

describe('isComponent', () => {
  it('isComponent - b049', () => {
    expect(isComponent(h({}))).toBe(true)
    expect(isComponent(h(() => null))).toBe(true)
    expect(isComponent(h(defineAsyncComponent(() => Promise.resolve({}))))).toBe(true)

    expect(isComponent(h('div'))).toBe(false)
    expect(isComponent(createTextVNode('Text'))).toBe(false)
    expect(isComponent(createCommentVNode('Text'))).toBe(false)
    expect(isComponent('')).toBe(false)
    expect(isComponent({})).toBe(false)
    expect(isComponent([])).toBe(false)
    expect(isComponent(null)).toBe(false)
    expect(isComponent(undefined)).toBe(false)
    expect(isComponent(false)).toBe(false)
    expect(isComponent(true)).toBe(false)
    expect(isComponent(0)).toBe(false)
    expect(isComponent(7)).toBe(false)
  })
})

describe('isFunctionalComponent', () => {
  it('isFunctionalComponent - 1af7', () => {
    expect(isFunctionalComponent(h(() => null))).toBe(true)

    expect(isFunctionalComponent(h({}))).toBe(false)
    expect(isFunctionalComponent(h(defineAsyncComponent(() => Promise.resolve({}))))).toBe(false)
    expect(isFunctionalComponent(h('div'))).toBe(false)
    expect(isFunctionalComponent(createTextVNode('Text'))).toBe(false)
    expect(isFunctionalComponent(createCommentVNode('Text'))).toBe(false)
    expect(isFunctionalComponent('')).toBe(false)
    expect(isFunctionalComponent({})).toBe(false)
    expect(isFunctionalComponent([])).toBe(false)
    expect(isFunctionalComponent(null)).toBe(false)
    expect(isFunctionalComponent(undefined)).toBe(false)
    expect(isFunctionalComponent(false)).toBe(false)
    expect(isFunctionalComponent(true)).toBe(false)
    expect(isFunctionalComponent(0)).toBe(false)
    expect(isFunctionalComponent(7)).toBe(false)
  })
})

describe('isStatefulComponent', () => {
  it('isStatefulComponent - ecee', () => {
    expect(isStatefulComponent(h({}))).toBe(true)
    expect(isStatefulComponent(h(defineAsyncComponent(() => Promise.resolve({}))))).toBe(true)

    expect(isStatefulComponent(h(() => null))).toBe(false)
    expect(isStatefulComponent(h('div'))).toBe(false)
    expect(isStatefulComponent(createTextVNode('Text'))).toBe(false)
    expect(isStatefulComponent(createCommentVNode('Text'))).toBe(false)
    expect(isStatefulComponent('')).toBe(false)
    expect(isStatefulComponent({})).toBe(false)
    expect(isStatefulComponent([])).toBe(false)
    expect(isStatefulComponent(null)).toBe(false)
    expect(isStatefulComponent(undefined)).toBe(false)
    expect(isStatefulComponent(false)).toBe(false)
    expect(isStatefulComponent(true)).toBe(false)
    expect(isStatefulComponent(0)).toBe(false)
    expect(isStatefulComponent(7)).toBe(false)
  })
})

describe('isElement', () => {
  it('isElement - aa0d', () => {
    expect(isElement(h('div'))).toBe(true)

    expect(isElement(h({}))).toBe(false)
    expect(isElement(h(() => null))).toBe(false)
    expect(isElement(h(defineAsyncComponent(() => Promise.resolve({}))))).toBe(false)
    expect(isElement(createTextVNode('Text'))).toBe(false)
    expect(isElement(createCommentVNode('Text'))).toBe(false)
    expect(isElement(createVNode(Fragment, null, [h('div')]))).toBe(false)
    expect(isElement('')).toBe(false)
    expect(isElement('string')).toBe(false)
    expect(isElement({})).toBe(false)
    expect(isElement([])).toBe(false)
    expect(isElement(null)).toBe(false)
    expect(isElement(undefined)).toBe(false)
    expect(isElement(false)).toBe(false)
    expect(isElement(true)).toBe(false)
    expect(isElement(0)).toBe(false)
    expect(isElement(7)).toBe(false)
  })
})

describe('isFragment', () => {
  it('isFragment - d88b', () => {
    expect(isFragment([])).toBe(true)
    expect(isFragment(createVNode(Fragment, null, []))).toBe(true)

    expect(isFragment(h({}))).toBe(false)
    expect(isFragment(h(() => null))).toBe(false)
    expect(isFragment(h(defineAsyncComponent(() => Promise.resolve({}))))).toBe(false)
    expect(isFragment(h('div'))).toBe(false)
    expect(isFragment(h('div', null, []))).toBe(false)
    expect(isFragment(createTextVNode('Text'))).toBe(false)
    expect(isFragment(createCommentVNode('Text'))).toBe(false)
    expect(isFragment('')).toBe(false)
    expect(isFragment('string')).toBe(false)
    expect(isFragment({})).toBe(false)
    expect(isFragment(null)).toBe(false)
    expect(isFragment(undefined)).toBe(false)
    expect(isFragment(false)).toBe(false)
    expect(isFragment(true)).toBe(false)
    expect(isFragment(0)).toBe(false)
    expect(isFragment(7)).toBe(false)
  })
})

describe('isText', () => {
  it('isText - 7952', () => {
    expect(isText('')).toBe(true)
    expect(isText('string')).toBe(true)
    expect(isText(0)).toBe(true)
    expect(isText(7)).toBe(true)
    expect(isText(createTextVNode('Text'))).toBe(true)

    expect(isText(h({}))).toBe(false)
    expect(isText(h(() => null))).toBe(false)
    expect(isText(h(defineAsyncComponent(() => Promise.resolve({}))))).toBe(false)
    expect(isText(h('div'))).toBe(false)
    expect(isText(h('div', null, []))).toBe(false)
    expect(isText(createCommentVNode('Text'))).toBe(false)
    expect(isText(createVNode(Fragment, null, []))).toBe(false)
    expect(isText({})).toBe(false)
    expect(isText([])).toBe(false)
    expect(isText(null)).toBe(false)
    expect(isText(undefined)).toBe(false)
    expect(isText(false)).toBe(false)
    expect(isText(true)).toBe(false)
  })
})

describe('isStatic', () => {
  it('isStatic - aabf', () => {
    expect(isStatic(createStaticVNode('<div></div>', 1))).toBe(true)

    expect(isStatic(h({}))).toBe(false)
    expect(isStatic(h(() => null))).toBe(false)
    expect(isStatic(h(defineAsyncComponent(() => Promise.resolve({}))))).toBe(false)
    expect(isStatic(h('div'))).toBe(false)
    expect(isStatic(h('div', null, []))).toBe(false)
    expect(isStatic(createTextVNode('Text'))).toBe(false)
    expect(isStatic(createCommentVNode('Text'))).toBe(false)
    expect(isStatic(createVNode(Fragment, null, []))).toBe(false)
    expect(isStatic('')).toBe(false)
    expect(isStatic('string')).toBe(false)
    expect(isStatic({})).toBe(false)
    expect(isStatic([])).toBe(false)
    expect(isStatic(null)).toBe(false)
    expect(isStatic(undefined)).toBe(false)
    expect(isStatic(false)).toBe(false)
    expect(isStatic(true)).toBe(false)
    expect(isStatic(0)).toBe(false)
    expect(isStatic(7)).toBe(false)
  })
})

describe('getText', () => {
  it('getText - 50eb', () => {
    expect(getText('')).toBe('')
    expect(getText('Text')).toBe('Text')
    expect(getText(0)).toBe('0')
    expect(getText(7)).toBe('7')
    expect(getText(createTextVNode('Text'))).toBe('Text')

    expect(getText(null as any)).toBe(undefined)
    expect(getText(undefined as any)).toBe(undefined)
    expect(getText({} as any)).toBe(undefined)
    expect(getText([] as any)).toBe(undefined)
    expect(getText(true as any)).toBe(undefined)
    expect(getText(false as any)).toBe(undefined)
    expect(getText(h('div'))).toBe(undefined)
    expect(getText(h({}))).toBe(undefined)
  })
})

describe('getType', () => {
  it('getType - ba43', () => {
    expect(getType(h({}))).toBe('component')
    expect(getType(h(() => null))).toBe('component')
    expect(getType(h(defineAsyncComponent(() => Promise.resolve({}))))).toBe('component')
    expect(getType(h('div'))).toBe('element')
    expect(getType(h('div', null, []))).toBe('element')
    expect(getType(createTextVNode('Text'))).toBe('text')
    expect(getType(createCommentVNode('Text'))).toBe('comment')
    expect(getType(createVNode(Fragment, null, []))).toBe('fragment')
    expect(getType(createStaticVNode('<div></div>', 1))).toBe('static')
    expect(getType('')).toBe('text')
    expect(getType('string')).toBe('text')
    expect(getType({})).toBe(undefined)
    expect(getType([])).toBe('fragment')
    expect(getType(null)).toBe('comment')
    expect(getType(undefined)).toBe('comment')
    expect(getType(false)).toBe('comment')
    expect(getType(true)).toBe('comment')
    expect(getType(0)).toBe('text')
    expect(getType(7)).toBe('text')
    expect(getType(Fragment)).toBe(undefined)
    expect(getType(Text)).toBe(undefined)
  })
})
