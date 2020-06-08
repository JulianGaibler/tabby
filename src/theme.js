import { storageGet, storageSet, storageRemove } from '@/extensionApi'

const supportedThemes = ['light', 'dark']
const supportedIcons = ['eye-themed', 'face', 'face-themed']

let currentTheme = 'system'
let currentIcon = 'default'

storageGet('theme').then(value => {
  _setTheme(value, false)
})

storageGet('icon').then(value => {
  _setIcon(value, false)
})

function _updateAttribute() {
  if (currentTheme === 'system') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', currentTheme)
  }
}

function _setTheme(value, updateStorage = true) {
  if (supportedThemes.includes(value)) {
    currentTheme = value
    if (updateStorage) {
      storageSet({ theme: value })
    }
  } else {
    currentTheme = 'system'
    if (updateStorage) {
      storageRemove('theme')
    }
  }
  _updateAttribute()
}

function _setIcon(value, updateStorage = true) {
  if (supportedIcons.includes(value)) {
    currentIcon = value
    if (updateStorage) {
      storageSet({ icon: value })
    }
  } else {
    currentIcon = 'default'
    if (updateStorage) {
      storageRemove('icon')
    }
  }
  _updateAttribute()
}

export const setTheme = value => _setTheme(value)
export const getTheme = () => currentTheme
export const themeOptions = supportedThemes

export const setIcon = value => _setIcon(value)
export const getIcon = () => currentIcon
export const iconOptions = supportedIcons
