const genObjTags = (parent, key, value) => {
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

function genObjArr(json, nameAttrib) {
  const objArr = []
  json.forEach((tagArr) => {
    const newObj = {
      name: '',
      tags: []
    }
    genObjTags('', '', tagArr).forEach(([parent, key, value]) => {
      const dot = parent != '' ? '.' : ''
      if (value == '') {
        value = null
      }
      if (`${parent}${dot}${key}` === nameAttrib) {
        newObj.name = value.replace(/"/g, '')
      }
      const strTag = `${parent}${dot}${key}:${value}`
      newObj.tags.push(strTag)
    })
    objArr.push(newObj)
  })
  return objArr
}

export default function generateGraph(json, nameAttrib) {
  const objArr = genObjArr(json, nameAttrib)

  const nodes = objArr.map((obj, index) => {
    return {
      id: index.toString(),
      name: obj.name || index.toString()
    }
  })
  const links = []
  const tagsMap = {}

  // Generate tag map
  objArr.forEach((obj) => {
    obj.tags.forEach((tag) => {
      if (!tagsMap[tag]) {
        tagsMap[tag] = []
      }
      tagsMap[tag].push(obj.name)
    })
  })

  // Generate link objects
  Object.keys(tagsMap).forEach((tag) => {
    const files = tagsMap[tag]
    for (let i = 0; i < files.length; i++) {
      const file1 = files[i]
      for (let j = i + 1; j < files.length; j++) {
        const file2 = files[j]
        links.push({
          source: nodes.find((node) => node.name === file1).id,
          target: nodes.find((node) => node.name === file2).id,
          label: tag
        })
      }
    }
  })

  console.log(links)
  return { nodes, links }
}
