import { listenToThemeChange } from './utils/state-store'
import App from '@src/App.svelte'
import '@src/styles/global.sass'
import '@src/utils/localization'
import { mount } from 'svelte'

listenToThemeChange()

const app = mount(App, {
  target: document.body,
})

export default app
