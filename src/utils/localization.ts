import en from '@src/locales/en.yaml'
import {
  addMessages,
  getLocaleFromNavigator,
  init,
  register,
} from 'svelte-i18n'

addMessages('en', en)
register('pt-BR', () => import('@src/locales/pt_BR.yaml'))
register('pt-PT', () => import('@src/locales/pt_PT.yaml'))
register('de', () => import('@src/locales/de.yaml'))

init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator(),
})
