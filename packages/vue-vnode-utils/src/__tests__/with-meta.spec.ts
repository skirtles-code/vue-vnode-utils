import { describe, expect, it } from 'vitest'
import { COMPONENTS_AND_ELEMENTS, eachChild, everyChild, findChild, getText, isText, reduceChildren, someChild } from '../with-meta'
import { h, isVNode } from 'vue'

function getAllKeys(obj: object) {
  const keys: string[] = []

  for (const key in obj) {
    keys.push(key)
  }

  return keys
}

describe('someChild', () => {
  it('someChild - 39f9', () => {
    const startNodes = [h('div'), 'Some text', h('p')]

    let count = 0

    let out = someChild(startNodes, (node, meta) => {
      expect(isVNode(node)).toBe(true)

      let metaProperties = getAllKeys(meta)
      expect(metaProperties.includes('index')).toBe(true)
      expect(metaProperties.includes('length')).toBe(true)

      expect(meta.index).toBe(count)
      expect(meta.length).toBe(3)

      // `length` property should still be enumerable
      metaProperties = getAllKeys(meta)
      expect(metaProperties.includes('index')).toBe(true)
      expect(metaProperties.includes('length')).toBe(true)

      count++
      return false
    })

    expect(out).toBe(false)
    expect(count).toBe(3)

    count = 0

    out = someChild(startNodes, (node, meta) => {
      expect(isVNode(node)).toBe(true)
      expect(meta.index).toBe(count)
      expect(meta.length).toBe(2)
      count++
      return false
    }, COMPONENTS_AND_ELEMENTS)

    expect(out).toBe(false)
    expect(count).toBe(2)

    count = 0

    out = someChild(startNodes, (node, meta) => {
      expect(isVNode(node)).toBe(true)
      expect(meta.index).toBe(count)
      expect(meta.length).toBe(3)
      count++
      return count === 2
    })

    expect(out).toBe(true)
    expect(count).toBe(2)
  })
})

describe('everyChild', () => {
  it('everyChild - 1d78', () => {
    const startNodes = [h('div'), 'Some text', h('p')]

    let count = 0

    let out = everyChild(startNodes, (node, meta) => {
      expect(isVNode(node)).toBe(true)

      let metaProperties = getAllKeys(meta)
      expect(metaProperties.includes('index')).toBe(true)
      expect(metaProperties.includes('length')).toBe(true)

      expect(meta.index).toBe(count)
      expect(meta.length).toBe(3)

      // `length` property should still be enumerable
      metaProperties = getAllKeys(meta)
      expect(metaProperties.includes('index')).toBe(true)
      expect(metaProperties.includes('length')).toBe(true)

      count++
      return true
    })

    expect(out).toBe(true)
    expect(count).toBe(3)

    count = 0

    out = everyChild(startNodes, (node, meta) => {
      expect(isVNode(node)).toBe(true)
      expect(meta.index).toBe(count)
      expect(meta.length).toBe(2)
      count++
      return true
    }, COMPONENTS_AND_ELEMENTS)

    expect(out).toBe(true)
    expect(count).toBe(2)

    count = 0

    out = everyChild(startNodes, (node, meta) => {
      expect(isVNode(node)).toBe(true)
      expect(meta.index).toBe(count)
      expect(meta.length).toBe(3)
      count++
      return count !== 2
    })

    expect(out).toBe(false)
    expect(count).toBe(2)
  })
})

describe('eachChild', () => {
  it('eachChild - 2558', () => {
    const startNodes = [h('div'), 'Some text', h('p')]

    let count = 0

    let out = eachChild(startNodes, (node, meta) => {
      expect(isVNode(node)).toBe(true)

      let metaProperties = getAllKeys(meta)
      expect(metaProperties.includes('index')).toBe(true)
      expect(metaProperties.includes('length')).toBe(true)

      expect(meta.index).toBe(count)
      expect(meta.length).toBe(3)

      // `length` property should still be enumerable
      metaProperties = getAllKeys(meta)
      expect(metaProperties.includes('index')).toBe(true)
      expect(metaProperties.includes('length')).toBe(true)

      count++
      return !(count % 2)
    })

    expect(out).toBeUndefined()
    expect(count).toBe(3)

    count = 0

    out = eachChild(startNodes, (node, meta) => {
      expect(isVNode(node)).toBe(true)
      expect(meta.index).toBe(count)
      expect(meta.length).toBe(2)
      count++
      return count % 2
    }, COMPONENTS_AND_ELEMENTS)

    expect(out).toBeUndefined()
    expect(count).toBe(2)
  })
})

describe('findChild', () => {
  it('findChild - abc2', () => {
    const startNodes = [h('div'), 'Some text', h('p')]

    let count = 0

    let out = findChild(startNodes, (node, meta) => {
      expect(isVNode(node)).toBe(true)

      let metaProperties = getAllKeys(meta)
      expect(metaProperties.includes('index')).toBe(true)
      expect(metaProperties.includes('length')).toBe(true)

      expect(meta.index).toBe(count)
      expect(meta.length).toBe(3)

      // `length` property should still be enumerable
      metaProperties = getAllKeys(meta)
      expect(metaProperties.includes('index')).toBe(true)
      expect(metaProperties.includes('length')).toBe(true)

      count++
      return false
    })

    expect(out).toBeUndefined()
    expect(count).toBe(3)

    count = 0

    out = findChild(startNodes, (node, meta) => {
      expect(isVNode(node)).toBe(true)
      expect(meta.index).toBe(count)
      expect(meta.length).toBe(2)
      count++
      return false
    }, COMPONENTS_AND_ELEMENTS)

    expect(out).toBeUndefined()
    expect(count).toBe(2)

    count = 0

    out = findChild(startNodes, (node, meta) => {
      expect(isVNode(node)).toBe(true)
      expect(meta.index).toBe(count)
      expect(meta.length).toBe(3)
      count++
      return count === 2
    })

    expect(isText(out)).toBe(true)
    expect(count).toBe(2)
  })
})

describe('reduceChildren', () => {
  it('reduceChildren - 0ddb', () => {
    const startNodes = ['1', '2', '3']

    let count = 0

    let out = reduceChildren(startNodes, (acc, node, meta) => {
      expect(acc).toBe([0, 1, 3][count])
      expect(isVNode(node)).toBe(true)
      expect(getText(node)).toBe(String(count + 1))

      let metaProperties = getAllKeys(meta)
      expect(metaProperties.includes('index')).toBe(true)
      expect(metaProperties.includes('length')).toBe(true)

      expect(meta.index).toBe(count)
      expect(meta.length).toBe(3)

      // `length` property should still be enumerable
      metaProperties = getAllKeys(meta)
      expect(metaProperties.includes('index')).toBe(true)
      expect(metaProperties.includes('length')).toBe(true)

      count++
      return acc + count
    }, 0)

    expect(out).toBe(6)
    expect(count).toBe(3)

    count = 0

    out = reduceChildren([h('div'), 'Some text', h('p')], (acc, node, meta) => {
      expect(acc).toBe([0, 1][count])
      expect(isVNode(node)).toBe(true)
      expect(isText(node)).toBe(false)

      expect(meta.index).toBe(count)
      expect(meta.length).toBe(2)

      count++
      return acc + count
    }, 0, COMPONENTS_AND_ELEMENTS)

    expect(out).toBe(3)
    expect(count).toBe(2)
  })
})
