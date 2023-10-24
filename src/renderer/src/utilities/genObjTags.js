export default function genObjTags(parent, key, value) {
  if (typeof value === 'string') {
    return [[parent, key, `"${value}"`]]
  } else if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return [[parent, key, value]]
  } else if (typeof value === 'object') {
    let tags = []
    if (Array.isArray(value)) {
      // for (const [index, item] of value.entries()) {
      //   tags.push(...genObjTags(parent, `${key}[${index}]`, item))
      // }
      for (const [, item] of value.entries()) {
        tags.push(...genObjTags(parent, key, item))
      }
    } else {
      for (const [objKey, objValue] of Object.entries(value)) {
        const dot = parent != '' && objKey != '' ? '.' : ''
        tags.push(...genObjTags(`${parent}${dot}${key}`, objKey, objValue))
      }
    }
    return tags
  }
}
