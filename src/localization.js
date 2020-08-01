import Vue from 'vue'
import VueI18n from 'vue-i18n'
import defaultLanguage from '@/locales/en.yaml'
import { storageGet, storageSet, storageRemove } from '@/extensionApi'

Vue.use(VueI18n)

const loadedLanguages = ['en']
let currentLanguage = 'system'
let actualLanguage = 'en'

export const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en: defaultLanguage },
})

function _updateBundle(lang) {
  document.querySelector('html').setAttribute('lang', lang)
  i18n.locale = lang
  return lang
}

export function _setLanguage(lang, updateStorage = true) {
  // Check if same language
  if (currentLanguage === lang) {
    return
  }

  if (!lang || lang === 'system') {
    currentLanguage = 'system'
    const navigatorLanguage = navigator.language.replace(/-/g, "_")
    if (LANGUAGES_NOSTRIP.includes(navigatorLanguage)) {
      actualLanguage = navigatorLanguage
    } else {
      actualLanguage = /[^-]*/.exec(navigator.language)[0]
    }
    if (updateStorage) {
      storageRemove('language')
    }
  } else {
    currentLanguage = lang
    actualLanguage = lang
    if (updateStorage) {
      storageSet({ language: currentLanguage })
    }
  }

  if (!LANGUAGES_SUPPORTED.includes(actualLanguage)) {
    actualLanguage = 'en'
  }
  // If the language was already loaded
  if (loadedLanguages.includes(actualLanguage)) {
    return Promise.resolve(_updateBundle(actualLanguage))
  }

  // If the language hasn't been loaded yet
  return import(/* webpackChunkName: "lang-[request]" */ `@/locales/${actualLanguage}.yaml`).then(
    resource => {
      i18n.setLocaleMessage(actualLanguage, resource.default)
      loadedLanguages.push(actualLanguage)
      return _updateBundle(actualLanguage)
    },
  )
}

storageGet('language').then(value => {
  _setLanguage(value, false)
})

export const setLanguage = value => _setLanguage(value)
export const getLanguage = () => currentLanguage
export const getActualLanguage = () => actualLanguage
export const languageOptions = LANGUAGES_SUPPORTED

