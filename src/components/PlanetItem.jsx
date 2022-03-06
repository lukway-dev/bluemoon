import React from 'react'
import '../styles/components/PlanetItem.sass'

const PlanetItem = ({ id, name, image }) => {
  return (
    <div id={`PlanetItem-${id}`} className='PlanetItem'>
      <img className='PlanetItem__Image' src={image} alt={name}/>
      <div className="PlanetItem__Text-Container">
        <span className="PlanetItem__Text">{name}</span>
      </div>
    </div>
  )
}

export default PlanetItem