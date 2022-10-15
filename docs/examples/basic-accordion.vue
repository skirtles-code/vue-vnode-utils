<script>
import { h, ref } from 'vue'
import { addProps } from '@skirtle/vue-vnode-utils'

export default {
  setup(_, { slots }) {
    const expandedPanel = ref(null)

    return () => {
      let count = 0

      const children = addProps(slots.default?.() ?? [], () => {
        const index = count++

        return {
          // Using the index is overly simplistic
          // but suffices for this example
          expanded: index === expandedPanel.value,
          'onUpdate:expanded': (expanded) => {
            if (expanded) {
              expandedPanel.value = index
            } else if (index === expandedPanel.value) {
              expandedPanel.value = null
            }
          }
        }
      })

      return h('div', { class : 'accordion' }, children)
    }
  }
}
</script>

<style scoped>
.accordion {
  background: #eee;
  border: 1px solid #ccc;
  color: #213547;
  display: flex;
  flex-direction: column;
  height: 300px;
  width: 240px;
}
</style>
