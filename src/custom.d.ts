declare module '*.yaml' {
  const value: any
  export default value
}

declare module '*?raw' {
  const value: string
  export default value
}

declare const __VERSION__: string

declare module 'virtual:available-locales' {
  export const availableLocales: string[]
}
