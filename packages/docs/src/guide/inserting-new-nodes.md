# Inserting new nodes

Adding extra nodes before or after slot contents is relatively easy and doesn't even need a render function. But inserting extra nodes between the slotted nodes is more difficult. Comment nodes from `v-if` typically need to be ignored and fragments coming from `v-for` make it quite difficult to figure out exactly what 'top-level' nodes exist. Further, the fragments tree is an important part of the VNode diffing algorithm, so flattening that tree can lose valuable information.

The `betweenChildren()` helper aims to make inserting nodes between children easier. This example inserts an `<hr>` between 'top-level' children:

```js
import { h } from 'vue'
import { betweenChildren } from '@skirtle/vue-vnode-utils'

// Inside a render function
const children = slots.default?.() || []

const newChildren = betweenChildren(children, (beforeVNode, afterVNode) => {
  return h('hr')
})
```

See it on the SFC Playground: [Composition API](https://play.vuejs.org/#eNp1U02PmzAQ/SsjeoBI4WNb9UJJ0u2e22MvpapImAR3wbZsQ1gh/nvHBjYN7SIOnueZN1/Pg/coZdS16KVepk+KSQMaTSv3OWeNFMrAAArPWziJRrYGSxjhrEQDPgX5r05PFavLJ3IRHLmZPaL4HrZ5KCTnJ8G1IcaWXHeWPviwWVBmsNGELvmCYAO7PXwtTBU1RR8k2/nMeOAYoq6oW9zCQ7LZEEsWT21QA2QQmawLg2QBZIwTJXRhI0qsd7nn4nMPzItEMnnbHFGRTdxkJvZU9HR6oOPEcN+QwwgtWbf/gmehMIvt+QZTMoItNzD6bW8zlf2GATiM4+y+Ct0/ng2qG5qtpklgFr/25229aRVhU8jotxacNjrYuHy+oMQpOMRin/UzU6bGmHYSdpwGEraG1c4p9ypjpE7juOXy+RLRKuK3/Kk8bdZghLoJj0pcNaqoxI7qyT2bmVodqdJ/ZXGT39/Cq/4vtgGOaK6I3PEopBnObm9V6VSHvYsu8Vy0NbHYgpzWg19b4tS1MBrGzTIjRVeKwyS/GQOSpRWp9f3+jeitUl0gteloDxEFHA7w4+d9xGkpdbcuPriRbedsVeBXyrdqXkjmYuiC5ODbck91oXUKviMO7Wtxw/RhpLc6U2+m4InEycwuYP1GtHmp7QOJVlRT00ehSlQpPMgetKhZCe+SJPlkr5pCXRgPjZApfJT9jPXhlZWmSuF9ksygLMqS8cviNVXgsnrjH3dnhfI=) | [Options API](https://play.vuejs.org/#eNp1U02PmzAQ/SsjWomsxFda9UJJ2u2e22MvpQcSnOAu2JY9JKyy+e8dm48k7AZx8DzPezMeP5+8R6WiQ8u81MvMVnOF61zwRkmN8FTxunySFAgmEHZaNuBH8S1syX4ucsE6RyrZrmhrhFMuALZjlkl7AGaiFjsHlg5QFlgsHsY8zbDVYoysVCswhc99fL4m2iotsnKqwZE15iI1if0ssIqaolskwbDmYoEVN5FTD2CZPDxcF8gF/Vk8DYYCklZ1gYwigIwLqgyHsJElq1e553RyD/BFMQpF22yYppgKUZjYVdHRaknLXuF2Hg4jtOSH9Q+2k5plsV1fYCpGsNUGTr896SBlv9MJBJxd85Q+o64fd8j0Bc1mV0lgFk/n8wKv90HYFCr6Z6Qgj7iJ5sMGFZ5GnnvfzTPXWLOYDBEeBA0kbJHXLin3KkRl0jhuhXre07ib+F4+tWdwDkbMNOFGy6NhOirZgfrJvfGKqNO3nnzP0Ceo4Dz4uLfttLFheGRMOB3NaIZD2r0u71qeyCXTF/NtpTAIppb4+xexDazAOe6jhQydxXG/RcR4fYU/f69Z27Gb1by/xUUwAKKu1lAt/Er71r83D4hgum8/oDNu68LQQ/SdbDi9TZ8e0lTK2f893xt8qa3poxm7P+dGajp1CkvVgZE1L+FDkiRf7VZT6D0XIUqVwhfVDVgXHnmJVQqfkmQAVVGWXOzHrL4DV9U7/we9MZOf)

The callback will be passed the two VNodes, allowing for conditional logic to decide what to insert between them. While the two nodes are considered adjacent from an iteration perspective, they may be in different fragments or have other nodes between them that have been skipped. By default, any comment VNodes will be ignored. The exact insertion position of any returned nodes is not guaranteed, only that it will be somewhere between the two nodes passed to the callback.

If the callback returns an array then the individual items will be inserted, it won't be treated as a fragment. Nested arrays will be treated as fragments. This is similar to passing children to `h()`. If the number of items being inserted is dynamic then wrapping them in a fragment can be a useful technique to ensure that VNodes get paired up correctly across re-renders. A fragment can also make it easier to assign suitable `key` values, as the children of a fragment are only eligible for pairing with each other.

`betweenChildren()` takes an optional third argument specifying [iteration options](/api.html#iterationoptions), much like with the [iterators](/guide/iterators.html). Unlike those iterators, the default value for `betweenChildren()` is `SKIP_COMMENTS`.
