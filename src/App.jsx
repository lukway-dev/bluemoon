import React from 'react'
import Planet from './components/Planet'
import Modal from './components/Modal'
import Header from './containers/Header'
import TopCraters from './containers/TopCraters'
import './styles/App.sass'
import './styles/components/PlanetItem.sass'

const App = () => {
  return (
    <main className='App'>
      <div id="controls"></div>
      <Header/>
      <TopCraters/>
      <Planet/>
      <Modal/>
    </main>
  )
}

export default App