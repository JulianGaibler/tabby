import { storageGet, storageSet } from '@/extensionApi'

const cache = {}


export const PREFS = {
  SHOW_OVERVIEW: 'show-overview',
  IMPROVED_ACCESSIBILITY: 'improved-accessibility',
}

export async function getPref(name) {
  if (cache[name] !== undefined) {
    return cache[name]
  }
  const result = await storageGet(name)
  if (result !== null && result !== undefined) {
    return result
  }
  switch (name) {
  case PREFS.SHOW_OVERVIEW:
    return true
  case PREFS.IMPROVED_ACCESSIBILITY:
    return false
  default:
    throw new Error('Unknown Pref!')
  }
}

export async function setPref(name, value) {
  const obj = {}
  obj[name] = value
  await storageSet(obj)
  cache[name] = value
  return value
}
