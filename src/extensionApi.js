const [thisBrowser, chromeAPI] = (() => {
  if (typeof browser !== 'undefined') return [browser, false]
  else if (typeof chrome !== 'undefined') return [chrome, true]
  else return [undefined, false]
})()

export const isChromeAPI = chromeAPI

export async function queryTabs(options) {
  if (!thisBrowser) { return }
  if (chromeAPI) {
    return await new Promise(resolve => thisBrowser.tabs.query(options, resolve))
  } else {
    return await thisBrowser.tabs.query(options)
  }
}

export function updateTabs(id) {
  if (!thisBrowser) { return }
  thisBrowser.tabs.update(id, { active: true })
}

export async function shortcutGet(key) {
  if (!thisBrowser) {
    return Promise.resolve('alt+space')
  }
  let commands
  if (chromeAPI) {
    commands = await new Promise(resolve => thisBrowser.commands.getAll(resolve))
  } else {
    commands = await thisBrowser.commands.getAll()
  }
  for (let i = 0; i < commands.length; i++) {
    if (commands[i].name === key) {
      return commands[i].shortcut
    }
  }
}

export async function storageGet(key) {
  if (!thisBrowser) {
    return Promise.resolve(localStorage.getItem(key))
  }
  let res
  if (chromeAPI) {
    res = await new Promise(resolve => thisBrowser.storage.sync.get(key, resolve))
  } else {
    res = await thisBrowser.storage.sync.get(key)
  }
  return res[key]
}

export function storageSet(keys) {
  if (!thisBrowser) {
    Object.keys(keys).forEach(key => localStorage.setItem(key, keys[key]))
    return Promise.resolve()
  }
  if (chromeAPI) {
    return new Promise(resolve => thisBrowser.storage.sync.set(keys, resolve))
  } else {
    return thisBrowser.storage.sync.set(keys)
  }
}

export function storageRemove(key) {
  if (!thisBrowser) {
    return Promise.resolve(localStorage.removeItem(key))
  }
  if (chromeAPI) {
    return new Promise(resolve => thisBrowser.storage.sync.remove(key, resolve))
  } else {
    return thisBrowser.storage.sync.remove(key)
  }
}

export async function firstTimeSetup() {
  if (await storageGet('usedBefore')) {
    return false
  } else {
    storageSet({ usedBefore: true })
    return true
  }
}
