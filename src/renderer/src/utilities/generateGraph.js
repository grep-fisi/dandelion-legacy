export default function generateGraph(json) {
  const nodes = json.map((file, index) => {
    return {
      id: index.toString(),
      name: file.name
    }
  })

  const links = []
  const tagsMap = {}

  // Generate tag map
  json.forEach((file) => {
    file.tags.forEach((tag) => {
      if (!tagsMap[tag]) {
        tagsMap[tag] = []
      }
      tagsMap[tag].push(file.name)
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

  return { nodes, links }
}
