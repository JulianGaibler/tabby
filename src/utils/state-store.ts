import {
  thisBrowser,
  storageGet,
  storageSet,
  storageRemove,
} from './extension-api'
import { writable } from 'svelte/store'

export const PREFS_KEY = 'tabby_preferences'
const CURRENT_VERSION = __VERSION__

interface Preferences {
  theme: 'system' | 'light' | 'dark'
  showOverview: boolean
  lastVersion: string
  showGroupTabs: boolean
  showContainerTabs: boolean
  locale: 'system' | string
}

interface TabbyState {
  runningAction: boolean
  error: string | null
  preferences?: Preferences
}

const defaultPreferences: Preferences = {
  theme: 'system',
  showOverview: true,
  lastVersion: '',
  showGroupTabs: true,
  showContainerTabs: true,
  locale: 'system',
}

const defaultState: TabbyState = {
  runningAction: false,
  error: null,
  preferences: undefined,
}

function state() {
  const { subscribe, set, update } = writable<TabbyState>(
    defaultState,
    (_, update) => {
      initPreferences().then((preferences) => {
        set({
          ...defaultState,
          preferences,
        })
        thisBrowser?.storage?.onChanged.addListener(updateStorage)
      })

      const updateStorage: Parameters<
        typeof browser.storage.onChanged.addListener
      >[0] = (changes, areaName) => {
        if (areaName !== 'sync') return
        if (changes[PREFS_KEY]) {
          update((state) => ({
            ...state,
            preferences: changes[PREFS_KEY].newValue,
          }))
        }
      }
      return () => thisBrowser?.storage?.onChanged.removeListener(updateStorage)
    },
  )

  async function setPreferences<K extends keyof Preferences>(
    key: K,
    value: Preferences[K],
  ) {
    // get current preferences
    const preferences = (await storageGet(PREFS_KEY)) as Preferences | undefined
    if (!preferences) {
      storageSet(PREFS_KEY, {
        ...defaultPreferences,
        [key]: value,
      })
      return
    }
    // update the preference
    preferences[key] = value
    // save the preferences
    storageSet(PREFS_KEY, preferences)
  }

  function startAction() {
    update((state) => ({ ...state, runningAction: true }))
  }
  function endAction(error: string | null = null) {
    update((state) => ({ ...state, runningAction: false, error }))
  }
  function clearError() {
    update((state) => ({ ...state, error: null }))
  }
  function updateVersion() {
    update((state) => ({
      ...state,
      preferences: !state.preferences
        ? state.preferences
        : { ...state.preferences, lastVersion: CURRENT_VERSION },
    }))
  }

  return {
    subscribe,
    setPreferences,
    startAction,
    endAction,
    clearError,
    updateVersion,
  }
}

export default state()

async function initPreferences() {
  const preferences = (await storageGet(PREFS_KEY)) as Preferences | undefined

  // if we have preferences, return them
  if (preferences) return preferences
  let newPrefs: Preferences | undefined
  if (await storageGet('usedBefore')) {
    newPrefs = {
      theme: (await storageGet('theme')) || defaultPreferences.theme,
      showOverview:
        (await storageGet('show-overview')) || defaultPreferences.showOverview,
      lastVersion: '1.0.0',
      showGroupTabs: true,
      showContainerTabs: true,
      locale: (await storageGet('language')) || defaultPreferences.locale,
    }
    await thisBrowser?.storage.sync.clear()
  } else {
    newPrefs = defaultPreferences
  }
  storageSet(PREFS_KEY, newPrefs)
  return newPrefs
}

export async function listenToThemeChange() {
  const updateTheme = (theme: string) => {
    document.body.classList.remove('theme--light', 'theme--dark')
    if (theme === 'dark') {
      document.body.classList.add('theme--dark')
    } else if (theme === 'light') {
      document.body.classList.add('theme--light')
    }
  }

  const preferences = (await storageGet(PREFS_KEY)) as Preferences | undefined
  if (preferences) {
    console.log('theme', preferences)
    updateTheme(preferences.theme)
  }
  thisBrowser?.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'sync') return
    if (changes[PREFS_KEY]) {
      updateTheme(changes[PREFS_KEY].newValue.theme)
    }
  })
}
