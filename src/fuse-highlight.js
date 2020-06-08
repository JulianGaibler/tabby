import he from 'he'

export default function(fuseSearchResult, highlightClassName = 'highlight') {
  const set = (obj, path, value) => {
    const pathValue = path.split('.')
    let i

    for (i = 0; i < pathValue.length - 1; i++) {
      obj = obj[pathValue[i]]
    }

    obj[pathValue[i]] = value
  }

  const generateHighlightedText = (inputText, regions = []) => {
    let content = ''
    let nextUnhighlightedRegionStartingIndex = 0

    regions.forEach(region => {
      const lastRegionNextIndex = region[1] + 1

      content += [
        he.encode(inputText.substring(nextUnhighlightedRegionStartingIndex, region[0])),
        `<span class="${highlightClassName}">`,
        he.encode(inputText.substring(region[0], lastRegionNextIndex)),
        '</span>',
      ].join('')

      nextUnhighlightedRegionStartingIndex = lastRegionNextIndex
    })

    content += he.encode(inputText.substring(nextUnhighlightedRegionStartingIndex))

    return content
  }

  return fuseSearchResult
    .filter(({ matches }) => matches && matches.length)
    .map(({ item, matches }) => {
      const highlightedItem = { ...item }

      matches.forEach((match) => {
        set(highlightedItem, match.key, generateHighlightedText(match.value, match.indices))
      })

      return highlightedItem
    })
}
