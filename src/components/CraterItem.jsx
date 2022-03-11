import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
// import React, { useEffect, useRef, useContext } from 'react'
// import { AppContext } from '../context/AppContext'
import '../styles/components/CraterItem.sass'

const CraterItem = ({ id, name, date, price, image }) => {
  const { modal } = useContext(AppContext)

  return (
    <div className={modal.itemId === id ? 'CraterItem--Selected' : 'CraterItem'}>
      <img className='CraterItem__Image' src={image} alt={name} title={name}/>
      <div className="CraterItem__Text-Container">
        <div className="CraterItem__Title-Container">
          <h3 className='CraterItem__Title'>{name}</h3>
          <span className="CraterItem__Id">{`#${id}`}</span>
        </div>
        <span className="CraterItem__Date">{date}</span>
      </div>
      <div className='CraterItem__Price-Container'>
        <span className='CraterItem__Sales'>1 for sale</span>
        <h3 className='CraterItem__Price'>{price}K</h3>
      </div>
    </div>
  )
}

export default CraterItem