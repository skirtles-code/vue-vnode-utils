---
# Updated automatically in production builds: see the VitePress config.
packageVersions:
  vue: 3.5.34
  '@skirtle/vue-vnode-utils': 0.3.0
---
# With meta <Badge text="0.3+" />

There are alternative versions of the iterator functions, with added support for accessing extra metadata for the current node.

Currently, this metadata just includes the iteration index and length.

To use this metadata you'll need to import the functions from `@skirtle/vue-vnode-utils/with-meta` rather than `@skirtle/vue-vnode-utils`.

## Accessing meta from callbacks

The meta is passed in an object as the final argument of the callback for each iterator.

The `length` property is a number and should be equivalent to calling [`countChildren()`](/other-helpers.html#counting-children). It will use the same iteration options as the iterator, so if you're skipping nodes then those nodes won't be included in the `length`. For most iterators, the `length` is the number of times the callback will be called during the iteration.

The `index` is zero-based, counting up to `length - 1`.

The `length` is calculated lazily, so if it isn't accessed the nodes won't be counted.

[`betweenChildren()`](./inserting-new-nodes) behaves a little differently. The `index` will still start at zero, but it will only count up to `length - 2`. The `length` will still reflect the number of nodes, like it would for the other iterators, but that won't match the number of calls to the callback.

## Example

```js
import { h } from 'vue'
import { addProps } from '@skirtle/vue-vnode-utils/with-meta'

export default function AddStripes(_, { slots }) {
  const children = addProps(slots.default(), (vnode, { index, length }) => {
    return {
      class: [
        index % 2 ? 'odd' : 'even',
        {
          first: index === 0,
          last: index === length - 1
        }
      ]
    }
  })

  return h('div', children)
}
```

See it on the SFC Playground: [Composition API](https://play.vuejs.org/#eNqFVFtr2zAU/isHw4gDid3u8uI1u9KHDbaVdW/zGG504qiVJSPJaUrIf98n2bm0tJ0JROf26Vy+o03ysW2zVcdJkZy5uZWtJ8e+a9+VWjatsZ42ZHkxoblp2s6zoC0trGlohKDR3umjEJce0ewGa5YfVNm1g2ep50Y7D6BOe5oF1PTNeKeVnhsH7e6aNB3T7B19q/wya6p1ejIZzlKnESFbVarjCZ2ejMdAOcv77JE3BIC1qvIMiehMakDSatoYwWpWJjG+TMjftQxRd80VW8jAhngSTtUap1Mce4RDLVGGRsgVEBfGBgCS+IUCBv/wbTakabsd3HP491BHfYHiLN+nmkySvpnTpmrRMqMxk02IKQcD4AuKmqD74G6k9YpzDGK60qht2nmpXH4r/XLasK+Ce5ksvW9dkeedbm/qDP3Nn4wU0vlD+ENzxq6ZXllz69hmglfIsUxCNihyi+zvDRy57/mzfJwzG6qEuLCmdXv7/2uKROJ1BBC8qDrladHpuZdGH7Ew/TsBvlPGA3zcN22g31IqYVmDa7vr0+iHkiJcOp5QGu8OEFILXk9Isa496oikHEZgsSdW7yTgq8q5gn7vZOqD6QW9pPc0MkKMqKARr1iPJgenfXz4FtI6XwyBs9mMTo48iXDDPeuQ1pROD14D5Yj+9Icob7Ei4X/IeZmOQMgRtnroBszwwxC9Q5sWsn5AwLCWUrH90YZG3ydipZS5/Rp13mIld/r5kuc3vX5RKXcwXLt1T80Ly+DSistkb/OVrRnLGcznl995jfPeiAXuFLyfMf5kZxQ4Y3Tv9qnTAnkf+cV0v0QKSl3/cudrz9rtqgoVxIZF/zIBET8/U/sh3VfZ66NdcP5OYQ/mLixC1laiD8FB4NICr1a7fht7XuosDn3HUWVsgTEJWAnvkK2lnnrTPggJRLgXUVtmvTeDa731qprf1BbvnShIyXrp7ziUH8EfTybQ84nYKzy4j0cm238hNxSj) | [Options API](https://play.vuejs.org/#eNqFVNtu2zAM/RXCwBAH8CXd5SVLunVDHzZgW7HubR4Gx2JsNbJkSHLqIsi/j/ItTtF2gYGIInl4O9TBu6qqaF+jt/RWJtO8speJ5GWltIUrxm4tXaGBrVYlzKL4dBXdmVkiE4lNa8twm9bCwiGRAJkiAInSmmV3ARMsJx8D5wrAUpv688FGo621HCQHU0u7hHedfJw6ugi1RTbic4ulOUGNYN9SW0Rl2viLoD9z6duCm6hFD+BiMZ9PAySSvlU89oIEgq5EapEkgBWXFBn2YakYinXitTiJB/ahQhJlXW5Qk0yBSFy4U9rQ6YKOHcKpF61MN4zvCXGrtAMATp8rp7d3v8MBJBzbDMk8JvsOajIQuljFk1S9wOvmGJZpRdNSkmbctifpFRRg7F/ifTQ7rq3AmNgQ7iVVF9aWCxPfc1uEJdrUmSdeYW1llnFcy2qXUxfL+FlPxo09uT9WR2jKcKPVvUEdMdxTjok3zICyP+Ma5d6z8gAFHHtCEiKRcFSkjN1oVZlR//+anuLwtpaZ5UpOSOv/DQjfCGUJvGdZpqSxkBVcMI0S1mN4v7Wjklo4fx6A38Z2EFwybAIQKHNLdcxhffks/UVqaIF+DzKR3DnDK3gNH2CmGJvBEma4RzmjtRiMRn/323JtaIU6x/V6DYuJJQBFONP2aYVwcbLqSQfwZ7omtDPuv8+58GdEyVkwdoPUZEdDtIbatOX5IwK6/eUC9Y/KNfqciKkQ6v5re2d1jX3C5FNgtuvut6kwJ8WdaTpq3mgkLu0x8UadTXWOtJ5OfX37HRs6j0pa4VqQ9QvKn2iUIM4o2Zl9qiWjvCd2bbpfWgpymf8y141FaYaqXAXDw+WsiYifX6j9lO6b6O1kF4x9ELQHmXGLEFUp61zowCjokl6xqnnf9jyRUTv0gaNC6SWNiZEW6CXSOZehVdUjF0eEM49cI8pRTVzrtJs02+WaXjx6eQXPC/uArvwW/OlkHD2f8d2IGp/29I7/AH7AK5M=)

## Accessing the `with-meta` iterators

Metadata isn't included in the default iterators, to avoid the added overhead. You'll need to use alternative versions of the iterators to get the metadata.

### With a bundler

If you're using a bundler then you just need to change `@skirtle/vue-vnode-utils` to `@skirtle/vue-vnode-utils/with-meta` in your imports to get access to the metadata:

```js
import { addProps } from '@skirtle/vue-vnode-utils/with-meta'
```

All exports from `@skirtle/vue-vnode-utils` are re-exported by `@skirtle/vue-vnode-utils/with-meta`, even those that don't include meta. You can also mix `@skirtle/vue-vnode-utils` and `@skirtle/vue-vnode-utils/with-meta` and functions will be tree-shaken across the two packages.

### CDN - global build

To use meta with a global build, add `with-meta` to the path:

```html-vue
<script src="https://unpkg.com/@skirtle/vue-vnode-utils@{{ $frontmatter.packageVersions['@skirtle/vue-vnode-utils'] }}/dist/with-meta/vue-vnode-utils.global.dev.js"></script>
```

The global variable is called `VueVNodeUtils`, the same as with the normal build. You wouldn't load both in the same project.

### CDN - ES module build

Similar to the global build, you need to add `with-meta` to the path:

```html-vue
<script type="importmap">
{
  "imports": {
    "vue": "https://unpkg.com/vue@{{ $frontmatter.packageVersions.vue }}/dist/vue.esm-browser.js",
    "@skirtle/vue-vnode-utils/with-meta": "https://unpkg.com/@skirtle/vue-vnode-utils@{{ $frontmatter.packageVersions['@skirtle/vue-vnode-utils'] }}/dist/with-meta/vue-vnode-utils.esm-browser.dev.js"
  }
}
</script>
<script type="module">
import { addProps } from '@skirtle/vue-vnode-utils/with-meta'
// ...
</script>
```

The `with-meta` module includes a copy of everything it needs, you don't need to include `@skirtle/vue-vnode-utils` in the import map.

The package name is usually arbitrary, though using `@skirtle/vue-vnode-utils/with-meta` is recommended unless you have a good reason to use an alternative.
