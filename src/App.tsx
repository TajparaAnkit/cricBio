import { ThemeProvider } from '@material-ui/core'
import React from 'react'       
import Container from './main/Container'
import { theme } from './components/ui/Theme'

function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <Container />
    </ThemeProvider>
  )
}

export default App
