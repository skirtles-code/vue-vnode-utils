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

See it on the SFC Playground: [Composition API](https://sfc.vuejs.org/#eNp1lE2P2jAQhv/KKD0kSPmiVS8pH93uuT320lRVIAPxbmJbthNYofz3jp0ESrYgDvbrmWc8Hl4u3pOUcdeil3krvVdMGtBoWrnJOWukUAYuoPAQwl40sjVYQg8HJRrwKcm/Bj1XrC6fKURw5GaMiJN72dahlJzvBdeGiC2Fri0++LSYVGaw0aRO9YJgAesNfC9MFTfFOUjDcc144AhxV9QthrBMFwuirJKhDWqANgSTdWGQdgArxgkJXdSIEut17rn83APzJpG2vG12qGhPbNqmdlWcabWk5UC4b8hppJas23zDg1C4Suz6JlMxki0bGH1tbyPKfi4X4ND3Y/gsdfN0MKhu6mr2miSukmt/XugNo4iaQsYvWnCa6MXm5eMBFc7AKVajUdh97lXGSJ0liT7s7XxedCzUMaFVrOhxWIMx6ibaKXHSqAice+HE+KpfmTI12uio4/SoUWtY7QrdwC2Xr8eYxpk8iqcWtZmLd2VL7O5LU3BCBx2qSCEvUdm5PW5nFvquJYulMfT0iu9/sjdr/GuK6v9GuMAOzQmROw4VvIY96t45As8uu8RD0dZEsRdyPgz+hMTUtTAa+sU0P0VHisNgjVEDsow1kI39+YPw1kUukZ7PYbcxJWy38Ov3fcZ+uup6fvngBgvHalXgV8q3Tpsg42XogH6qvr3uvi60zsB34Mg62T2mDz39j4zoxZA8QJwF7ADm/tXmrbbmjWeooemdUDTPDJbyDFrUrIQPaZp+sUdNoY6MR0bIDD7L86idoxMrTZXBxzQdRVmUJePHKWq4gavq9X8BjCK8dQ==) | [Options API](https://sfc.vuejs.org/#eNp1VE1z2jAQ/Ss7bmcMM/iDdnpxgTbNuT32Uvdg8IKV2JJGWgMZwn/PSgYDTmA4aJ9239Ou9HwIHrSOty0GWTCzKyM0LXIpGq0MwWMl6vJRcSBREqyNaiCMk1vYFYe5zCXufVGJ66KtCQ65BFids2zWATAgddhx4soByoKK0ficZ5BaI8+Ro2olZfC1i4/XhU6lJSx7DUHY2AtVT/a7oCpuiv0onZzWQo6oEjb27BOYpuPxtUAu+T9L+sFwwNS6Lgg5ApgJycqwjRpVYj3PA8+TB0AvGjmUbbNEwzELcZi6VbHn1ZSXHcPtPDzGaCm2i1+4VgZniVtfYBZj2HGD4L/r9ETlfocDSDj6w3P6oHTxsCY0F3Q2uEoGZ0nfXzAJuncQNYWOn6yS/Eb8RPPTBgv3I88DfgcuzoOKSNssSex65R7Hk42V2SS8ig0PRzQYo22ipVE7i4aJ84DvseP4aZ+FoRpddrSVPNSoJVF7oQtxK/Xzhq+sSe7lc4uWhuCNbInbW2lOTnhjiyYyKEs07t7utzNIfdfS+fnwFN/75SOzHaCC48ljnaX6jSXSDlF6Hhbs0+51f9eO3WkvxlgpaQlsrejvH662MAfvhs8OsjwjX/sj5orXV/j3/7pqdT7NfHi+0YVwAlw6X0A1CisTOm/dmJthfovhhHtc1YXlj0ToaaP+uxGyyXspb82PPGnppXaGjAfVXZ9LZbjrDKZ6D1bVooRPaZp+d1tNYTZCRqR0Bt/0/oTto50oqcrgS5qeQF2UpZCbc1Z3Aq8aHN8A8svKIg==)

The callback will be passed the two VNodes, allowing for conditional logic to decide what to insert between them. While the two nodes are considered adjacent from an iteration perspective, they may be in different fragments or have other nodes between them that have been skipped. By default, any comment VNodes will be ignored. The exact insertion position of any returned nodes is not guaranteed, only that it will be somewhere between the two nodes passed to the callback.

If the callback returns an array then the individual items will be inserted, it won't be treated as a fragment. Nested arrays will be treated as fragments. This is similar to passing children to `h()`. If the number of items being inserted is dynamic then wrapping them in a fragment can be a useful technique to ensure that VNodes get paired up correctly across re-renders. A fragment can also make it easier to assign suitable `key` values, as the children of a fragment are only eligible for pairing with each other.

`betweenChildren()` takes an optional third argument specifying [iteration options](/api.html#iterationoptions), much like with the [iterators](/guide/iterators.html). Unlike those iterators, the default value for `betweenChildren()` is `SKIP_COMMENTS`.
