import genObjTags from './genObjTags'

export default function genObjArr(json, nameAttrib) {
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
