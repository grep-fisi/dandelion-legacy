import GraphView from './components/GraphView/GraphView'
import { useEffect, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Dialog, TextInput } from '@mantine/core'
import files from './data/makeup_data.json'
import genObjArr from './utilities/genObjArr'

export default function App() {
  const [opened, { toggle, close }] = useDisclosure(false)
  const [placeholder, setPlaceholder] = useState('hola')
  const [input, setInput] = useState('')
  const [rawData, setRawData] = useState(genObjArr(files, 'name'))
  const [invalid, setInvalid] = useState(false)

  // useEffect(() => {
  //   const randomFile = files[Math.floor(Math.random() * files.length)]
  //   const randomTags = randomFile.tags.slice(0, 2).join(' && ')
  //   setPlaceholder(randomTags)
  // }, [])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.ctrlKey && event.key === 'f') {
        toggle()
      } else if (event.key === 'Escape' && opened) {
        close()
      } else if (event.key === 'Enter' && opened) {
        handleEnter()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [toggle, input])

  useEffect(() => {
    setInvalid(false)
  }, [input])

  const symbols = ['!', '~', '/\\', '&', '&&', '<=>', '<', '=>', '>', '||']

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
      setRawData(genObjArr(files, 'name'))
      return
    }

    const bodyStr = JSON.stringify({
      sets: getSets(input),
      expr: input,
      files: genObjArr(files, 'name')
    })

    fetch('http://localhost:9090/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: bodyStr
    }).then((e) => {
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
