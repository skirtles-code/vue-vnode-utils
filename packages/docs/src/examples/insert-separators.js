import { h } from 'vue'
import { betweenChildren } from '@skirtle/vue-vnode-utils'

export default function InsertSeparators(_, { slots }) {
  return betweenChildren(slots.default(), () => h('hr'))
}
