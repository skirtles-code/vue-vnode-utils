import { fileURLToPath, URL } from 'node:url'

import { defineConfigWithTheme } from 'vitepress'

const versionsCache: Record<string, string> = {}

async function getPackageVersion(
  packageName: string,
  oldVersion: string | number
) {
  const majorVersion = String(oldVersion).replace(/\..*/, '')
  const packagePath = `${packageName}@${majorVersion}`

  if (!versionsCache[packagePath]) {
    const url = `https://unpkg.com/${packagePath}/package.json`
    console.log(`- Loading ${url}`)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to load ${url}, status code ${response.status}`)
    }

    const version = ((await response.json()) as { version: unknown })?.version

    if (!version || typeof version !== 'string') {
      throw new Error(
        `Failed to load version for ${packageName}, version ${version}`
      )
    }

    versionsCache[packagePath] = version
    console.log(`- Loaded ${packageName}@${version}`)
  }

  return versionsCache[packagePath]
}

export default ({ mode }: { mode: string }) => defineConfigWithTheme({
  srcDir: './src',
  outDir: './dist',
  base: '/vue-vnode-utils/',
  title: '@skirtle/vue-vnode-utils',
  lang: 'en-US',
  description: 'VNode utilities for Vue',

  sitemap: {
    hostname: 'https://skirtles-code.github.io/vue-vnode-utils/'
  },

  transformHead({ page }) {
    if (page !== '404.md') {
      const canonicalUrl = `https://skirtles-code.github.io/vue-vnode-utils/${page}`
        .replace(/index\.md$/, '')
        .replace(/\.md$/, '.html')

      return [['link', { rel: 'canonical', href: canonicalUrl }]]
    }
  },

  async transformPageData(pageData) {
    if (mode !== 'production') {
      return
    }

    const { packageVersions } = pageData.frontmatter

    if (packageVersions) {
      console.log(
        `Updating frontmatter package versions for ${pageData.filePath}`
      )

      for (const pkg in packageVersions) {
        packageVersions[pkg] = await getPackageVersion(
          pkg,
          packageVersions[pkg]
        )
      }
    }
  },

  vite: {
    resolve: {
      alias: {
        '@skirtle/vue-vnode-utils': fileURLToPath(new URL('../../vue-vnode-utils/src/', import.meta.url))
      }
    },

    define: {
      __DEV__: mode !== 'production'
    }
  },

  themeConfig: {
    search: {
      provider: 'local'
    },

    nav: [
      { text: 'Guide', link: '/guide/introduction.html' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/skirtles-code/vue-vnode-utils' }
    ],

    sidebar: [
      {
        text: 'Getting started',
        items: [
          {
            text: 'What is vue-vnode-utils?',
            link: '/guide/introduction.html'
          }, {
            text: 'Installation',
            link: '/guide/installation.html'
          }
        ]
      }, {
        text: 'Guide',
        items: [
          {
            text: 'Iterators',
            link: '/guide/iterators.html'
          }, {
            text: 'Adding props',
            link: '/guide/adding-props.html'
          }, {
            text: 'Inserting new nodes',
            link: '/guide/inserting-new-nodes.html'
          }, {
            text: 'Replacing nodes',
            link: '/guide/replacing-nodes.html'
          }, {
            text: 'Checking the VNode type',
            link: '/guide/checking-the-vnode-type.html'
          }, {
            text: 'Other helpers',
            link: '/guide/other-helpers.html'
          }, {
            text: 'With meta',
            link: '/guide/with-meta.html'
          }
        ]
      }, {
        text: 'Reference',
        items: [
          {
            text: 'Examples',
            link: '/examples.html'
          }, {
            text: 'API',
            link: '/api.html'
          }
        ]
      }, {
        text: 'Appendices',
        items: [
          {
            text: 'Some notes on VNodes',
            link: '/guide/some-notes-on-vnodes.html'
          }, {
            text: 'VNode manipulation and components',
            link: '/guide/vnode-manipulation-and-components.html'
          }
        ]
      }
    ]
  }
})
