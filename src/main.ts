import App from '@src/App.svelte'
import '@src/styles/global.sass'
import '@src/utils/localization'
import { listenToThemeChange } from './utils/state-store'

listenToThemeChange()

const app = new App({
  target: document.body,
})

export default app
