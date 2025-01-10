export type CombinedBrowserAPI = typeof browser & typeof chrome
export type CombinedTab = browser.tabs.Tab & chrome.tabs.Tab

export const thisBrowser: CombinedBrowserAPI | undefined =
  window.browser || (window as any).chrome?.tabs
    ? (window as any).chrome
    : undefined

export const hasTabGroupSupport =
  !thisBrowser || window?.chrome?.tabGroups !== undefined

export const hasContainerSupport =
  !thisBrowser || window?.browser?.contextualIdentities !== undefined

export async function queryTabGroups(
  options: Parameters<typeof window.chrome.tabGroups.query>[0],
) {
  if (!thisBrowser) {
    return GROUPS as chrome.tabGroups.TabGroup[]
  }
  if (!thisBrowser.tabGroups) {
    return []
  }
  return await thisBrowser.tabGroups.query(options)
}

export async function queryContainers(
  options: Parameters<typeof window.browser.contextualIdentities.query>[0],
) {
  if (!thisBrowser) {
    return CONTAINERS as browser.contextualIdentities.ContextualIdentity[]
  }
  return await thisBrowser.contextualIdentities.query(options)
}

export async function queryTabs(
  options: Parameters<typeof browser.tabs.query>[0],
) {
  if (!thisBrowser) {
    return TABS as CombinedTab[]
  }
  return (await thisBrowser.tabs.query(options)) as CombinedTab[]
}

export function openTab(id: number) {
  updateTabs(id, { active: true })
  window.close()
}

export function updateTabs(
  id: Parameters<typeof browser.tabs.update>[0],
  obj: Parameters<typeof browser.tabs.update>[1],
) {
  if (!thisBrowser) {
    return
  }
  return thisBrowser.tabs.update(id, obj)
}

export function updateGroup(
  id: Parameters<typeof chrome.tabGroups.update>[0],
  obj: Parameters<typeof chrome.tabGroups.update>[1],
) {
  if (!thisBrowser) {
    return
  }
  return thisBrowser.tabGroups.update(id, obj)
}

export function closeTab(id: Parameters<typeof browser.tabs.remove>[0]) {
  if (!thisBrowser) {
    return
  }
  return thisBrowser.tabs.remove(id)
}

export async function shortcutGet(key: string) {
  if (!thisBrowser) {
    return Promise.resolve('alt+space')
  }
  let commands = await thisBrowser.commands.getAll()
  for (let i = 0; i < commands.length; i++) {
    if (commands[i].name === key) {
      return commands[i].shortcut
    }
  }
}

export async function storageGet(key: string) {
  if (!thisBrowser) {
    return Promise.resolve(lsGet(key))
  }
  let res = await thisBrowser.storage.sync.get(key)
  return res[key]
}

export function storageSet(key: string, value: any) {
  if (!thisBrowser) {
    return Promise.resolve(lsSet(key, value))
  }
  return thisBrowser.storage.sync.set({ [key]: value })
}

export function storageRemove(key: string) {
  if (!thisBrowser) {
    return Promise.resolve(lsRemove(key))
  }
  return thisBrowser.storage.sync.remove(key)
}

// Localstorage can only hold string-values (which isn't the case for the storage API extension use).
// These functions should mimick the actual add-on storage api sufficiently
function getStore() {
  const store = localStorage.getItem('fake-store')
  return store ? JSON.parse(store) : {}
}
function setStore(store: any) {
  localStorage.setItem('fake-store', JSON.stringify(store))
}
function lsGet(key: string) {
  return getStore()[key]
}
function lsSet(key: string, value: any) {
  const store = getStore()
  store[key] = value
  setStore(store)
}
function lsRemove(key: string) {
  const store = getStore()
  delete store[key]
  setStore(store)
}

const GROUPS = [
  {
    collapsed: false,
    color: 'red',
    id: 1698879258,
    title: 'Wikipedia',
    windowId: 273536770,
  },
  {
    collapsed: true,
    color: 'cyan',
    id: 931573972,
    title: 'Example',
    windowId: 273536770,
  },
]

const TABS = [
  {
    active: false,
    audible: false,
    autoDiscardable: true,
    discarded: false,
    favIconUrl: 'https://github.githubassets.com/favicons/favicon.svg',
    groupId: -1,
    height: 1210,
    highlighted: false,
    id: 273536828,
    incognito: false,
    index: 0,
    lastAccessed: 1736533566718.591,
    mutedInfo: {
      muted: false,
    },
    pinned: false,
    selected: false,
    status: 'complete',
    title:
      'GitHub · Build and ship software on a single, collaborative platform · GitHub',
    url: 'https://github.com/',
    width: 2161,
    windowId: 273536770,
  },
  {
    active: false,
    audible: false,
    autoDiscardable: true,
    discarded: false,
    favIconUrl:
      'https://www.mozilla.org/media/img/favicons/mozilla/m24/favicon.d0be64e474b1.ico',
    groupId: -1,
    height: 1210,
    highlighted: false,
    id: 273536833,
    incognito: false,
    index: 1,
    lastAccessed: 1736533572023.703,
    mutedInfo: {
      muted: false,
    },
    pinned: false,
    selected: false,
    status: 'complete',
    title: 'Mozilla - Internet for people, not profit (US)',
    url: 'https://www.mozilla.org/en-US/',
    width: 2161,
    cookieStoreId: 'firefox-container-3',
    windowId: 273536770,
  },
  {
    active: false,
    audible: false,
    autoDiscardable: true,
    discarded: false,
    favIconUrl:
      'https://www.redditstatic.com/shreddit/assets/favicon/64x64.png',
    groupId: -1,
    height: 1210,
    highlighted: false,
    id: 273536834,
    incognito: false,
    index: 2,
    lastAccessed: 1736533577792.505,
    mutedInfo: {
      muted: false,
    },
    pinned: false,
    selected: false,
    status: 'complete',
    title: 'Potted Cats - cats in pots',
    url: 'https://www.reddit.com/r/pottedcats/',
    width: 2161,
    windowId: 273536770,
  },
  {
    active: false,
    audible: false,
    autoDiscardable: true,
    discarded: false,
    favIconUrl:
      'https://developer.mozilla.org/favicon-48x48.bc390275e955dacb2e65.png',
    groupId: -1,
    height: 1210,
    highlighted: false,
    id: 273536839,
    incognito: false,
    index: 3,
    lastAccessed: 1736533594938.445,
    mutedInfo: {
      muted: false,
    },
    pinned: false,
    selected: false,
    status: 'complete',
    title: 'CSS scrollbars styling - CSS: Cascading Style Sheets | MDN',
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scrollbars_styling',
    width: 2161,
    cookieStoreId: 'firefox-container-4',
    windowId: 273536770,
  },
  {
    active: false,
    audible: false,
    autoDiscardable: true,
    discarded: false,
    favIconUrl:
      'https://www.youtube.com/s/desktop/b5305900/img/logos/favicon_32x32.png',
    groupId: -1,
    height: 1210,
    highlighted: false,
    id: 273536842,
    incognito: false,
    index: 4,
    lastAccessed: 1736533600569.377,
    mutedInfo: {
      muted: false,
    },
    pinned: false,
    selected: false,
    status: 'complete',
    title: 'YouTube',
    url: 'https://www.youtube.com/',
    width: 2161,
    windowId: 273536770,
  },
  {
    active: false,
    audible: false,
    autoDiscardable: true,
    discarded: false,
    favIconUrl: 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
    groupId: 1698879258,
    height: 1210,
    highlighted: false,
    id: 273536845,
    incognito: false,
    index: 5,
    lastAccessed: 1736533682208.715,
    mutedInfo: {
      muted: false,
    },
    pinned: false,
    selected: false,
    status: 'complete',
    title: 'Internet - Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Internet',
    width: 2161,
    windowId: 273536770,
  },
  {
    active: false,
    audible: false,
    autoDiscardable: true,
    discarded: false,
    favIconUrl: 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
    groupId: 1698879258,
    height: 1210,
    highlighted: false,
    id: 273536848,
    incognito: false,
    index: 6,
    lastAccessed: 1736533682678.763,
    mutedInfo: {
      muted: false,
    },
    pinned: false,
    selected: false,
    status: 'complete',
    title: 'Internet protocol suite - Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Internet_protocol_suite',
    width: 2161,
    windowId: 273536770,
  },
  {
    active: false,
    audible: false,
    autoDiscardable: true,
    discarded: false,
    favIconUrl: 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
    groupId: 1698879258,
    height: 1210,
    highlighted: false,
    id: 273536851,
    incognito: false,
    index: 7,
    lastAccessed: 1736533682953.393,
    mutedInfo: {
      muted: false,
    },
    pinned: false,
    selected: false,
    status: 'complete',
    title: 'World Wide Web - Wikipedia',
    url: 'https://en.wikipedia.org/wiki/World_Wide_Web',
    width: 2161,
    windowId: 273536770,
  },
  {
    active: false,
    audible: false,
    autoDiscardable: true,
    discarded: false,
    favIconUrl:
      'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png',
    groupId: -1,
    height: 1210,
    highlighted: false,
    id: 273536860,
    incognito: false,
    index: 8,
    lastAccessed: 1736533651455.288,
    mutedInfo: {
      muted: false,
    },
    pinned: false,
    selected: false,
    status: 'complete',
    title: 'Home - Google Drive',
    url: 'https://drive.google.com/drive/home?dmr=1&ec=wgc-drive-globalnav-goto',
    width: 2161,
    cookieStoreId: 'firefox-container-2',
    windowId: 273536770,
  },
  {
    active: false,
    audible: false,
    autoDiscardable: true,
    discarded: false,
    favIconUrl: 'https://www.google.com/favicon.ico',
    groupId: -1,
    height: 1210,
    highlighted: false,
    id: 273536857,
    incognito: false,
    index: 9,
    lastAccessed: 1736533645165.505,
    mutedInfo: {
      muted: false,
    },
    pinned: false,
    selected: false,
    status: 'complete',
    title: 'wool - Google Search',
    url: 'https://www.google.com/search?q=wool&oq=wool&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIQCAEQLhjHARjJAxjRAxiABDINCAIQLhjHARjRAxiABDIHCAMQABiABDINCAQQABiSAxiABBiKBTINCAUQABiSAxiABBiKBTIHCAYQABiABDINCAcQLhjHARjRAxiABDIHCAgQABiPAjIHCAkQABiPAtIBCDExMTlqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8',
    width: 2161,
    cookieStoreId: 'firefox-container-2',
    windowId: 273536770,
  },
  {
    active: false,
    audible: false,
    autoDiscardable: true,
    discarded: false,
    favIconUrl:
      'https://mastodon.social/packs/media/icons/favicon-32x32-249409a6d9f300112c51af514d863112.png',
    groupId: -1,
    height: 1210,
    highlighted: false,
    id: 273536864,
    incognito: false,
    index: 10,
    lastAccessed: 1736533656812.486,
    mutedInfo: {
      muted: false,
    },
    pinned: false,
    selected: false,
    status: 'complete',
    title: 'Explore - Mastodon',
    url: 'https://mastodon.social/explore',
    width: 2161,
    windowId: 273536770,
  },
  {
    active: false,
    audible: false,
    autoDiscardable: true,
    discarded: false,
    groupId: 931573972,
    height: 1210,
    highlighted: false,
    id: 273536873,
    incognito: false,
    index: 11,
    lastAccessed: 1736533715494.369,
    mutedInfo: {
      muted: false,
    },
    pinned: false,
    selected: false,
    status: 'complete',
    title: 'Example Domain',
    url: 'https://example.com/',
    width: 2161,
    windowId: 273536770,
  },
  {
    active: false,
    audible: false,
    autoDiscardable: true,
    discarded: false,
    groupId: 931573972,
    height: 1210,
    highlighted: false,
    id: 273536876,
    incognito: false,
    index: 12,
    lastAccessed: 1736533714542.865,
    mutedInfo: {
      muted: false,
    },
    pinned: false,
    selected: false,
    status: 'complete',
    title: 'Example Domain',
    url: 'https://example.com/',
    width: 2161,
    windowId: 273536770,
  },
  {
    active: true,
    audible: false,
    autoDiscardable: true,
    discarded: false,
    favIconUrl: 'https://letterboxd.com/favicon.ico',
    groupId: -1,
    height: 1210,
    highlighted: true,
    id: 273536867,
    incognito: false,
    index: 13,
    lastAccessed: 1736533843972.27,
    mutedInfo: {
      muted: false,
    },
    pinned: false,
    selected: true,
    status: 'complete',
    title: 'Letterboxd • Social film discovery.',
    url: 'https://letterboxd.com/',
    width: 2161,
    windowId: 273536770,
  },
  {
    active: false,
    audible: false,
    autoDiscardable: true,
    discarded: false,
    favIconUrl: 'https://letterboxd.com/favicon.ico',
    groupId: -1,
    height: 1210,
    highlighted: false,
    id: 273536870,
    incognito: false,
    index: 14,
    lastAccessed: 1736533676963.31,
    mutedInfo: {
      muted: false,
    },
    pinned: false,
    selected: false,
    status: 'complete',
    title: 'Frequent questions • Letterboxd',
    url: 'https://letterboxd.com/about/faq/',
    width: 2161,
    cookieStoreId: 'firefox-container-1',
    windowId: 273536770,
  },
]

const CONTAINERS = [
  {
    name: 'Personal',
    icon: 'fingerprint',
    iconUrl: 'resource://usercontext-content/fingerprint.svg',
    color: 'blue',
    colorCode: '#37adff',
    cookieStoreId: 'firefox-container-1',
  },
  {
    name: 'Work',
    icon: 'briefcase',
    iconUrl: 'resource://usercontext-content/briefcase.svg',
    color: 'orange',
    colorCode: '#ff9f00',
    cookieStoreId: 'firefox-container-2',
  },
  {
    name: 'Banking',
    icon: 'dollar',
    iconUrl: 'resource://usercontext-content/dollar.svg',
    color: 'green',
    colorCode: '#51cd00',
    cookieStoreId: 'firefox-container-3',
  },
  {
    name: 'Shopping',
    icon: 'cart',
    iconUrl: 'resource://usercontext-content/cart.svg',
    color: 'pink',
    colorCode: '#ff4bda',
    cookieStoreId: 'firefox-container-4',
  },
]
