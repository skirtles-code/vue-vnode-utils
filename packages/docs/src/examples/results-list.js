import { h } from 'vue'
import { isEmpty } from '@skirtle/vue-vnode-utils'

export default function ResultsList(_, { slots }) {
  const children = slots.default()

  if (isEmpty(children)) {
    return h('div', 'No results')
  }

  return h('ul', children)
}
