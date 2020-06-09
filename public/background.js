const [thisBrowser, chromeAPI] = (() => {
  if (typeof browser !== 'undefined') return [browser, false]
  else if (typeof chrome !== 'undefined') return [chrome, true]
  else return [undefined, false]
})()

function storageGet(key) {
  if (chromeAPI) {
    return new Promise(resolve => thisBrowser.storage.sync.get(key, resolve))
  } else {
    return thisBrowser.storage.sync.get(key)
  }
}

const icons = {
  'light-eye': {
    16:  '/icons/tabby_icon_eye_light_16.png',
    48:  '/icons/tabby_icon_eye_light_48.png',
    128: '/icons/tabby_icon_eye_light_128.png',
  },
  'light-eye-themed': {
    16:  '/icons/tabby_icon_eye_light_themed_16.png',
    48:  '/icons/tabby_icon_eye_light_themed_48.png',
    128: '/icons/tabby_icon_eye_light_themed_128.png',
  },
  'dark-eye': {
    16:  '/icons/tabby_icon_eye_dark_16.png',
    48:  '/icons/tabby_icon_eye_dark_48.png',
    128: '/icons/tabby_icon_eye_dark_128.png',
  },
  'dark-eye-themed': {
    16:  '/icons/tabby_icon_eye_dark_themed_16.png',
    48:  '/icons/tabby_icon_eye_dark_themed_48.png',
    128: '/icons/tabby_icon_eye_dark_themed_128.png',
  },
  'light-face': {
    16:  '/icons/tabby_icon_face_light_16.png',
    48:  '/icons/tabby_icon_face_light_48.png',
    128: '/icons/tabby_icon_face_light_128.png',
  },
  'light-face-themed': {
    16:  '/icons/tabby_icon_face_light_themed_16.png',
    48:  '/icons/tabby_icon_face_light_themed_48.png',
    128: '/icons/tabby_icon_face_light_themed_128.png',
  },
  'dark-face': {
    16:  '/icons/tabby_icon_face_dark_16.png',
    48:  '/icons/tabby_icon_face_dark_48.png',
    128: '/icons/tabby_icon_face_dark_128.png',
  },
  'dark-face-themed': {
    16:  '/icons/tabby_icon_face_dark_themed_16.png',
    48:  '/icons/tabby_icon_face_dark_themed_48.png',
    128: '/icons/tabby_icon_face_dark_themed_128.png',
  },
}

const query = window.matchMedia('(prefers-color-scheme: dark)')

query.addListener(change)
thisBrowser.storage.onChanged.addListener(change)
change()

async function change() {
  const darkMode = query.matches ? 'dark' : 'light'
  let res = await storageGet('icon')
  if (!res.icon) res.icon = 'eye'

  thisBrowser.browserAction.setIcon({
    path: icons[`${darkMode}-${res.icon}`],
  })
}
