import { queryTabs, thisBrowser, type CombinedTab } from './extension-api'
import { readable } from 'svelte/store'

import stateStore from '@src/utils/state-store'

const tabs = readable([] as CombinedTab[], (set) => {
  let allWindows = false

  const updateTabs = () => {
    queryTabs({ currentWindow: allWindows ? undefined : true }).then((tabs) => {
      if (!tabs) return
      set(tabs)
    })
  }

  stateStore.getPreference('searchAllWindows').then((pref) => {
    allWindows = (pref as boolean | undefined) || false
    updateTabs()
  })

  if (thisBrowser?.tabs) {
    thisBrowser.tabs.onAttached.addListener(updateTabs)
    thisBrowser.tabs.onCreated.addListener(updateTabs)
    thisBrowser.tabs.onDetached.addListener(updateTabs)
    thisBrowser.tabs.onMoved.addListener(updateTabs)
    thisBrowser.tabs.onRemoved.addListener(updateTabs)
    thisBrowser.tabs.onReplaced.addListener(updateTabs)
    thisBrowser.tabs.onUpdated.addListener(updateTabs)
  }
  return () => {
    if (thisBrowser?.tabs) {
      thisBrowser.tabs.onAttached.removeListener(updateTabs)
      thisBrowser.tabs.onCreated.removeListener(updateTabs)
      thisBrowser.tabs.onDetached.removeListener(updateTabs)
      thisBrowser.tabs.onMoved.removeListener(updateTabs)
      thisBrowser.tabs.onRemoved.removeListener(updateTabs)
      thisBrowser.tabs.onReplaced.removeListener(updateTabs)
      thisBrowser.tabs.onUpdated.removeListener(updateTabs)
    }
  }
})

export default tabs
