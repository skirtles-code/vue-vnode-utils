import type { App } from 'vue'
import DefaultTheme from 'vitepress/theme'
import LiveExample from '../../components/live-example.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    app.component('live-example', LiveExample)
  }
}
