import React from 'react'
import Planet from './components/Planet'
import PlanetItem from './components/PlanetItem'
import Header from './containers/Header'
import TopCraters from './containers/TopCraters'
import cratersData from './database/cratersData'
import './styles/App.sass'

const App = () => {
  return (
    <main className='App'>
      <Header/>
      <TopCraters/>
      {
        cratersData.map(item => (
          <PlanetItem key={item.id} {...item}/>
        ))
      }
      <Planet/>
    </main>
  )
}

export default App