import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './styles.css'
import LiveExample from '../../components/live-example.vue'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('live-example', LiveExample)
  }
}

export default theme
