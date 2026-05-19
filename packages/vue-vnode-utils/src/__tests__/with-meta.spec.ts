import { describe, expect, it } from 'vitest'
import { h, isVNode, type VNode } from 'vue'
import {
  addProps,
  ALL_VNODES,
  betweenChildren,
  COMPONENTS_AND_ELEMENTS,
  eachChild,
  everyChild,
  findChild,
  getText,
  isElement,
  isText,
  reduceChildren,
  replaceChildren,
  someChild
} from '../with-meta'

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

describe('addProps', () => {
  it('addProps - 5ad7', () => {
    const startNodes = [h('div'), 'Some text', h('p')]

    let count = 0

    const nodes = addProps(startNodes, (node, meta) => {
      expect(isVNode(node)).toBe(true)
      expect(isElement(node)).toBe(true)

      let metaProperties = getAllKeys(meta)
      expect(metaProperties.includes('index')).toBe(true)
      expect(metaProperties.includes('length')).toBe(true)

      expect(meta.index).toBe(count)
      expect(meta.length).toBe(2)

      // `length` property should still be enumerable
      metaProperties = getAllKeys(meta)
      expect(metaProperties.includes('index')).toBe(true)
      expect(metaProperties.includes('length')).toBe(true)

      count++

      return {
        class: 'red'
      }
    })

    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(3)
    expect(count).toBe(2)

    const node = nodes[0] as VNode

    expect(isElement(node)).toBe(true)
    expect(node.type).toBe('div')
    expect(node.props?.class).toBe('red')

    count = 0

    const unchanged = addProps(startNodes, () => {
      ++count
    }, { component: true })

    expect(count).toBe(0)
    expect(unchanged).toBe(startNodes)
  })
})

describe('replaceChildren', () => {
  it('replaceChildren - 9c3c', () => {
    const startNodes = [h('div'), 'Some text', h('p')]

    let count = 0

    let nodes = replaceChildren(startNodes, (node, meta) => {
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

      if (count === 2) {
        return []
      }
    })

    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(2)
    expect(count).toBe(3)

    let node = nodes[0] as VNode
    expect(isElement(node)).toBe(true)
    expect(node.type).toBe('div')

    node = nodes[1] as VNode
    expect(isElement(node)).toBe(true)
    expect(node.type).toBe('p')

    count = 0

    nodes = replaceChildren(startNodes, (node, meta) => {
      expect(isVNode(node)).toBe(true)
      expect(isElement(node)).toBe(true)

      let metaProperties = getAllKeys(meta)
      expect(metaProperties.includes('index')).toBe(true)
      expect(metaProperties.includes('length')).toBe(true)

      expect(meta.index).toBe(count)
      expect(meta.length).toBe(2)

      // `length` property should still be enumerable
      metaProperties = getAllKeys(meta)
      expect(metaProperties.includes('index')).toBe(true)
      expect(metaProperties.includes('length')).toBe(true)

      count++

      if (count === 2) {
        return []
      }
    }, COMPONENTS_AND_ELEMENTS)

    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(2)
    expect(count).toBe(2)

    node = nodes[0] as VNode
    expect(isElement(node)).toBe(true)
    expect(node.type).toBe('div')

    node = nodes[1] as VNode
    expect(isText(node)).toBe(true)
    expect(getText(node)).toBe('Some text')

    count = 0

    nodes = replaceChildren([true, false, null], () => {
      ++count
    })

    expect(count).toBe(0)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(3)
  })
})

describe('betweenChildren', () => {
  it('betweenChildren - 719e', () => {
    const startNodes = [h('div'), 'Some text', h('p')]

    let count = 0

    let nodes = betweenChildren(startNodes, (prev, next, meta) => {
      expect(isVNode(prev)).toBe(true)
      expect(isVNode(next)).toBe(true)

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

      return String(count)
    })

    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(5)
    expect(count).toBe(2)

    let node = nodes[0] as VNode
    expect(isElement(node)).toBe(true)
    expect(node.type).toBe('div')

    node = nodes[1] as VNode
    expect(isText(node)).toBe(true)
    expect(getText(node)).toBe('1')

    node = nodes[2] as VNode
    expect(isText(node)).toBe(true)
    expect(getText(node)).toBe('Some text')

    node = nodes[3] as VNode
    expect(isText(node)).toBe(true)
    expect(getText(node)).toBe('2')

    node = nodes[4] as VNode
    expect(isElement(node)).toBe(true)
    expect(node.type).toBe('p')

    count = 0

    const comments = [true, false, null]

    nodes = betweenChildren(comments, () => {
      ++count
    })

    expect(count).toBe(0)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(3)

    nodes = betweenChildren(comments, () => {
      ++count
    }, ALL_VNODES)

    expect(count).toBe(2)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(3)
  })
})
