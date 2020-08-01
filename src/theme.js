import { storageGet, storageSet, storageRemove } from '@/extensionApi'

const supportedThemes = ['light', 'dark']
const supportedAccentColors = ['blue', 'purple', 'pink', 'red', 'orange', 'yellow', 'green', 'grey']
const supportedIcons = ['eye-themed', 'face', 'face-themed']

const accentColors = { blue: ['#007AFF', '#1867BC'], purple: ['#953D96', '#783F79'], pink: ['#F74F9E', '#B74B7E'], red: ['#E0383E', '#A83C40'], orange: ['#F7821B', '#B76C2A'], yellow: ['#F1AB17', '#BB8F31'], green: ['#62BA46', '#579045'], grey: ['#989898', '#7A7A7A'] }

let currentTheme = 'system'
let currentAccentColor = 'blue'
let currentIcon = 'default'

const themeQuery = window.matchMedia('(prefers-color-scheme: dark)')
themeQuery.addListener(_updateAccentColor)

storageGet('theme').then(value => {
  _setTheme(value, false)
})

storageGet('accentColor').then(value => {
  _setAccentColor(value, false)
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

function _updateAccentColor() {
  const darkMode = themeQuery.matches ? 1 : 0
  document.documentElement.style.setProperty('--accent-color-light', accentColors[currentAccentColor][0])
  document.documentElement.style.setProperty('--accent-color', accentColors[currentAccentColor][darkMode])
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
  _updateAccentColor()
}

function _setAccentColor(value, updateStorage = true) {
  if (value === supportedAccentColors[0] || !supportedAccentColors.includes(value)) {
    value = supportedAccentColors[0]
    if (updateStorage) {
      if (updateStorage) storageRemove('accentColor')
    }
  } else if (updateStorage) {
    storageSet({ accentColor: value })
  }
  currentAccentColor = value
  _updateAccentColor()
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
}

export const setTheme = value => _setTheme(value)
export const getTheme = () => currentTheme
export const themeOptions = supportedThemes

export const setAccentColor = value => _setAccentColor(value)
export const getAccentColor = () => currentAccentColor
export const accentColorOptions = supportedAccentColors
export const accentColorMap = accentColors

export const setIcon = value => _setIcon(value)
export const getIcon = () => currentIcon
export const iconOptions = supportedIcons
