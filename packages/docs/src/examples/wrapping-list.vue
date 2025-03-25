<script>
import { h } from 'vue'
import { replaceChildren } from '@skirtle/vue-vnode-utils'

export default {
  render() {
    const newChildren = replaceChildren(this.$slots.default(), (vnode) => {
      return h('div', { class: 'wrapper' }, [vnode])
    })

    return h('div', { class: 'list' }, newChildren)
  }
}
</script>

<style scoped>
.list {
  background: #777;
  border: 1px solid #777;
  border-radius: 5px;
  padding: 10px;
}

.wrapper {
  background: #eee;
  color: #444;
  padding: 2px 10px;
}

.wrapper + .wrapper {
  margin-top: 10px;
}
</style>
