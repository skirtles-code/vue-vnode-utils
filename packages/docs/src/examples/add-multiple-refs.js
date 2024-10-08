import { h, reactive } from 'vue'
import { addProps } from '@skirtle/vue-vnode-utils'

export default {
  setup(_, { slots }) {
    // This array will hold the top-level elements/components
    // rendered by the slot
    const childRefs = reactive([])

    let childCount

    return () => {
      childCount = 0

      const children = addProps(slots.default(), () => {
        const refIndex = childCount++

        return {
          ref: (item) => {
            if (item) {
              childRefs[refIndex] = item
            } else if (childRefs.length > childCount) {
              childRefs.length = childCount
            }
          }
        }
      })

      return [
        children,
        h('pre', [
          `outerHTML:\n`,
          childRefs.map(
            (el, i) => `${i}: ${el.outerHTML}`
          ).join('\n')
        ])
      ]
    }
  }
}
