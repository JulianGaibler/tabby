import en from '@src/locales/en.yaml'
import {
  addMessages,
  getLocaleFromNavigator,
  init,
  register,
} from 'svelte-i18n'

addMessages('en', en)
register('pt-BR', () => import('@src/locales/pt-BR.yaml'))
register('pt-PT', () => import('@src/locales/pt-PT.yaml'))
register('de', () => import('@src/locales/de.yaml'))

function getLocale() {
  const system = getLocaleFromNavigator()
  if (!system) return 'en'
  // the system locale might return something like 'en-US' or 'de-DE' or 'pt-BR'
  // for german and english we want to return the language code only
  if (system.startsWith('de')) return 'de'
  if (system.startsWith('en')) return 'en'
  return system
}

init({
  fallbackLocale: 'en',
  initialLocale: getLocale(),
})
