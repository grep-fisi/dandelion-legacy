import GraphView from './components/GraphView/GraphView'
import { useEffect, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Dialog, TextInput } from '@mantine/core'
import files from './data/movies.json'
import genObjArr from './utilities/genObjArr'

const symbols = ['!', '~', '/\\', '&', '&&', '<=>', '<', '=>', '>', '||']

export default function App() {
  const [opened, { toggle, close }] = useDisclosure(false)
  const [placeholder, setPlaceholder] = useState('')
  const [input, setInput] = useState('')
  const [rawData, setRawData] = useState(genObjArr(files, 'name'))
  const [invalid, setInvalid] = useState(false)

  const ogData = genObjArr(files, 'name')

  useEffect(() => {
    const bodyStr = JSON.stringify({
      files: ogData
    })

    fetch('http://localhost:9090/upload/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: bodyStr
    })
  }, [])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.ctrlKey && event.key === 'f') {
        toggle()
        event.preventDefault()
      } else if (event.key === 'Escape' && opened) {
        close()
      } else if (event.key === 'Enter' && opened) {
        handleEnter()
      } else if (event.key == 'Tab' && opened && input === '') {
        event.preventDefault()
        setInput(placeholder)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [toggle, input, placeholder])

  useEffect(() => {
    if (opened) {
      const randomFile = rawData[Math.floor(Math.random() * rawData.length)]
      const randomTagIndex = Math.floor(Math.random() * (randomFile.tags.length - 2)) + 2
      setPlaceholder(randomFile.tags[randomTagIndex])
    }
  }, [rawData, opened])

  useEffect(() => {
    setInvalid(false)
  }, [opened, input])

  function getSets(string) {
    let newStr = string
    symbols.forEach((e) => {
      newStr = newStr.replaceAll(e, '')
    })

    let sets = newStr.split(/[ ]+/)
    return sets
  }

  const handleEnter = () => {
    if (input === '') {
      setRawData(ogData)
      return
    }

    const bodyStr = JSON.stringify({
      sets: getSets(input),
      expr: input
    })

    fetch('http://localhost:9090/api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: bodyStr
    }).then((e) => {
      console.log(bodyStr)
      e.json().then((res) => {
        if (res === null) {
          setInvalid(true)
          return
        }
        setRawData(res)
      })
    })
  }

  return (
    <>
      <Dialog
        styles={{
          root: { backgroundColor: '#fff0' }
        }}
        position={{ top: 20, left: 20 }}
        opened={opened}
        onClose={close}
        size="lg"
        radius="md"
      >
        <TextInput
          placeholder={placeholder}
          style={{ flex: 1 }}
          value={input}
          onChange={(event) => {
            setInput(event.currentTarget.value)
          }}
          error={invalid}
        />
      </Dialog>

      <GraphView rawData={rawData} />
    </>
  )
}
