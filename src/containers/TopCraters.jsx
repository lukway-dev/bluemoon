import React, { useState } from 'react'
import CraterItem from '../components/CraterItem'
import Sort from '../components/Sort'
import cratersData from '../database/cratersData'
import '../styles/containers/TopCraters.sass'
import { useEffect } from 'react'

const TopCraters = () => {
  const [ data, setData ] = useState(cratersData)

  const sortArray = (key) => {
    const currentData = [...data]

    if(key === 'date') {
      currentData.sort(function(a, b){
        if(Date.parse(a[key]) < Date.parse(b[key])) return 1
        if(Date.parse(a[key]) > Date.parse(b[key])) return -1
        return 0
      })
    } else if (key === 'name') {
      currentData.sort(function(a, b){
        if((a.name) < (b.name)) return -1
        if((a.name) > (b.name)) return 1
        return 0
      })
    } else if (key === 'name-invert') {
      currentData.sort(function(a, b){
        if((a.name) < (b.name)) return 1
        if((a.name) > (b.name)) return -1
        return 0
      })
    } else {
      currentData.sort(function(a, b){
        if(a[key] < b[key]) return 1
        if(a[key] > b[key]) return -1
        return 0
      })
    }

    setData(currentData)
  }

  useEffect(() => {
    sortArray('date')
  }, [])

  return (
    <aside className='TopCraters'>
      <div className="TopCraters__Header">
        <div className='TopCraters__Title-Container'>
          <img className='TopCraters__Icon' src='./bluemoon/assets/asteroide.svg'/>
          <h1 className='TopCraters__Title'>
            <span className='TopCraters__Title--Highlight'>Top</span> Craters
          </h1>
        </div>
        <Sort sortArray={sortArray}/>
      </div>
      <div className='TopCraters__Items-Container'>
        {data.map(item => (
          <CraterItem key={item.id} {...item}/>
        ))}
      </div>
    </aside>
  )
}

export default TopCraters