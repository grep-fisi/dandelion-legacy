import ForceGraph2D from 'react-force-graph-2d'
import generateGraph from '../../utilities/generateGraph'
import { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useMantineTheme } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'

export default function GraphView({ rawData }) {
  const graphRef = useRef(null)
  const mouseDown = useRef(false)
  const colors = useMantineTheme().colors
  const { height, width } = useViewportSize()

  useEffect(() => {
    function handleMouseDown() {
      mouseDown.current = true
    }
    function handleMouseUp() {
      mouseDown.current = false
    }
    function handleEscapeKey(event) {
      if (event.key === 'Escape') {
        handleBackgroundClick()
      }
    }
    window.addEventListener('mousedown', handleMouseDown, true)
    window.addEventListener('mouseup', handleMouseUp, true)
    window.addEventListener('keydown', handleEscapeKey, true)
    return () => {
      window.removeEventListener('mousedown', handleMouseDown, true)
      window.removeEventListener('mouseup', handleMouseUp, true)
      window.removeEventListener('keydown', handleEscapeKey, true)
    }
  }, [])

  /* Highlight node and its links on node hover */

  const data = useMemo(() => {
    const gData = generateGraph(rawData, 'name')

    gData.links.forEach((link) => {
      const a = gData.nodes[link.source]
      const b = gData.nodes[link.target]
      !a.neighbors && (a.neighbors = [])
      !b.neighbors && (b.neighbors = [])
      a.neighbors.push(b)
      b.neighbors.push(a)

      !a.links && (a.links = [])
      !b.links && (b.links = [])
      a.links.push(link)
      b.links.push(link)
    })

    return gData
  }, [rawData])

  const [highlightNodes, setHighlightNodes] = useState(new Set())
  const [highlightLinks, setHighlightLinks] = useState(new Set())
  const clickedNodes = useState(new Set())[0]
  const clickedLinks = useState(new Set())[0]
  const setHoverNode = useState(null)[1]

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes)
    setHighlightLinks(highlightLinks)
  }

  const handleNodeHover = (node) => {
    if (!mouseDown.current) {
      highlightNodes.clear()
      highlightLinks.clear()
    }

    if (node) {
      highlightNodes.add(node)
      if (node.neighbors) {
        node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor))
      }
      if (node.links) {
        node.links.forEach((link) => highlightLinks.add(link))
      }
    }

    setHoverNode(node || null)
    updateHighlight()
  }

  const handleNodeDrag = (node) => {
    if (node) {
      highlightNodes.add(node)
      if (node.neighbors) {
        node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor))
      }
      if (node.links) {
        node.links.forEach((link) => highlightLinks.add(link))
      }
    }
  }

  const handleNodeClick = (node) => {
    if (node) {
      clickedNodes.add(node)
      if (node.neighbors) {
        node.neighbors.forEach((neighbor) => clickedNodes.add(neighbor))
      }
      if (node.links) {
        node.links.forEach((link) => clickedLinks.add(link))
      }
    }
  }

  const handleNodeDeclick = (node) => {
    if (node) {
      clickedNodes.delete(node)
      if (node.neighbors) {
        node.neighbors.forEach((neighbor) => clickedNodes.delete(neighbor))
      }
      if (node.links) {
        node.links.forEach((link) => clickedLinks.delete(link))
      }
    }
  }

  const handleBackgroundClick = () => {
    clickedNodes.clear()
    clickedLinks.clear()
  }

  const handleNodeDragEnd = () => {
    highlightNodes.clear()
    highlightLinks.clear()
  }

  /* Autogenerated curves on node repeat */

  useEffect(() => {
    let sameNodesLinks = {}
    const curvatureMinMax = 0.25

    data.links.forEach((link) => {
      link.nodePairId =
        link.source <= link.target
          ? link.source + '_' + link.target
          : link.target + '_' + link.source
      let map = null
      if (link.source != link.target) {
        map = sameNodesLinks
      }
      if (!map[link.nodePairId]) {
        map[link.nodePairId] = []
      }
      map[link.nodePairId].push(link)
    })

    Object.keys(sameNodesLinks)
      .filter((nodePairId) => sameNodesLinks[nodePairId].length > 1)
      .forEach((nodePairId) => {
        let links = sameNodesLinks[nodePairId]
        let lastIndex = links.length - 1
        let lastLink = links[lastIndex]
        lastLink.curvature = curvatureMinMax
        let delta = (2 * curvatureMinMax) / lastIndex
        for (let i = 0; i < lastIndex; i++) {
          links[i].curvature = -curvatureMinMax + i * delta
          if (lastLink.source !== links[i].source) {
            links[i].curvature *= -1
          }
        }
      })
  }, [highlightNodes])

  useEffect(() => {
    setTimeout(() => {
      graphRef.current.zoomToFit(0, height / 10)
    }, 1)
  }, [data, height, width])

  return (
    <>
      <ForceGraph2D
        ref={graphRef}
        width={width}
        height={height}
        graphData={data}
        autoPauseRedraw={true}
        linkCurvature={'curvature'}
        backgroundColor={'#ffffff0'}
        nodeRelSize={3}
        nodeColor={(node) => {
          if (highlightNodes.size > 0) {
            if (highlightNodes.has(node)) {
              return colors.main[0]
            } else if (highlightNodes.neighbors?.has(node)) {
              return colors.main[0]
            } else {
              return colors.dark[3] // #353535
            }
          } else {
            return colors.dark[3] // #8a8a8a
          }
        }}
        linkColor={(link) => (highlightLinks.has(link) ? colors.main[0] : colors.dark[3])}
        dagMode={'radialin'}
        dagLevelDistance={200}
        onNodeHover={handleNodeHover}
        onNodeDrag={handleNodeDrag}
        onNodeDragEnd={handleNodeDragEnd}
        onNodeClick={(node) => {
          if (clickedNodes.has(node)) {
            handleNodeDeclick(node)
          } else {
            handleNodeClick(node)
          }
        }}
        onBackgroundClick={handleBackgroundClick}
        onLinkClick={handleBackgroundClick}
        // enablePointerInteraction={false}
        linkVisibility={(link) =>
          highlightLinks.has(link) || clickedLinks.has(link) ? true : false
        }
      />
    </>
  )
}

GraphView.propTypes = {
  rawData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  ).isRequired
}
