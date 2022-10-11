import { defineConfigWithTheme } from 'vitepress'
import path from 'path'

export default defineConfigWithTheme({
  base: '/vue-vnode-utils',
  title: '@skirtle/vue-vnode-utils',
  lang: 'en-US',
  description: 'VNode utilities for Vue',

  vite: {
    resolve: {
      alias: {
        '@skirtle/vue-vnode-utils': path.resolve(__dirname, '../../src/vue-vnode-utils.ts')
      }
    }
  },

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/skirtles-code/vue-vnode-utils' }
    ],

    nav: [
      { text: 'Guide', link: '/guide/introduction.html' }
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
      }
    ]
  }
})
