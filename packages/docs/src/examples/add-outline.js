import { h } from 'vue'
import { addProps } from '@skirtle/vue-vnode-utils'

export default function AddOutline(_, { slots }) {
  const children = addProps(slots.default(), () => {
    return {
      class: 'child-outline'
    }
  })

  return h('div', children)
}
