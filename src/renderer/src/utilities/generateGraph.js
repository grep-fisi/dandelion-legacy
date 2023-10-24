export default function generateGraph(objArr) {
  const links = []
  const tagsMap = {}
  let nodeFiles = []
  let nodeTags = []

  objArr.forEach((obj) => {
    obj.tags.forEach((tag) => {
      if (!tagsMap[tag]) {
        tagsMap[tag] = []
      }
      tagsMap[tag].push(obj.name)
    })
  })

  nodeFiles = objArr.map((obj, index) => {
    return {
      id: index.toString(),
      name: obj.name || index.toString()
    }
  })

  nodeTags = Object.keys(tagsMap).map((tag, index) => {
    return {
      id: (index + nodeFiles.length).toString(),
      name: tag
    }
  })

  Object.keys(tagsMap).forEach((tag) => {
    const currNodeTag = nodeTags.find((node) => node.name === tag)
    const currNodeFiles = tagsMap[tag].map((filename) =>
      nodeFiles.find((node) => node.name === filename)
    )
    currNodeFiles.forEach((currNodeFile) =>
      links.push({
        source: currNodeFile.id,
        target: currNodeTag.id
      })
    )
  })

  const nodes = nodeFiles.concat(nodeTags)
  return { nodes, links }
}
