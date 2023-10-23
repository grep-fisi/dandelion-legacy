import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'
import App from './App'
import { MantineProvider } from '@mantine/core'

import '@mantine/core/styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider
      theme={{
        colors: {
          dark: [
            '#C1C2C5',
            '#A6A7AB',
            '#909296',
            '#8a8a8a', // default nodes
            '#373A40',
            '#353535', // idle nodes & links
            '#252525', // background
            '#1A1B1E',
            '#141517',
            '#101113'
          ],
          main: ['#00bfff'] // active nodes & links
        }
      }}
      defaultColorScheme="dark"
    >
      <App />
    </MantineProvider>
  </React.StrictMode>
)
