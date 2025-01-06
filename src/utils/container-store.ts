import {
  hasContainerSupport,
  queryContainers,
  thisBrowser,
} from './extension-api'
import { readable } from 'svelte/store'

export type ContainerMap = {
  [key: string]: browser.contextualIdentities.ContextualIdentity
}

const containers = readable({} as ContainerMap, (set, update) => {
  const updateTabs = () => {
    queryContainers({}).then((containers) => {
      if (!containers) return
      console.log('containers', containers)
      set(
        containers.reduce((acc, container) => {
          acc[container.cookieStoreId] = container
          return acc
        }, {} as ContainerMap),
      )
    })
  }

  updateTabs()
  thisBrowser?.contextualIdentities?.onUpdated.addListener(updateTabs)
  return () =>
    thisBrowser?.contextualIdentities?.onUpdated.removeListener(updateTabs)
})

export default containers
