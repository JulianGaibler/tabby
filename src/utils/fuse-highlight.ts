import type { CombinedTab } from './extension-api'
import type { FuseResult, FuseResultMatch, RangeTuple } from 'fuse.js'
import he from 'he'

// export type HighlightResult, which for each key has a key of the same type suffixed with _hl
export type HighlightResult<T> = {
  [K in keyof T | `${string & keyof T}_hl`]: K extends keyof T
    ? T[K]
    : string | undefined
}

export default function <T>(
  fuseSearchResult: FuseResult<T>[],
  highlightClassName = 'highlight',
): HighlightResult<T>[] {
  const set = (obj: { [key: string]: any }, path: string, value: string) => {
    const pathValue = path.split('.')
    let i

    for (i = 0; i < pathValue.length - 1; i++) {
      obj = obj[pathValue[i]]
    }

    obj[`${pathValue[i]}_hl`] = value
  }

  // input text is value of FuseResultMatch
  const generateHighlightedText = (
    inputText: string,
    regions: readonly RangeTuple[] = [],
  ) => {
    let content = ''
    let nextUnhighlightedRegionStartingIndex = 0

    regions.forEach((region) => {
      const lastRegionNextIndex = region[1] + 1

      content += [
        he.encode(
          inputText.substring(nextUnhighlightedRegionStartingIndex, region[0]),
        ),
        `<span class="${highlightClassName}">`,
        he.encode(inputText.substring(region[0], lastRegionNextIndex)),
        '</span>',
      ].join('')

      nextUnhighlightedRegionStartingIndex = lastRegionNextIndex
    })

    content += he.encode(
      inputText.substring(nextUnhighlightedRegionStartingIndex),
    )

    return content
  }

  return fuseSearchResult
    .filter(({ matches }) => matches && matches.length)
    .map(({ item, matches }) => {
      const highlightedItem = { ...item } as T

      if (matches) {
        matches.forEach((match) => {
          if (!match.key || !match.value) return
          set(
            highlightedItem as any,
            match.key,
            generateHighlightedText(match.value, match.indices),
          )
        })
      }

      return highlightedItem as HighlightResult<T>
    })
}
