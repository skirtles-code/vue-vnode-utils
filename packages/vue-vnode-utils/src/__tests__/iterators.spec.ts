import { describe, expect, it } from 'vitest'
import {
  Comment,
  type Component,
  createCommentVNode,
  createStaticVNode,
  createVNode,
  createTextVNode,
  Fragment,
  h,
  isVNode,
  ref,
  Text,
  type VNode,
  type VNodeArrayChildren,
  type VNodeChild
} from 'vue'
import {
  getText,
  isComment,
  isComponent,
  isElement,
  isFragment,
  isText
} from '../base'
import {
  addProps,
  ALL_VNODES,
  betweenChildren,
  COMPONENTS_AND_ELEMENTS,
  eachChild,
  everyChild,
  extractSingleChild,
  findChild,
  isEmpty,
  reduceChildren,
  replaceChildren,
  SKIP_COMMENTS,
  someChild
} from '../iterators'

type TreeNode = string | number | null | undefined | boolean | [string | typeof Fragment | Component, (Record<string, any> | null)?, TreeNode[]?]

function createTree(root: TreeNode): VNode {
  if (root == null || typeof root === 'boolean') {
    return createCommentVNode()
  }

  if (typeof root === 'string' || typeof root === 'number') {
    return createTextVNode(String(root))
  }

  const [type, props, children] = root

  const childVNodes = children && children.map(child => {
    return createTree(child)
  })

  return createVNode(type, props, childVNodes)
}

function toVNode(node: VNodeChild): VNode {
  if (isVNode(node)) {
    return node
  }

  if (Array.isArray(node)) {
    return createVNode(Fragment, null, node)
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return createTextVNode(String(node))
  }

  return createCommentVNode()
}

function compareChildren(vnodes: VNodeArrayChildren, expectation: VNodeArrayChildren) {
  expect(vnodes).toHaveLength(expectation.length)

  for (let index = 0; index < Math.min(vnodes.length, expectation.length); ++index) {
    compareNode(toVNode(vnodes[index]), toVNode(expectation[index]))
  }
}

function compareNode(vnode: VNode, expectation: VNode) {
  switch (typeof expectation.type) {
    case 'symbol':
    case 'string':
      expect(vnode.type).toBe(expectation.type)
      break
    case 'object':
      expect(vnode.type).toMatchObject(expectation.type)
      break
    case 'function':
      expect(vnode.type).toBeTypeOf('function')
      expect(vnode.type.toString()).toBe(expectation.type.toString())
      break
    default:
      throw new Error(`Unexpected vnode type: ${typeof expectation.type}`)
  }

  if (expectation.props == null) {
    expect(vnode.props == null).toBe(true)
  } else {
    expect(vnode.props).toMatchObject(expectation.props)
  }

  if (expectation.type === Comment) {
    return
  }

  if (expectation.type === Text) {
    expect(vnode.children).toBe(expectation.children)
    return
  }

  if (expectation.children == null) {
    expect(vnode.children == null).toBe(true)
    return
  } else {
    expect(vnode.children == null).toBe(false)
  }

  compareChildren([].concat(vnode.children as any), [].concat(expectation.children as any))
}

describe('addProps', () => {
  it('addProps - 0836', () => {
    let count = 0

    const startNode = h('div')
    const startNodes = [startNode]

    const nodes = addProps(startNodes, (vnode) => {
      count++
      expect(isElement(vnode)).toBe(true)
      expect(vnode.type).toBe('div')
      expect(vnode.props).toBe(null)

      return {
        class: 'red'
      }
    })

    expect(count).toBe(1)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(1)

    const node = nodes[0] as VNode

    expect(isElement(node)).toBe(true)
    expect(node.type).toBe('div')
    expect(node.props?.class).toBe('red')

    expect(startNodes).toHaveLength(1)
    expect(startNodes[0]).toBe(startNode)
    expect(startNode.props).toBe(null)
  })

  it('addProps - f9c9', () => {
    let count = 0

    const divNode = h('div')
    const childNodes = [divNode]
    const fragNode = createVNode(Fragment, null, childNodes)
    const startNodes = [fragNode]

    const nodes = addProps(startNodes, (vnode) => {
      count++
      expect(isElement(vnode)).toBe(true)
      expect(vnode.type).toBe('div')
      expect(vnode.props).toBe(null)

      return {
        class: 'red'
      }
    })

    expect(count).toBe(1)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(1)

    const node = nodes[0] as VNode

    expect(isFragment(node)).toBe(true)
    expect(Array.isArray(node.children)).toBe(true)
    expect(node.children).toHaveLength(1)

    const child = (node.children as VNode[])[0]

    expect(isElement(child)).toBe(true)
    expect(child.type).toBe('div')
    expect(child.props?.class).toBe('red')

    expect(startNodes).toHaveLength(1)
    expect(startNodes[0]).toBe(fragNode)
    expect(fragNode.props).toBe(null)
    expect(fragNode.children).toHaveLength(1)
    expect((fragNode.children as VNodeArrayChildren)[0]).toBe(divNode)
    expect(divNode.props).toBe(null)
  })

  it('addProps - 3de9', () => {
    const calledFor: VNode[] = []

    const startNodes = [
      createTree([
        Fragment, null, [
          'text node',
          ['div', { class: 'bold', attribute: 'value' }],
          [Fragment, null, [
            ['span', {}, ['more text']]
          ]]
        ]
      ]),
      createTree([
        Fragment, null, [
          null,
          [{ template: 'abc' }, { class: 'dark' }]
        ]
      ])
    ]

    const nodes = addProps(startNodes, (vnode) => {
      calledFor.push(vnode)

      return {
        class: 'red'
      }
    })

    expect(calledFor).toHaveLength(3)
    expect(calledFor.every(node => isVNode(node))).toBe(true)
    expect(calledFor[0].type).toBe('div')
    expect(calledFor[1].type).toBe('span')
    expect((calledFor[2].type as any).template).toBe('abc')

    compareChildren(nodes, [
      [
        'text node',
        h('div', { class: 'bold red', attribute: 'value' }),
        [
          h('span', { class: 'red' }, 'more text')
        ]
      ], [
        null,
        h({ template: 'abc' }, { class: 'dark red' })
      ]
    ])

    compareChildren(startNodes, [
      [
        'text node',
        h('div', { class: 'bold', attribute: 'value' }),
        [
          h('span', {}, 'more text')
        ]
      ], [
        null,
        h({ template: 'abc' }, { class: 'dark' })
      ]
    ])
  })

  it('addProps - 8983', () => {
    const calledFor: VNode[] = []

    const getStartNodes = () => {
      return [
        [
          'Text',
          false,
          true,
          null,
          undefined,
          h('p'),
          h({ template: 'abc' }),
          h(() => 'hi'),
          11
        ],
        'More text',
        false,
        true,
        null,
        undefined,
        h('div'),
        h({ template: 'def' }),
        h(() => 'bye'),
        12
      ]
    }

    const startNodes = getStartNodes()

    const nodes = addProps(startNodes, (vnode) => {
      calledFor.push(vnode)

      return {
        class: 'red'
      }
    })

    expect(calledFor).toHaveLength(6)
    expect(calledFor.every(node => isVNode(node))).toBe(true)
    expect(calledFor[0].type).toBe('p')
    expect(calledFor[1].type).toMatchObject({ template: 'abc' })
    expect(calledFor[2].type).toBeTypeOf('function')
    expect((calledFor[2].type as () => string)()).toBe('hi')
    expect(calledFor[3].type).toBe('div')
    expect(calledFor[4].type).toMatchObject({ template: 'def' })
    expect(calledFor[5].type).toBeTypeOf('function')
    expect((calledFor[5].type as () => string)()).toBe('bye')

    compareChildren(nodes, [
      [
        'Text',
        false,
        true,
        null,
        undefined,
        h('p', { class: 'red' }),
        h({ template: 'abc' }, { class: 'red' }),
        h(() => 'hi', { class: 'red' }),
        11
      ],
      'More text',
      false,
      true,
      null,
      undefined,
      h('div', { class: 'red' }),
      h({ template: 'def' }, { class: 'red' }),
      h(() => 'bye', { class: 'red' }),
      12
    ])

    compareChildren(startNodes, getStartNodes())
  })

  it('addProps - 8983', () => {
    const startNodes = [h('div'), h('span', { class: 'red' })]
    const referenceNodes = [h('div'), h('span', { class: 'red' })]

    const undefinedNodes = addProps(startNodes, () => undefined)
    const nullNodes = addProps(startNodes, () => null)
    const emptyNodes = addProps(startNodes, () => ({}))

    compareChildren(startNodes, referenceNodes)
    compareChildren(undefinedNodes, referenceNodes)
    compareChildren(nullNodes, referenceNodes)
    compareChildren(emptyNodes, referenceNodes)

    expect(undefinedNodes).toBe(startNodes)
    expect(nullNodes).toBe(startNodes)
    expect(emptyNodes).toBe(startNodes)
  })

  it('addProps - a934', () => {
    let count = 0

    const Component = {}
    const startNodes = [h('div'), h(Component), [h('div'), h(Component)]]

    let nodes = addProps(startNodes, (vnode) => {
      count++
      expect(isElement(vnode)).toBe(true)

      return {
        class: 'red'
      }
    }, { element: true })

    expect(count).toBe(2)

    expect(nodes).toHaveLength(3)
    expect((nodes[0] as VNode).props?.class).toBe('red')
    expect((nodes[1] as VNode).props?.class).toBe(undefined)

    count = 0

    nodes = addProps(startNodes, (vnode) => {
      count++
      expect(isComponent(vnode)).toBe(true)

      return {
        class: 'red'
      }
    }, { component: true })

    expect(count).toBe(2)

    expect(nodes).toHaveLength(3)
    expect((nodes[0] as VNode).props?.class).toBe(undefined)
    expect((nodes[1] as VNode).props?.class).toBe('red')
  })

  it('addProps - 510f', () => {
    let count = 0

    const spanNode = h('span')
    const fragment = [spanNode]
    const startNodes = [h('div'), fragment]

    const nodes = addProps(startNodes, (vnode) => {
      count++

      if (vnode.type === 'div') {
        return {
          class: 'red'
        }
      }
    })

    expect(count).toBe(2)

    expect(nodes).toHaveLength(2)
    expect((nodes[0] as VNode).props?.class).toBe('red')
    expect(nodes[1]).toBe(fragment)
    expect(fragment).toHaveLength(1)
    expect(fragment[0]).toBe(spanNode)
    expect(spanNode.props).toBe(null)
  })

  it('addProps - 8259', () => {
    let count = 0

    const spanRef = ref()
    const otherRef = ref()
    const spanNode = h('span', { ref: spanRef, class: 'bold', style: 'color: red' })
    const startNodes = [spanNode]

    const nodes = addProps(startNodes, () => {
      count++

      return {
        ref: otherRef,
        class: 'large',
        style: 'line-height: 1'
      }
    })

    expect(count).toBe(1)

    expect(nodes).toHaveLength(1)

    const newNode = nodes[0] as VNode
    const props = newNode.props

    expect(props?.class).toBe('bold large')
    expect(props?.style.color).toBe('red')
    expect(props?.style['line-height']).toBe('1')

    const mergedRef = newNode.ref

    expect(Array.isArray(mergedRef)).toBe(true)
    expect(mergedRef).toHaveLength(2)

    // Keep TS happy...
    if (Array.isArray(mergedRef)) {
      const refs = mergedRef.map(({ r }) => r)

      expect(refs.includes(spanRef)).toBe(true)
      expect(refs.includes(otherRef)).toBe(true)
    }
  })
})

describe('replaceChildren', () => {
  it('replaceChildren - 4f8f', () => {
    let count = 0

    const startNode = h('div')
    const startNodes = [startNode]

    const nodes = replaceChildren(startNodes, (vnode) => {
      count++
      expect(isElement(vnode)).toBe(true)
      expect(vnode.type).toBe('div')
      expect(vnode.props).toBe(null)

      // This should leave the div in place
      return undefined
    })

    expect(count).toBe(1)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(1)
    expect(nodes).toBe(startNodes)

    compareChildren(startNodes, [h('div')])
  })

  it('replaceChildren - 7c8a', () => {
    let count = 0

    const startNode = h('div')
    const startNodes = [startNode]

    const nodes = replaceChildren(startNodes, (vnode) => {
      count++
      expect(isElement(vnode)).toBe(true)
      expect(vnode.type).toBe('div')
      expect(vnode.props).toBe(null)

      // This should remove the node
      return []
    })

    expect(count).toBe(1)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(0)

    compareChildren(startNodes, [h('div')])
    expect(startNodes[0]).toBe(startNode)
  })

  it('replaceChildren - 1d16', () => {
    let count = 0

    const startNode = h('div')
    const startNodes = [startNode]

    const nodes = replaceChildren(startNodes, (vnode) => {
      count++
      expect(isElement(vnode)).toBe(true)
      expect(vnode.type).toBe('div')
      expect(vnode.props).toBe(null)

      return h('span')
    })

    expect(count).toBe(1)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(1)

    compareChildren(startNodes, [h('div')])
    compareChildren(nodes, [h('span')])
  })

  it('replaceChildren - 3538', () => {
    let count = 0

    const startNode = h('div')
    const startNodes = [startNode]

    const nodes = replaceChildren(startNodes, (vnode) => {
      count++
      expect(isElement(vnode)).toBe(true)
      expect(vnode.type).toBe('div')
      expect(vnode.props).toBe(null)

      return [h('span', 'First'), h('span', 'Second')]
    })

    expect(count).toBe(1)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(2)

    compareChildren(startNodes, [h('div')])
    compareChildren(nodes, [h('span', null, 'First'), h('span', null, 'Second')])
  })

  it('replaceChildren - 5233', () => {
    let count = 0

    const startNodes = [
      createTree([
        Fragment, null, [
          'text node',
          ['div', { class: 'bold', attribute: 'value' }],
          [Fragment, null, [
            ['span', {}, ['more text']]
          ]]
        ]
      ]),
      createTree([
        Fragment, null, [
          null,
          [{ template: 'abc' }, { class: 'dark' }]
        ]
      ])
    ]

    const nodes = replaceChildren(startNodes, (vnode) => {
      count++

      return h('section', null, [vnode])
    })

    expect(count).toBe(4)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(2)

    compareChildren(startNodes, [
      [
        'text node',
        h('div', { class: 'bold', attribute: 'value' }),
        [
          h('span', {}, ['more text'])
        ]
      ], [
        null,
        h({ template: 'abc' }, { class: 'dark' })
      ]
    ])

    compareChildren(nodes, [
      [
        h('section', null, 'text node'),
        h('section', null, h('div', { class: 'bold', attribute: 'value' })),
        [
          h('section', null, h('span', {}, ['more text']))
        ]
      ], [
        null,
        h('section', null, h({ template: 'abc' }, { class: 'dark' }))
      ]
    ])
  })

  it('replaceChildren - afc8', () => {
    let count = 0

    const startNodes = [h('div'), 'Text', [h('span'), 'More text']]

    // Wrap text nodes in parentheses
    const nodes = replaceChildren(startNodes, (vnode) => {
      count++
      expect(isText(vnode)).toBe(true)

      return `(${getText(vnode)})`
    }, { text: true })

    expect(count).toBe(2)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(3)

    compareChildren(startNodes, [h('div'), 'Text', [h('span'), 'More text']])
    compareChildren(nodes, [h('div'), '(Text)', [h('span'), '(More text)']])
  })

  it('replaceChildren - e076', () => {
    let count = 0

    const startNodes = ['Text']

    const nodes = replaceChildren(startNodes, () => {
      count++
    })

    expect(count).toBe(1)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(1)
    expect(isVNode(nodes[0])).toBe(true)

    expect(startNodes).toHaveLength(1)
    expect(startNodes[0]).toBe('Text')

    // Do the same thing with a text VNode
    const startVNodes = [createTextVNode('Text')]

    count = 0

    const nodesOut = replaceChildren(startVNodes, () => {
      count++
    })

    expect(count).toBe(1)
    expect(nodesOut).toBe(startVNodes)
    expect(nodesOut).toHaveLength(1)
  })
})

describe('betweenChildren', () => {
  it('betweenChildren - e627', () => {
    let count = 0

    const startNode = h('div')
    const startNodes = [startNode]

    const nodes = betweenChildren(startNodes, () => {
      count++
    })

    expect(count).toBe(0)
    expect(nodes).toBe(startNodes)

    expect(startNodes).toHaveLength(1)
    expect(startNodes[0]).toBe(startNode)
    expect(startNode.type).toBe('div')
    expect(startNode.props).toBe(null)
  })

  it('betweenChildren - 1e4b', () => {
    let count = 0

    const startNodes = [h('div'), h('span')]

    const nodes = betweenChildren(startNodes, (before, after) => {
      count++

      expect(isElement(before)).toBe(true)
      expect(before.type).toBe('div')
      expect(before.props).toBe(null)

      expect(isElement(after)).toBe(true)
      expect(after.type).toBe('span')
      expect(after.props).toBe(null)

      // returning nothing should change nothing
    })

    expect(count).toBe(1)
    expect(nodes).toBe(startNodes)

    compareChildren(startNodes, [h('div'), h('span')])
  })

  it('betweenChildren - da27', () => {
    let count = 0

    const startNodes = [h('div'), h('span')]

    const nodes = betweenChildren(startNodes, (before, after) => {
      count++

      expect(isElement(before)).toBe(true)
      expect(before.type).toBe('div')
      expect(before.props).toBe(null)

      expect(isElement(after)).toBe(true)
      expect(after.type).toBe('span')
      expect(after.props).toBe(null)

      // returning an empty array should change nothing
      return []
    })

    expect(count).toBe(1)
    expect(nodes).toBe(startNodes)

    compareChildren(startNodes, [h('div'), h('span')])
  })

  it('betweenChildren - 22dd', () => {
    let count = 0

    const startNodes = [h('div'), h('span')]

    const nodes = betweenChildren(startNodes, (before, after) => {
      count++

      expect(isElement(before)).toBe(true)
      expect(before.type).toBe('div')
      expect(before.props).toBe(null)

      expect(isElement(after)).toBe(true)
      expect(after.type).toBe('span')
      expect(after.props).toBe(null)

      return h('p')
    })

    expect(count).toBe(1)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(3)

    compareChildren(nodes, [h('div'), h('p'), h('span')])
    compareChildren(startNodes, [h('div'), h('span')])
  })

  it('betweenChildren - c9b6', () => {
    let count = 0

    const startNodes = [h('div'), h('span')]

    const nodes = betweenChildren(startNodes, (before, after) => {
      count++

      expect(isElement(before)).toBe(true)
      expect(before.type).toBe('div')
      expect(before.props).toBe(null)

      expect(isElement(after)).toBe(true)
      expect(after.type).toBe('span')
      expect(after.props).toBe(null)

      return ['hello', h('strong', 'world')]
    })

    expect(count).toBe(1)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(4)

    compareChildren(nodes, [h('div'), 'hello', h('strong', null, ['world']), h('span')])
    compareChildren(startNodes, [h('div'), h('span')])
  })

  it('betweenChildren - fbea', () => {
    let count = 0

    const getStartNodes = () => {
      return [
        h('div'),
        'some text',
        true,
        h('span'),
        1234,
        false,
        h({ template: 'abc' }),
        null,
        h(() => 'def')
      ]
    }

    const startNodes = getStartNodes()

    const nodes = betweenChildren(startNodes, (before, after) => {
      count++

      expect(isVNode(before)).toBe(true)
      expect(isVNode(after)).toBe(true)

      return h('hr')
    })

    expect(count).toBe(5)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(14)

    compareChildren(startNodes, getStartNodes())

    // The exact placement of the <hr> nodes relative to the comment nodes could vary
    compareChildren(nodes, [
      h('div'),
      h('hr'),
      'some text',
      true,
      h('hr'),
      h('span'),
      h('hr'),
      1234,
      false,
      h('hr'),
      h({ template: 'abc' }),
      null,
      h('hr'),
      h(() => 'def')
    ])
  })

  it('betweenChildren - dfd8', () => {
    let count = 0

    const getStartNodes = () => {
      return [
        h('div'),
        'some text',
        true,
        h('span'),
        1234,
        false,
        h({ template: 'abc' }),
        null,
        h(() => 'def')
      ]
    }

    const startNodes = getStartNodes()

    const nodes = betweenChildren(startNodes, (before, after) => {
      count++

      expect(isVNode(before)).toBe(true)
      expect(isVNode(after)).toBe(true)

      return h('hr')
    }, {
      element: true,
      component: true,
      text: true,
      comment: true
    })

    expect(count).toBe(8)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(17)

    compareChildren(startNodes, getStartNodes())

    // The exact placement of the <hr> nodes relative to the comment nodes could vary
    compareChildren(nodes, [
      h('div'),
      h('hr'),
      'some text',
      h('hr'),
      true,
      h('hr'),
      h('span'),
      h('hr'),
      1234,
      h('hr'),
      false,
      h('hr'),
      h({ template: 'abc' }),
      h('hr'),
      null,
      h('hr'),
      h(() => 'def')
    ])
  })

  it('betweenChildren - c8d9', () => {
    let count = 0

    const getStartNodes = () => {
      return [
        h('div'),
        h('span'),
        'some text',
        1234,
        true,
        false,
        h({ template: 'abc' }),
        h(() => 'def')
      ]
    }

    const startNodes = getStartNodes()

    const nodes = betweenChildren(startNodes, (before, after) => {
      count++

      expect(isVNode(before)).toBe(true)
      expect(isVNode(after)).toBe(true)

      expect(before.type).toBe('div')
      expect(after.type).toBe('span')

      return h('hr')
    }, {
      element: true
    })

    expect(count).toBe(1)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(9)

    compareChildren(startNodes, getStartNodes())

    compareChildren(nodes, [
      h('div'),
      h('hr'),
      h('span'),
      'some text',
      1234,
      true,
      false,
      h({ template: 'abc' }),
      h(() => 'def')
    ])
  })

  it('betweenChildren - 5ebb', () => {
    let count = 0

    const getStartNodes = () => {
      return [
        h('div'),
        h('span'),
        'some text',
        1234,
        true,
        false,
        h({ template: 'abc' }),
        h(() => 'def')
      ]
    }

    const startNodes = getStartNodes()

    const nodes = betweenChildren(startNodes, (before, after) => {
      count++

      expect(isVNode(before)).toBe(true)
      expect(isVNode(after)).toBe(true)

      expect(before.type).toMatchObject({ template: 'abc' })
      expect(after.type).toBeTypeOf('function')

      return [h({ template: 'ghi' }), h({ template: 'jkl' })]
    }, {
      component: true
    })

    expect(count).toBe(1)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(10)

    compareChildren(startNodes, getStartNodes())

    compareChildren(nodes, [
      h('div'),
      h('span'),
      'some text',
      1234,
      true,
      false,
      h({ template: 'abc' }),
      h({ template: 'ghi' }),
      h({ template: 'jkl' }),
      h(() => 'def')
    ])
  })

  it('betweenChildren - d4c0', () => {
    let count = 0

    const getStartNodes = () => {
      return [
        h('div'),
        h('span'),
        'some text',
        1234,
        true,
        false,
        h({ template: 'abc' }),
        h(() => 'def')
      ]
    }

    const startNodes = getStartNodes()

    const nodes = betweenChildren(startNodes, (before, after) => {
      count++

      expect(isVNode(before)).toBe(true)
      expect(isVNode(after)).toBe(true)

      expect(isText(before)).toBe(true)
      expect(isText(after)).toBe(true)

      expect(getText(before)).toBe('some text')
      expect(getText(after)).toBe('1234')

      return ['hello', 24]
    }, {
      text: true
    })

    expect(count).toBe(1)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(10)

    compareChildren(startNodes, getStartNodes())

    compareChildren(nodes, [
      h('div'),
      h('span'),
      'some text',
      'hello',
      24,
      1234,
      true,
      false,
      h({ template: 'abc' }),
      h(() => 'def')
    ])
  })

  it('betweenChildren - b4e5', () => {
    let count = 0

    const getStartNodes = () => {
      return [
        h('div'),
        h('span'),
        'some text',
        1234,
        true,
        false,
        h({ template: 'abc' }),
        h(() => 'def')
      ]
    }

    const startNodes = getStartNodes()

    const nodes = betweenChildren(startNodes, (before, after) => {
      count++

      expect(isVNode(before)).toBe(true)
      expect(isVNode(after)).toBe(true)

      expect(isComment(before)).toBe(true)
      expect(isComment(after)).toBe(true)

      return [null, null]
    }, {
      comment: true
    })

    expect(count).toBe(1)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(10)

    compareChildren(startNodes, getStartNodes())

    compareChildren(nodes, [
      h('div'),
      h('span'),
      'some text',
      1234,
      true,
      null,
      null,
      false,
      h({ template: 'abc' }),
      h(() => 'def')
    ])
  })

  it('betweenChildren - 9f66', () => {
    let count = 0

    const getStartNodes = () => {
      return [
        createCommentVNode('a'),
        createCommentVNode('b')
      ]
    }

    const startNodes = getStartNodes()

    const nodes = betweenChildren(startNodes, (before, after) => {
      count++

      expect(isVNode(before)).toBe(true)
      expect(isVNode(after)).toBe(true)

      expect(isComment(before)).toBe(true)
      expect(isComment(after)).toBe(true)

      expect(before.children).toBe('a')
      expect(after.children).toBe('b')

      return createCommentVNode('c')
    }, {
      comment: true
    })

    expect(count).toBe(1)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(3)

    compareChildren(startNodes, getStartNodes())

    expect(isComment(nodes[0])).toBe(true)
    expect(isComment(nodes[1])).toBe(true)
    expect(isComment(nodes[2])).toBe(true)

    expect((nodes[0] as VNode).children).toBe('a')
    expect((nodes[1] as VNode).children).toBe('c')
    expect((nodes[2] as VNode).children).toBe('b')
  })

  it('betweenChildren - bf52', () => {
    let count = 0

    const getStartNodes = () => {
      return [
        h('div'),
        [
          'some text',
          [
            h('span'),
            h('p')
          ],
          h('a'),
          [
            'text',
            [
              h('strong')
            ]
          ]
        ]
      ]
    }

    const startNodes = getStartNodes()

    const nodes = betweenChildren(startNodes, (before, after) => {
      count++

      expect(isVNode(before)).toBe(true)
      expect(isVNode(after)).toBe(true)

      return h('hr')
    })

    expect(count).toBe(6)
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes).toHaveLength(2)

    compareChildren(startNodes, getStartNodes())

    // The exact positioning of the <hr> nodes can vary, but the order must be correct
    compareChildren(nodes, [
      h('div'),
      [
        h('hr'),
        'some text',
        [
          h('hr'),
          h('span'),
          h('hr'),
          h('p')
        ],
        h('hr'),
        h('a'),
        [
          h('hr'),
          'text',
          [
            h('hr'),
            h('strong')
          ]
        ]
      ]
    ])
  })

  it('betweenChildren - 2bea', () => {
    let count = 0

    const startNodes = [['Text'], [createTextVNode('Text')]]

    const nodes = betweenChildren(startNodes, (before, after) => {
      count++

      expect(isVNode(before)).toBe(true)
      expect(isVNode(after)).toBe(true)

      expect(getText(before)).toBe('Text')
      expect(getText(after)).toBe('Text')
    })

    expect(count).toBe(1)

    expect(nodes).toHaveLength(2)
    expect(Array.isArray(nodes[0])).toBe(true)
    expect(nodes[0]).toHaveLength(1)
    expect(isVNode((nodes[0] as VNodeArrayChildren)[0])).toBe(true)
    expect(nodes[1]).toBe(startNodes[1])

    expect(startNodes[0][0]).toBe('Text')
  })
})

describe('someChild', () => {
  it('someChild - c88e', () => {
    const startNodes = [h('div'), h('span'), 'Some text']

    let count = 0

    let out = someChild(startNodes, node => {
      expect(isVNode(node)).toBe(true)
      count++
      return false
    })

    expect(out).toBe(false)
    expect(count).toBe(3)

    count = 0

    out = someChild(startNodes, node => {
      count++
      return isText(node)
    })

    expect(out).toBe(true)
    expect(count).toBe(3)

    count = 0

    out = someChild(startNodes, node => {
      count++
      return node.type === 'span'
    })

    expect(out).toBe(true)
    expect(count).toBe(2)
  })

  it('someChild - 59bf', () => {
    const startNodes = ['Text', [h('div'), h('span')], h('p')].map(toVNode)

    const calledFor: VNode[] = []

    let out = someChild(startNodes, node => {
      expect(isVNode(node)).toBe(true)
      calledFor.push(node)
      return false
    })

    expect(out).toBe(false)
    expect(calledFor).toHaveLength(4)
    expect(calledFor[0]).toBe(startNodes[0])
    expect(calledFor[1]).toBe((startNodes[1].children as VNode[])[0])
    expect(calledFor[2]).toBe((startNodes[1].children as VNode[])[1])
    expect(calledFor[3]).toBe(startNodes[2])

    calledFor.length = 0

    out = someChild(startNodes, node => {
      expect(isVNode(node)).toBe(true)
      calledFor.push(node)
      return node.type === 'span'
    })

    expect(out).toBe(true)
    expect(calledFor).toHaveLength(3)
    expect(calledFor[0]).toBe(startNodes[0])
    expect(calledFor[1]).toBe((startNodes[1].children as VNode[])[0])
    expect(calledFor[2]).toBe((startNodes[1].children as VNode[])[1])

    calledFor.length = 0

    out = someChild(startNodes, node => {
      expect(isVNode(node)).toBe(true)
      calledFor.push(node)
      return isElement(node)
    })

    expect(out).toBe(true)
    expect(calledFor).toHaveLength(2)
    expect(calledFor[0]).toBe(startNodes[0])
    expect(calledFor[1]).toBe((startNodes[1].children as VNode[])[0])
  })

  it('someChild - 1fac', () => {
    const Component = {}
    const startNodes = ['Text', [h('div'), h('span'), null, 'More', h(Component)], h('p')].map(toVNode)

    const calledFor: VNode[] = []

    someChild(startNodes, node => {
      expect(isVNode(node)).toBe(true)
      calledFor.push(node)
      return false
    }, ALL_VNODES)

    expect(calledFor).toHaveLength(7)

    calledFor.length = 0

    someChild(startNodes, node => {
      expect(isVNode(node)).toBe(true)
      calledFor.push(node)
      return false
    }, SKIP_COMMENTS)

    expect(calledFor).toHaveLength(6)

    calledFor.length = 0

    someChild(startNodes, node => {
      expect(isVNode(node)).toBe(true)
      calledFor.push(node)
      return false
    }, COMPONENTS_AND_ELEMENTS)

    expect(calledFor).toHaveLength(4)

    calledFor.length = 0

    someChild(startNodes, node => {
      expect(isVNode(node)).toBe(true)
      calledFor.push(node)
      return false
    }, { component: true })

    expect(calledFor).toHaveLength(1)

    calledFor.length = 0

    someChild(startNodes, node => {
      expect(isVNode(node)).toBe(true)
      calledFor.push(node)
      return false
    }, {})

    expect(calledFor).toHaveLength(0)

    calledFor.length = 0

    someChild(startNodes, node => {
      expect(isVNode(node)).toBe(true)
      calledFor.push(node)
      return false
    }, { comment: true })

    expect(calledFor).toHaveLength(1)

    calledFor.length = 0

    someChild(startNodes, node => {
      expect(isVNode(node)).toBe(true)
      calledFor.push(node)
      return false
    }, { text: true })

    expect(calledFor).toHaveLength(2)

    calledFor.length = 0

    someChild(startNodes, node => {
      expect(isVNode(node)).toBe(true)
      calledFor.push(node)
      return false
    }, { element: true })

    expect(calledFor).toHaveLength(3)
  })
})

describe('everyChild', () => {
  it('everyChild - 7796', () => {
    const startNodes = [h('a'), [[h('div')], [h('span')]], h('p')].map(toVNode)

    const calledFor: VNode[] = []

    let out = everyChild(startNodes, node => {
      expect(isVNode(node)).toBe(true)
      calledFor.push(node)
      return true
    })

    expect(out).toBe(true)
    expect(calledFor).toHaveLength(4)
    expect(calledFor[0].type).toBe('a')
    expect(calledFor[1].type).toBe('div')
    expect(calledFor[2].type).toBe('span')
    expect(calledFor[3].type).toBe('p')

    calledFor.length = 0

    out = everyChild(startNodes, node => {
      expect(isVNode(node)).toBe(true)
      calledFor.push(node)
      return node.type === 'a'
    })

    expect(out).toBe(false)
    expect(calledFor).toHaveLength(2)
    expect(calledFor[0].type).toBe('a')
    expect(calledFor[1].type).toBe('div')
  })
})

describe('eachChild', () => {
  it('eachChild - b963', () => {
    const startNodes = [null, [['Text'], [h('span')]], h('p')].map(toVNode)

    const calledFor: VNode[] = []

    const out = eachChild(startNodes, node => {
      expect(isVNode(node)).toBe(true)
      calledFor.push(node)

      // This should be ignored
      return isElement(node)
    })

    expect(out).toBe(undefined)
    expect(calledFor).toHaveLength(4)
    expect(calledFor[0]).toBe(startNodes[0])
    expect(isText(calledFor[1]) && getText(calledFor[1])).toBe('Text')
    expect(calledFor[2].type).toBe('span')
    expect(calledFor[3].type).toBe('p')
  })
})

describe('findChild', () => {
  it('findChild - b371', () => {
    const startNodes = [null, [['Text'], [h('span')]], h('p')].map(toVNode)

    const calledFor: VNode[] = []

    let out = findChild(startNodes, node => {
      expect(isVNode(node)).toBe(true)
      calledFor.push(node)
      return false
    })

    expect(out).toBe(undefined)
    expect(calledFor).toHaveLength(4)
    expect(calledFor[0]).toBe(startNodes[0])
    expect(isText(calledFor[1]) && getText(calledFor[1])).toBe('Text')
    expect(calledFor[2].type).toBe('span')
    expect(calledFor[3].type).toBe('p')

    calledFor.length = 0

    out = findChild(startNodes, node => {
      expect(isVNode(node)).toBe(true)
      calledFor.push(node)
      return isElement(node)
    })

    expect(out?.type).toBe('span')
    expect(calledFor).toHaveLength(3)
    expect(calledFor[0]).toBe(startNodes[0])
    expect(isText(calledFor[1]) && getText(calledFor[1])).toBe('Text')
    expect(calledFor[2].type).toBe('span')
  })
})

describe('reduceChildren', () => {
  it('reduceChildren - 0c8b', () => {
    const startNodes = [h('p'), h({}), [false, 'text', h('span')]].map(toVNode)

    const calledFor: VNode[] = []

    let length = reduceChildren(startNodes, (value, vnode) => {
      calledFor.push(vnode)
      return value + 1
    }, 0)

    expect(length).toBe(5)
    expect(calledFor).toHaveLength(5)
    expect(calledFor[0]).toBe(startNodes[0])
    expect(isComponent(calledFor[1])).toBe(true)
    expect(isComment(calledFor[2])).toBe(true)
    expect(isText(calledFor[3]) && getText(calledFor[3])).toBe('text')
    expect(calledFor[4].type).toBe('span')

    calledFor.length = 0

    length = reduceChildren(startNodes, (value, vnode) => {
      calledFor.push(vnode)
      return value + 1
    }, 0, COMPONENTS_AND_ELEMENTS)

    expect(length).toBe(3)
    expect(calledFor).toHaveLength(3)
    expect(calledFor[0]).toBe(startNodes[0])
    expect(isComponent(calledFor[1])).toBe(true)
    expect(calledFor[2].type).toBe('span')
  })
})

describe('isEmpty', () => {
  it('isEmpty - 819a', () => {
    expect(isEmpty([])).toBe(true)
    expect(isEmpty(['Text'])).toBe(false)
    expect(isEmpty([' '])).toBe(true)
    expect(isEmpty([' A '])).toBe(false)
    expect(isEmpty(['\n\t\r'])).toBe(true)
    expect(isEmpty(['\u00a0'])).toBe(false)
    expect(isEmpty([null, false, true])).toBe(true)
    expect(isEmpty([h('div')])).toBe(false)
    expect(isEmpty([h({ template: 'abc' })])).toBe(false)
    expect(isEmpty([h(() => 'hi')])).toBe(false)

    expect(isEmpty([[]])).toBe(true)
    expect(isEmpty([['']])).toBe(true)
    expect(isEmpty([[[[' \n\r\t  ']]]])).toBe(true)
    expect(isEmpty([' ', [null, [true, [], false], '\n\n'], [], '    \t'])).toBe(true)
    expect(isEmpty([[[[[' ']]], h('div')]])).toBe(false)
  })
})

describe('extractSingleChild', () => {
  it('extractSingleChild - b6b3', () => {
    const node = h('div')

    const out = extractSingleChild([node])

    expect(out).toBe(node)
  })

  it('extractSingleChild - 610e', () => {
    const node = h('div')

    const out = extractSingleChild([node, h('span')])

    expect(out).toBe(node)
  })

  it('extractSingleChild - 3c0a', () => {
    const node = h('div')

    const out = extractSingleChild(['Some text', node, 'Other text'])

    expect(out).toBe(node)
  })

  it('extractSingleChild - 23c8', () => {
    const node = h('div')

    const out = extractSingleChild([' ', [null, true, false, [node]]])

    expect(out).toBe(node)
  })

  it('extractSingleChild - d06c', () => {
    const node = h('div')
    const staticNode = createStaticVNode('<div>Some content</div>', 1)

    const out = extractSingleChild([staticNode, node])

    expect(out).toBe(node)
  })
})
