import { cloneVNode, h, ref } from 'vue'
import { extractSingleChild } from '@skirtle/vue-vnode-utils'

export default {
  setup(_, { slots }) {
    const rootRef = ref(null)

    return () => {
      const child = extractSingleChild(slots.default())

      // Pass `true` to avoid overriding any existing ref
      const clone = cloneVNode(child, { ref: rootRef }, true)

      return [
        clone,
        h('pre', `outerHTML: ${ rootRef.value?.outerHTML }`)
      ]
    }
  }
}
